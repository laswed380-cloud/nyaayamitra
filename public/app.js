const state = {
  bootstrap: null,
  busy: false,
  conversation: [],
  profile: {},
  pendingAttachments: []
};

const starterPrompts = [
  'I want to update company name and objects.',
  'I am opening a restaurant in Bengaluru. What should I do first?',
  'Guide me through GST, tax, and monthly compliance for an IT company.',
  'Tell me the approvals for a hospital in Karnataka.',
  'Prepare a filing packet for GST registration.'
];

const app = document.querySelector('#app');

boot();

document.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (event.target.id !== 'chat-form') return;

  const form = event.target;
  const formData = new FormData(form);
  const message = String(formData.get('message') || '').trim();

  if (!message && !state.pendingAttachments.length) return;

  form.reset();
  await sendMessage(message || 'Please review the attached files.');
});

document.addEventListener('keydown', async (event) => {
  if (event.target.id !== 'chat-input') return;
  if (event.key !== 'Enter' || event.shiftKey) return;
  event.preventDefault();
  const form = event.target.closest('form');
  if (form) form.requestSubmit();
});

document.addEventListener('click', async (event) => {
  const starter = event.target.closest('[data-starter]');
  if (starter) {
    await sendMessage(starter.dataset.starter);
    return;
  }

  const choiceButton = event.target.closest('[data-choice-message]');
  if (choiceButton) {
    const messageIndex = Number(choiceButton.dataset.choiceMessage);
    const promptIndex = Number(choiceButton.dataset.choicePrompt);
    const choiceIndex = Number(choiceButton.dataset.choiceOption);
    const choice = state.conversation[messageIndex]?.prompts?.[promptIndex]?.choices?.[choiceIndex];
    if (choice) {
      await sendMessage(choice.sendText || choice.label, { patch: choice.patch || {} });
    }
    return;
  }

  const attachButton = event.target.closest('[data-attach]');
  if (attachButton) {
    const input = document.querySelector('#file-input');
    if (input) input.click();
    return;
  }

  const removeButton = event.target.closest('[data-remove-attachment]');
  if (removeButton) {
    const index = Number(removeButton.dataset.removeAttachment);
    state.pendingAttachments.splice(index, 1);
    render();
  }
});

document.addEventListener('change', (event) => {
  if (event.target.id !== 'file-input') return;

  const files = Array.from(event.target.files || []);
  for (const file of files) {
    state.pendingAttachments.push({
      name: file.name,
      size: file.size,
      sizeLabel: formatBytes(file.size),
      type: file.type || 'file'
    });
  }
  event.target.value = '';
  render();
});

async function boot() {
  try {
    state.bootstrap = await api('/api/bootstrap');
    state.conversation = [
      assistantMessage({
        text: 'Tell me what your business needs, what is already done, or where things feel stuck. I will turn it into a clear next-step path across licences, filings, tax, safety, payroll, and renewals.',
        quickFacts: ['One conversation', 'Karnataka-aware', 'Source-backed workflow']
      })
    ];
    render();
  } catch (error) {
    app.innerHTML = `<section class="chat-page"><div class="chat-shell"><article class="message assistant"><div class="bubble"><p>${escapeHtml(error.message)}</p></div></article></div></section>`;
  }
}

async function sendMessage(message, options = {}) {
  const attachments = [...state.pendingAttachments];
  state.pendingAttachments = [];
  if (options.patch) {
    state.profile = mergeProfile(state.profile, options.patch);
  }

  state.conversation.push(userMessage(message, attachments));
  state.busy = true;
  render();

  try {
    const { result } = await api('/api/chat/concierge', {
      method: 'POST',
      body: JSON.stringify({
        message,
        profile: state.profile,
        attachments
      })
    });

    state.profile = mergeProfile(state.profile, result.collectedProfile || {});

    let toolResult = null;
    if (result.autoRun) {
      toolResult = await runHiddenTool(result.suggestedActions?.[0]);
    }

    state.conversation.push(buildAssistantTurn(result, toolResult));
  } catch (error) {
    state.conversation.push(
      assistantMessage({
        text: `Something snagged while I was organizing that. ${error.message}`,
        quickFacts: ['Nothing was submitted', 'No hidden filing was marked complete']
      })
    );
  } finally {
    state.busy = false;
    render();
  }
}

