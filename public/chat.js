const state = {
  bootstrap: null,
  busy: false,
  conversation: [],
  profile: {},
  pendingAttachments: []
};

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
  const choiceButton = event.target.closest('[data-choice-message]');
  if (choiceButton) {
    const messageIndex = Number(choiceButton.dataset.choiceMessage);
    const promptIndex = Number(choiceButton.dataset.choicePrompt);
    const choiceIndex = Number(choiceButton.dataset.choiceOption);
    const choice = state.conversation[messageIndex]?.prompts?.[promptIndex]?.choices?.[choiceIndex];
    if (choice) {
      await sendMessage(choice.label, { patch: choice.patch || {} });
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
    // AI generates the greeting — no hardcoded text
    state.conversation = [];
    state.busy = true;
    render();

    try {
      const { result } = await api('/api/chat/respond', {
        method: 'POST',
        body: JSON.stringify({
          message: '__BOOT__',
          profile: {}
        })
      });
      state.conversation = [buildAssistantTurn(result)];
    } catch (_greetError) {
      // Minimal fallback only if AI is completely unreachable
      state.conversation = [
        assistantMessage({
          text: 'Welcome to NyaayaMitra. Tell me about your business — what it does, where it is, and what compliance or legal question you need help with. I will analyze your specific situation and give you actionable guidance.'
        })
      ];
    }
    state.busy = false;
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
    const { result } = await api('/api/chat/respond', {
      method: 'POST',
      body: JSON.stringify({
        message,
        profile: state.profile,
        attachments
      })
    });

    state.profile = mergeProfile(state.profile, result.collectedProfile || {});
    state.conversation.push(buildAssistantTurn(result));
  } catch (error) {
    state.conversation.push(
      assistantMessage({
        text: `I ran into a temporary issue: ${error.message}. Please try again — no submissions or filings were triggered.`
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
    'government-lookup': async (prefill) => {
      const { result } = await api('/api/government-lookup', {
        method: 'POST',
        body: JSON.stringify(prefill)
      });
      return { kind: 'government-lookup', data: result };
    },
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

function buildAssistantTurn(turn) {
  const toolResults = Array.isArray(turn.toolResults) ? turn.toolResults.filter(Boolean) : [];
  const visuals = toolResults.map((item) => buildVisual(item)).filter(Boolean);
  const quickFacts = [...(turn.quickFacts || [])];
  for (const visual of visuals) {
    if (visual?.chips?.length) quickFacts.push(...visual.chips);
  }

  return assistantMessage({
    text: turn.reply,
    prompts: turn.clarificationPrompts || [],
    quickFacts: dedupeList(quickFacts).slice(0, 6),
    visuals,
    sources: extractSources(toolResults)
  });
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
        card('Still needed for full accuracy', (data.unknowns || []).slice(0, 5)),
        card('Official source map', (data.sourceMatrix || []).slice(0, 4).map((item) => `${item.name} - ${item.canShow}`))
      ]
    };
  }

  if (kind === 'government-lookup') {
    return {
      kind,
      title: data.identity?.identifierValue || data.title || 'Official-source lookup',
      subtitle: data.identity?.entityType || '',
      chips: [
        data.identity?.state ? `State: ${data.identity.state}` : null,
        data.identity?.incorporationYear ? `Year: ${data.identity.incorporationYear}` : null,
        data.identity?.listingStatus ? data.identity.listingStatus : null
      ].filter(Boolean),
      cards: [
        card('What this identifier can prove', (data.whatThisIdentifierCanShow || []).slice(0, 4)),
        card('What still needs official records', (data.recordsStillNeeded || []).slice(0, 5)),
        card('Official checks to open next', (data.officialChecks || []).slice(0, 4).map((item) => `${item.name} - ${item.status}`)),
        card('Next moves', (data.nextMoves || []).slice(0, 4))
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
        meta: `${item.status} - ${item.open} open`
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

function extractSources(toolResults) {
  const results = Array.isArray(toolResults) ? toolResults : toolResults ? [toolResults] : [];
  const collected = [];

  for (const toolResult of results) {
    if (!toolResult) continue;
    const { kind, data } = toolResult;
    if (kind === 'government-lookup') collected.push(...normalizeSources((data.citations || []).slice(0, 6)));
    if (kind === 'compliance-manager') collected.push(...normalizeSources((data.citations || []).slice(0, 5)));
    if (kind === 'entity-snapshot') collected.push(...normalizeSources((data.citations || []).slice(0, 5)));
    if (kind === 'launch') collected.push(...normalizeSources((data.citations || []).slice(0, 4)));
    if (kind === 'library') collected.push(...normalizeSources((data.sources || []).slice(0, 5)));
    if (kind === 'submissions' && data.portalUrl) {
      collected.push({
        name: data.portalName || 'Portal',
        url: data.portalUrl || '',
        relevance: 'Portal route for the filing packet',
        lastVerified: '2026-04-08'
      });
    }
  }

  return dedupeSources(collected);
}

function render() {
  document.title = state.bootstrap?.meta?.app || 'NyaayaMitra Launchpad';

  app.innerHTML = `
    <section class="chat-page">
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
                  <span>${escapeHtml(file.name)}${file.sizeLabel ? ` - ${escapeHtml(file.sizeLabel)}` : ''}</span>
                  <button type="button" data-remove-attachment="${index}" aria-label="Remove attachment">x</button>
                </span>
              `).join('')}
            </div>
          ` : ''}
          <div class="composer-shell">
            <button class="attach-button" type="button" data-attach aria-label="Attach files">+</button>
            <textarea id="chat-input" name="message" placeholder="Describe the business, paste an identifier, or upload the documents you already have."></textarea>
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
        ${Array.isArray(message.visuals) ? message.visuals.map((visual) => renderVisual(visual)).join('') : message.visual ? renderVisual(message.visual) : ''}
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
      <p class="source-title">Official sources</p>
      <div class="source-list">
        ${sources.map((source) => `
          <a class="source-chip" href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">
            <span>${escapeHtml(source.name || source.source || source.url || 'Source')}</span>
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
      ${attachments.map((file) => `<span class="fact-chip">${escapeHtml(file.name)}${file.sizeLabel ? ` - ${escapeHtml(file.sizeLabel)}` : ''}</span>`).join('')}
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
    visuals: input.visuals || (input.visual ? [input.visual] : []),
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

function normalizeSources(items) {
  return items.map((item) => ({
    ...item,
    name: item.name || item.source || item.url || 'Source'
  }));
}

function dedupeSources(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = `${item.name || ''}|${item.url || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
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