async function runHiddenTool(action) {
  if (!action?.view) return null;

  const handlers = {
    'entity-snapshot': async (prefill) => {
      const { result } = await api('/api/entity-identifier/snapshot', {
        method: 'POST',
        body: JSON.stringify(prefill)
      });
      return { kind: 'entity-snapshot', data: result };
    },
    'compliance-manager': async (prefill) => {
      const { result } = await api('/api/compliance-manager/plan', {
        method: 'POST',
        body: JSON.stringify(prefill)
      });
      return { kind: 'compliance-manager', data: result };
    },
    submissions: async (prefill) => {
      const { result } = await api('/api/submissions/prepare', {
        method: 'POST',
        body: JSON.stringify(prefill)
      });
      return { kind: 'submissions', data: result };
    },
    launch: async (prefill) => {
      const { result } = await api('/api/launch/autopilot', {
        method: 'POST',
        body: JSON.stringify(prefill)
      });
      return { kind: 'launch', data: result };
    },
    library: async () => {
      const { library } = await api('/api/library');
      return { kind: 'library', data: library };
    }
  };

  const runner = handlers[action.view];
  return runner ? runner(action.prefill || {}) : null;
}

function buildAssistantTurn(concierge, toolResult) {
  const visual = buildVisual(toolResult);
  const quickFacts = [...(concierge.quickFacts || [])];
  if (visual?.chips?.length) quickFacts.push(...visual.chips);

  return assistantMessage({
    text: buildAssistantText(concierge, toolResult),
    prompts: concierge.clarificationPrompts || [],
    quickFacts: dedupeList(quickFacts).slice(0, 6),
    visual,
    sources: extractSources(toolResult)
  });
}

function buildAssistantText(concierge, toolResult) {
  const parts = [concierge.reply];

  if (toolResult?.kind === 'compliance-manager') {
    parts.push('');
    parts.push('I have mapped the likely approval and compliance stack so you can see what needs attention first.');
  } else if (toolResult?.kind === 'entity-snapshot') {
    parts.push('');
    parts.push('I have started with the identifier itself so you can see the company baseline before we ask for extra business details.');
  } else if (toolResult?.kind === 'submissions') {
    parts.push('');
    parts.push('I have turned that into a filing packet structure so the work is ready for review, upload, and follow-up.');
  } else if (toolResult?.kind === 'launch') {
    parts.push('');
    parts.push('I have broken the setup work into a cleaner operating sequence so it is easier to move one step at a time.');
  } else if (toolResult?.kind === 'library') {
    parts.push('');
    parts.push('I have also pulled the official source layer behind the answer so you can trace the route and portal choices.');
  }

  if (Array.isArray(concierge.clarificationPrompts) && concierge.clarificationPrompts.length) {
    parts.push('');
    parts.push('Pick the closest answer below and I will tighten the path.');
  }

  return parts.join('\n');
}

function buildVisual(toolResult) {
  if (!toolResult) return null;
  const { kind, data } = toolResult;

  if (kind === 'entity-snapshot') {
    return {
      kind,
      title: data.identity?.identifierValue || data.title || 'Business snapshot',
      subtitle: data.identity?.entityType || data.readinessLabel || '',
      score: data.readinessScore || 0,
      chips: [
        data.identity?.state ? `State: ${data.identity.state}` : null,
        data.identity?.incorporationYear ? `Year: ${data.identity.incorporationYear}` : null,
        data.identity?.listingStatus ? data.identity.listingStatus : null
      ].filter(Boolean),
      cards: [
        card('What I can already see', (data.statusBoard || []).slice(0, 4).map((item) => `${item.label} - ${item.status}`)),
        card('Likely next checks', (data.immediateChecks || []).slice(0, 5)),
        card('Still needed for full accuracy', (data.unknowns || []).slice(0, 5))
      ]
    };
  }

  if (kind === 'compliance-manager') {
    return {
      kind,
      title: data.businessProfile?.businessType || 'Compliance snapshot',
      subtitle: data.readinessLabel || '',
      score: data.readinessScore || 0,
      chips: [
        `Readiness ${data.readinessScore || 0}%`,
        `${data.criticalStops?.length || 0} critical stops`,
        `${data.actionPlan?.length || 0} tracked items`
      ],
      cards: [
        card('Immediate priorities', (data.actionPlan || []).slice(0, 4).map((item) => `${item.title} - ${item.nextAction}`)),
        card('Renewals and recurring work', (data.recurringCalendar || []).slice(0, 4).map((item) => `${item.title} - ${item.cadence}`))
      ],
      bars: (data.dimensionCoverage || []).slice(0, 6).map((item) => ({
        label: item.name,
        value: item.score,
        meta: `${item.status} · ${item.open} open`
      }))
    };
  }

  if (kind === 'submissions') {
    return {
      kind,
      title: data.title || 'Submission packet',
      subtitle: data.authority || '',
      score: 72,
      chips: [
        data.authority ? `Authority: ${data.authority}` : null,
        data.portalName ? `Portal: ${data.portalName}` : null
      ].filter(Boolean),
      cards: [
        card('Process', (data.packetStages || []).slice(0, 5)),
        card('Keep ready', (data.documentsRequired || []).slice(0, 5)),
        card('Forms', (data.forms || []).slice(0, 5))
      ]
    };
  }

  if (kind === 'launch') {
    return {
      kind,
      title: 'Launch sequence',
      subtitle: data.readinessLabel || '',
      score: data.readinessScore || 0,
      chips: [
        `Readiness ${data.readinessScore || 0}%`,
        `${data.workstreams?.length || 0} tracks`
      ],
      cards: [
        card('What to line up first', (data.workstreams || []).slice(0, 4).map((item) => `${item.name} - ${item.why}`)),
        card('First seven days', (data.firstSevenDays || []).slice(0, 5))
      ]
    };
  }

  if (kind === 'library') {
    return {
      kind,
      title: 'Official source layer',
      subtitle: 'Current portal set',
      score: 100,
      chips: [
        `${data.sectors?.length || 0} sectors`,
        `${data.packages?.length || 0} compliance packs`,
        `${data.sources?.length || 0} official sources`
      ],
      cards: [
        card('Coverage', (data.sectors || []).slice(0, 4).map((item) => `${item.name} - ${item.category}`)),
        card('Update policy', data.updatePolicy || [])
      ]
    };
  }

  return null;
}

function extractSources(toolResult) {
  if (!toolResult) return [];
  const { kind, data } = toolResult;

  if (kind === 'compliance-manager') {
    return (data.citations || []).slice(0, 5);
  }
  if (kind === 'entity-snapshot') {
    return (data.citations || []).slice(0, 5);
  }
  if (kind === 'launch') {
    return (data.citations || []).slice(0, 4);
  }
  if (kind === 'library') {
    return (data.sources || []).slice(0, 5);
  }
  if (kind === 'submissions') {
    return [{
      name: data.portalName || 'Portal',
      url: data.portalUrl || '',
      relevance: 'Portal route for the filing packet',
      lastVerified: '2026-04-08'
    }].filter((item) => item.url);
  }
  return [];
}

function render() {
  document.title = state.bootstrap?.meta?.app || 'NyaayaMitra Launchpad';

  app.innerHTML = `
    <section class="chat-page">
      <div class="hero-strip">
        <p class="eyebrow">NyaayaMitra</p>
        <h1>Compliance feels heavy. We turn business facts into a clear path.</h1>
        <p class="hero-copy">Licences, tax, filings, safety, payroll, renewals, and evidence. One calm conversation, one organized workflow underneath.</p>
        <div class="starter-row">
          ${starterPrompts.map((prompt) => `<button class="starter-chip" type="button" data-starter="${escapeHtml(prompt)}">${escapeHtml(prompt)}</button>`).join('')}
        </div>
      </div>

      <section class="chat-shell">
        <div class="chat-scroll" id="chat-scroll">
          ${state.conversation.map((message, index) => renderMessage(message, index)).join('')}
          ${state.busy ? renderTyping() : ''}
        </div>

        <form id="chat-form" class="composer">
          <input id="file-input" type="file" multiple hidden>
          ${state.pendingAttachments.length ? `
            <div class="attachment-row">
              ${state.pendingAttachments.map((file, index) => `
                <span class="attachment-chip">
                  <span>${escapeHtml(file.name)}${file.sizeLabel ? ` · ${escapeHtml(file.sizeLabel)}` : ''}</span>
                  <button type="button" data-remove-attachment="${index}" aria-label="Remove attachment">×</button>
                </span>
              `).join('')}
            </div>
          ` : ''}
          <div class="composer-shell">
            <button class="attach-button" type="button" data-attach aria-label="Attach files">+</button>
            <textarea id="chat-input" name="message" placeholder="Tell me what the business does, what is already done, or what you want handled next."></textarea>
            <button class="send-button" type="submit">Send</button>
          </div>
          <div class="composer-note">
            <span>Press Enter to send. Shift+Enter for a new line.</span>
            <span>Upload files when they help the intake trail.</span>
          </div>
        </form>
      </section>
    </section>
  `;

  const scroller = document.querySelector('#chat-scroll');
  if (scroller) scroller.scrollTop = scroller.scrollHeight;
}

function renderMessage(message, messageIndex) {
  const classes = `message ${message.role}`;
  return `
    <article class="${classes}">
      <div class="bubble">
        <div class="bubble-head">
          <span class="speaker">${message.role === 'assistant' ? 'NyaayaMitra' : 'You'}</span>
        </div>
        <p class="bubble-text">${renderMultiline(message.text)}</p>
        ${message.attachments?.length ? renderAttachmentList(message.attachments) : ''}
        ${message.quickFacts?.length ? `<div class="fact-row">${message.quickFacts.map((item) => `<span class="fact-chip">${escapeHtml(item)}</span>`).join('')}</div>` : ''}
        ${message.visual ? renderVisual(message.visual) : ''}
        ${message.prompts?.length ? renderPrompts(message.prompts, messageIndex) : ''}
        ${message.sources?.length ? renderSources(message.sources) : ''}
      </div>
    </article>
  `;
}

function renderVisual(visual) {
  return `
    <section class="visual-block">
      <div class="visual-header">
        <div>
          <h3>${escapeHtml(visual.title || '')}</h3>
          ${visual.subtitle ? `<p>${escapeHtml(visual.subtitle)}</p>` : ''}
        </div>
        ${typeof visual.score === 'number' ? `<div class="score-pill">${escapeHtml(String(visual.score))}%</div>` : ''}
      </div>
      ${visual.bars?.length ? `
        <div class="bar-list">
          ${visual.bars.map((item) => `
            <div class="bar-card">
              <div class="bar-label-row">
                <strong>${escapeHtml(item.label)}</strong>
                <span>${escapeHtml(item.meta || '')}</span>
              </div>
              <div class="bar-track"><span style="width:${Math.max(8, Math.min(item.value, 100))}%"></span></div>
            </div>
          `).join('')}
        </div>
      ` : ''}
      ${visual.cards?.length ? `
        <div class="mini-grid">
          ${visual.cards.map((cardItem) => `
            <article class="mini-card">
              <h4>${escapeHtml(cardItem.title)}</h4>
              <ul>
                ${cardItem.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
              </ul>
            </article>
          `).join('')}
        </div>
      ` : ''}
    </section>
  `;
}

function renderPrompts(prompts, messageIndex) {
  return prompts.map((prompt, promptIndex) => `
    <section class="prompt-block">
      <p class="prompt-question">${escapeHtml(prompt.question)}</p>
      <div class="choice-row">
        ${prompt.choices.map((choice, choiceIndex) => `
          <button
            class="choice-chip"
            type="button"
            data-choice-message="${messageIndex}"
            data-choice-prompt="${promptIndex}"
            data-choice-option="${choiceIndex}">
            ${escapeHtml(choice.label)}
          </button>
        `).join('')}
      </div>
    </section>
  `).join('');
}

function renderSources(sources) {
  return `
    <section class="source-block">
      <p class="source-title">Official anchors used</p>
      <div class="source-list">
        ${sources.map((source) => `
          <a class="source-chip" href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">
            <span>${escapeHtml(source.name || 'Source')}</span>
            ${source.lastVerified ? `<small>Verified ${escapeHtml(source.lastVerified)}</small>` : ''}
          </a>
        `).join('')}
      </div>
    </section>
  `;
}

function renderAttachmentList(attachments) {
  return `
    <div class="attachment-list">
      ${attachments.map((file) => `<span class="fact-chip">${escapeHtml(file.name)}${file.sizeLabel ? ` · ${escapeHtml(file.sizeLabel)}` : ''}</span>`).join('')}
    </div>
  `;
}

function renderTyping() {
  return `
    <article class="message assistant">
      <div class="bubble typing">
        <span></span><span></span><span></span>
      </div>
    </article>
  `;
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error?.message || 'Request failed');
  return payload;
}

function assistantMessage(input) {
  return {
    role: 'assistant',
    text: input.text,
    prompts: input.prompts || [],
    quickFacts: input.quickFacts || [],
    visual: input.visual || null,
    sources: input.sources || [],
    attachments: input.attachments || []
  };
}

function userMessage(text, attachments = []) {
  return {
    role: 'user',
    text,
    attachments
  };
}

function mergeProfile(current, next) {
  const merged = { ...current };
  for (const [key, value] of Object.entries(next || {})) {
    if (value === '' || value == null || value === 0) continue;
    merged[key] = value;
  }
  if (typeof next?.servesAlcohol === 'boolean') merged.servesAlcohol = next.servesAlcohol;
  return merged;
}

function card(title, items) {
  return { title, items: items.filter(Boolean) };
}

function dedupeList(items) {
  return [...new Set(items.filter(Boolean))];
}

function renderMultiline(text) {
  return escapeHtml(text).replace(/\n/g, '<br>');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatBytes(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
