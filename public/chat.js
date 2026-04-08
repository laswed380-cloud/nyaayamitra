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
    return;
  }

  // AI Auto-Fill button — use Claude to intelligently fill form fields
  const aiFillButton = event.target.closest('[data-form-ai-fill]');
  if (aiFillButton) {
    const formId = aiFillButton.dataset.formAiFill;
    const cardEl = aiFillButton.closest('.form-card');
    if (cardEl) {
      aiFillButton.textContent = 'AI filling...';
      aiFillButton.disabled = true;
      aiAutoFillForm(formId, cardEl);
    }
    return;
  }

  // Form fill button — expand inline form in place of the card
  const fillButton = event.target.closest('[data-form-fill]');
  if (fillButton) {
    const formId = fillButton.dataset.formFill;
    const cardEl = fillButton.closest('.form-card');
    if (cardEl) {
      const formData = findFormDataInConversation(formId);
      if (formData) {
        cardEl.outerHTML = renderInlineForm(formData);
      }
    }
    return;
  }

  // Form download button
  const dlButton = event.target.closest('[data-form-download]');
  if (dlButton) {
    const formId = dlButton.dataset.formDownload;
    const formData = findFormDataInConversation(formId);
    downloadForm(formId, formData || {});
    return;
  }

  // Inline form generate & download
  const genButton = event.target.closest('[data-form-generate]');
  if (genButton) {
    const formId = genButton.dataset.formGenerate;
    const collected = collectInlineFormData(formId);
    const baseData = findFormDataInConversation(formId) || {};
    downloadForm(formId, { ...baseData, filledValues: collected });
    return;
  }

  // Inline form cancel — re-render the card
  const cancelButton = event.target.closest('[data-form-cancel]');
  if (cancelButton) {
    const formId = cancelButton.dataset.formCancel;
    const inlineEl = cancelButton.closest('.inline-form');
    if (inlineEl) {
      const formData = findFormDataInConversation(formId);
      if (formData) {
        inlineEl.outerHTML = renderFormCard(formData);
      }
    }
    return;
  }

  // Workflow step expand
  const expandButton = event.target.closest('[data-workflow-expand]');
  if (expandButton) {
    const formId = expandButton.dataset.workflowExpand;
    const stepEl = expandButton.closest('.workflow-step, .workflow-step-active, .workflow-step-complete');
    if (stepEl) {
      const formData = findFormDataInConversation(formId);
      if (formData) {
        const inlineHtml = renderInlineForm(formData);
        stepEl.insertAdjacentHTML('afterend', `<div class="workflow-inline-wrapper" data-workflow-inline="${escapeHtml(formId)}">${inlineHtml}</div>`);
        expandButton.textContent = 'Close';
        expandButton.removeAttribute('data-workflow-expand');
        expandButton.setAttribute('data-workflow-collapse', formId);
      }
    }
    return;
  }

  // Workflow step collapse
  const collapseButton = event.target.closest('[data-workflow-collapse]');
  if (collapseButton) {
    const formId = collapseButton.dataset.workflowCollapse;
    const wrapper = document.querySelector(`[data-workflow-inline="${formId}"]`);
    if (wrapper) wrapper.remove();
    collapseButton.textContent = 'Open';
    collapseButton.removeAttribute('data-workflow-collapse');
    collapseButton.setAttribute('data-workflow-expand', formId);
    return;
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

  if (kind === 'form-package') {
    return { kind, formData: data };
  }

  if (kind === 'form-workflow') {
    return { kind, workflowData: data };
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
    if (kind === 'form-package' && data.portalUrl) {
      collected.push({
        name: data.portalName || data.authority || 'Filing Portal',
        url: data.portalUrl || '',
        relevance: 'Portal for form filing',
        lastVerified: '2026-04-08'
      });
    }
    if (kind === 'form-package') collected.push(...normalizeSources((data.citations || []).slice(0, 4)));
    if (kind === 'form-workflow') collected.push(...normalizeSources((data.citations || []).slice(0, 4)));
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
  if (visual.kind === 'form-package') return renderFormCard(visual.formData);
  if (visual.kind === 'form-workflow') return renderWorkflowForms(visual.workflowData);

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

// ─── Form Package Rendering ─────────────────────────────────────────

function renderFormCard(formData) {
  const form = formData || {};
  const formName = form.formName || form.name || 'Untitled Form';
  const authority = form.authority || '';
  const portalUrl = form.portalUrl || '';
  const portalName = form.portalName || 'Filing Portal';
  const sections = form.sections || [];
  const documents = form.documents || form.documentsRequired || [];
  const portalInstructions = form.portalInstructions || form.filingSteps || [];
  const formId = form.formId || form.id || slugify(formName);

  // Calculate field progress
  let totalFields = 0;
  let filledFields = 0;
  const sectionSummaries = [];

  for (const section of sections) {
    const fields = section.fields || [];
    const sectionTotal = fields.length;
    const sectionFilled = fields.filter((f) => f.value != null && f.value !== '').length;
    totalFields += sectionTotal;
    filledFields += sectionFilled;
    sectionSummaries.push({
      name: section.name || section.title || 'Section',
      total: sectionTotal,
      filled: sectionFilled
    });
  }

  const progressPercent = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;

  return `
    <section class="form-card" data-form-id="${escapeHtml(formId)}">
      <div class="form-card-header">
        <div class="form-card-title-row">
          <h3>${escapeHtml(formName)}</h3>
          ${authority ? `<span class="form-card-authority">${escapeHtml(authority)}</span>` : ''}
        </div>
        ${portalUrl ? `<a class="form-btn form-btn-portal" href="${escapeHtml(portalUrl)}" target="_blank" rel="noreferrer">${escapeHtml(portalName)}</a>` : ''}
      </div>

      <div class="form-card-progress">
        <div class="form-card-progress-label">
          <span>${filledFields} of ${totalFields} fields filled</span>
          <span class="form-card-progress-pct">${progressPercent}%</span>
        </div>
        <div class="form-card-progress-track">
          <div class="form-card-progress-fill" style="width:${progressPercent}%"></div>
        </div>
      </div>

      ${sectionSummaries.length ? `
        <div class="form-card-sections">
          ${sectionSummaries.map((s) => `
            <div class="form-card-section-row">
              <span class="form-card-section-icon ${s.filled === s.total && s.total > 0 ? 'filled' : 'missing'}">${s.filled === s.total && s.total > 0 ? '&#10003;' : '&#10007;'}</span>
              <span class="form-card-section-name">${escapeHtml(s.name)}</span>
              <span class="form-card-section-count">${s.filled}/${s.total}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div class="form-card-actions">
        <button class="form-btn form-btn-ai-fill" type="button" data-form-ai-fill="${escapeHtml(formId)}">AI Auto-Fill</button>
        <button class="form-btn form-btn-fill" type="button" data-form-fill="${escapeHtml(formId)}">Manual Fill</button>
        <button class="form-btn form-btn-download" type="button" data-form-download="${escapeHtml(formId)}">Download Form</button>
      </div>

      ${portalInstructions.length ? `
        <details class="form-card-portal-details">
          <summary>Portal Instructions</summary>
          <ol class="form-card-portal-steps">
            ${portalInstructions.map((step) => `<li>${escapeHtml(typeof step === 'string' ? step : step.step || step.instruction || '')}</li>`).join('')}
          </ol>
        </details>
      ` : ''}

      ${documents.length ? `
        <div class="doc-checklist">
          <p class="doc-checklist-title">Required Documents</p>
          ${documents.map((doc, i) => {
            const docName = typeof doc === 'string' ? doc : doc.name || doc.document || '';
            return `
              <label class="doc-checklist-item">
                <input type="checkbox" data-doc-check="${formId}-${i}">
                <span>${escapeHtml(docName)}</span>
              </label>
            `;
          }).join('')}
        </div>
      ` : ''}
    </section>
  `;
}

function renderInlineForm(form) {
  const formData = form || {};
  const sections = formData.sections || [];
  const formId = formData.formId || formData.id || slugify(formData.formName || formData.name || 'form');

  return `
    <div class="inline-form" data-inline-form-id="${escapeHtml(formId)}">
      <div class="inline-form-header">
        <h4>${escapeHtml(formData.formName || formData.name || 'Fill Form')}</h4>
      </div>
      ${sections.map((section) => `
        <fieldset class="form-section">
          <legend>${escapeHtml(section.name || section.title || 'Section')}</legend>
          ${(section.fields || []).map((field) => {
            const fieldId = `${formId}-${slugify(field.name || field.label || 'field')}`;
            const isRequired = field.required !== false;
            const isFilled = field.value != null && field.value !== '';
            const fieldType = field.type || 'text';
            const fieldClasses = `form-field ${isFilled ? 'field-filled' : ''} ${isRequired && !isFilled ? 'field-missing' : ''}`;

            let inputHtml = '';
            if (fieldType === 'select' && Array.isArray(field.options)) {
              inputHtml = `
                <select id="${escapeHtml(fieldId)}" name="${escapeHtml(field.name || field.label || '')}" data-form-field="${escapeHtml(formId)}" ${isRequired ? 'required' : ''}>
                  <option value="">-- Select --</option>
                  ${field.options.map((opt) => {
                    const optVal = typeof opt === 'string' ? opt : opt.value || '';
                    const optLabel = typeof opt === 'string' ? opt : opt.label || opt.value || '';
                    const selected = String(field.value) === String(optVal) ? 'selected' : '';
                    return `<option value="${escapeHtml(optVal)}" ${selected}>${escapeHtml(optLabel)}</option>`;
                  }).join('')}
                </select>
              `;
            } else if (fieldType === 'textarea') {
              inputHtml = `<textarea id="${escapeHtml(fieldId)}" name="${escapeHtml(field.name || field.label || '')}" data-form-field="${escapeHtml(formId)}" rows="3" ${isRequired ? 'required' : ''}>${escapeHtml(field.value || '')}</textarea>`;
            } else if (fieldType === 'date') {
              inputHtml = `<input type="date" id="${escapeHtml(fieldId)}" name="${escapeHtml(field.name || field.label || '')}" data-form-field="${escapeHtml(formId)}" value="${escapeHtml(field.value || '')}" ${isRequired ? 'required' : ''}>`;
            } else if (fieldType === 'number') {
              inputHtml = `<input type="number" id="${escapeHtml(fieldId)}" name="${escapeHtml(field.name || field.label || '')}" data-form-field="${escapeHtml(formId)}" value="${escapeHtml(field.value || '')}" ${isRequired ? 'required' : ''}>`;
            } else {
              inputHtml = `<input type="text" id="${escapeHtml(fieldId)}" name="${escapeHtml(field.name || field.label || '')}" data-form-field="${escapeHtml(formId)}" value="${escapeHtml(field.value || '')}" ${isRequired ? 'required' : ''}>`;
            }

            return `
              <div class="${fieldClasses}">
                <label for="${escapeHtml(fieldId)}">
                  ${escapeHtml(field.label || field.name || 'Field')}
                  ${isRequired ? '<span class="field-required">*</span>' : ''}
                  ${isFilled ? '<span class="field-filled-badge">&#10003;</span>' : ''}
                </label>
                ${inputHtml}
                ${field.help ? `<span class="field-help">${escapeHtml(field.help)}</span>` : ''}
              </div>
            `;
          }).join('')}
        </fieldset>
      `).join('')}
      <div class="inline-form-actions">
        <button class="form-btn form-btn-download" type="button" data-form-generate="${escapeHtml(formId)}">Generate &amp; Download</button>
        <button class="form-btn form-btn-cancel" type="button" data-form-cancel="${escapeHtml(formId)}">Cancel</button>
      </div>
    </div>
  `;
}

async function downloadForm(formId, formData) {
  try {
    const response = await fetch('/api/forms/render', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formId, ...formData })
    });

    if (!response.ok) {
      const errPayload = await response.json().catch(() => ({}));
      throw new Error(errPayload.error?.message || 'Form rendering failed');
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      const html = await response.text();
      const win = window.open('', '_blank');
      if (win) {
        win.document.write(html);
        win.document.close();
      }
    } else {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${formId || 'form'}.html`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }
  } catch (err) {
    alert(`Download failed: ${err.message}`);
  }
}

async function aiAutoFillForm(formId, cardEl) {
  try {
    // Build conversation context from chat history
    const conversationContext = (state.conversation || [])
      .map((turn) => {
        if (turn.role === 'user') return `User: ${turn.message || ''}`;
        if (turn.role === 'assistant') return `Assistant: ${(turn.reply || '').slice(0, 500)}`;
        return '';
      })
      .filter(Boolean)
      .slice(-6)
      .join('\n');

    // Collect profile from the latest conversation state
    const profile = {};
    for (const turn of state.conversation || []) {
      if (turn.collectedProfile) Object.assign(profile, turn.collectedProfile);
    }

    // Get any existing filled data
    const existingFormData = findFormDataInConversation(formId) || {};
    const existingValues = {};
    if (existingFormData.sections) {
      for (const section of existingFormData.sections) {
        for (const field of section.fields || []) {
          if (field.value != null && field.value !== '') {
            existingValues[field.id] = field.value;
          }
        }
      }
    }

    const response = await fetch('/api/forms/ai-fill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formId,
        profile,
        formData: existingValues,
        conversationContext,
        userMessage: (state.conversation || []).filter((t) => t.role === 'user').pop()?.message || ''
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || 'AI fill failed');
    }

    const { result } = await response.json();

    // Now download the AI-filled form immediately
    const filledData = result.filledData || {};
    downloadForm(formId, { formData: filledData });

    // Update the card to show completion
    if (cardEl) {
      const pctEl = cardEl.querySelector('.form-card-progress-pct');
      if (pctEl) pctEl.textContent = result.completionPercent + '%';
      const fillEl = cardEl.querySelector('.form-card-progress-fill');
      if (fillEl) fillEl.style.width = result.completionPercent + '%';
      const labelEl = cardEl.querySelector('.form-card-progress-label span');
      if (labelEl) labelEl.textContent = `${result.filledCount} of ${result.totalFields} fields filled by AI`;
      const aiBtn = cardEl.querySelector('[data-form-ai-fill]');
      if (aiBtn) {
        aiBtn.textContent = `AI Filled (${result.completionPercent}%)`;
        aiBtn.disabled = false;
      }
    }
  } catch (err) {
    alert(`AI auto-fill failed: ${err.message}`);
    const aiBtn = cardEl?.querySelector('[data-form-ai-fill]');
    if (aiBtn) {
      aiBtn.textContent = 'AI Auto-Fill';
      aiBtn.disabled = false;
    }
  }
}

function renderWorkflowForms(workflowData) {
  const data = workflowData || {};
  const forms = data.forms || data.steps || [];
  const workflowTitle = data.title || data.name || 'Filing Workflow';

  return `
    <section class="workflow-forms">
      <div class="workflow-header">
        <h3>${escapeHtml(workflowTitle)}</h3>
        ${data.description ? `<p>${escapeHtml(data.description)}</p>` : ''}
      </div>
      <div class="workflow-steps">
        ${forms.map((form, index) => {
          const status = form.status || 'not-started';
          const stepClass = status === 'ready' || status === 'complete' ? 'workflow-step-complete' :
                            status === 'in-progress' ? 'workflow-step-active' : 'workflow-step';
          const statusIcon = status === 'ready' || status === 'complete' ? '&#10003;' :
                             status === 'in-progress' ? '&#9679;' : `${index + 1}`;
          const formId = form.formId || form.id || slugify(form.name || form.formName || `step-${index}`);
          const deps = form.dependsOn || form.dependencies || [];

          return `
            ${index > 0 ? '<div class="workflow-connector"></div>' : ''}
            <div class="${stepClass}" data-workflow-step="${escapeHtml(formId)}">
              <div class="workflow-step-marker">${statusIcon}</div>
              <div class="workflow-step-body">
                <div class="workflow-step-title">${escapeHtml(form.name || form.formName || `Step ${index + 1}`)}</div>
                ${form.authority ? `<span class="workflow-step-authority">${escapeHtml(form.authority)}</span>` : ''}
                ${deps.length ? `<span class="workflow-step-deps">Requires: ${deps.map((d) => escapeHtml(typeof d === 'string' ? d : d.name || '')).join(', ')}</span>` : ''}
                <div class="workflow-step-actions">
                  <button class="form-btn form-btn-fill" type="button" data-workflow-expand="${escapeHtml(formId)}">Open</button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

function findFormDataInConversation(formId) {
  for (const msg of state.conversation) {
    if (!msg.visuals) continue;
    for (const visual of msg.visuals) {
      if (visual.kind === 'form-package' && visual.formData) {
        const fd = visual.formData;
        const id = fd.formId || fd.id || slugify(fd.formName || fd.name || '');
        if (id === formId) return fd;
      }
      if (visual.kind === 'form-workflow' && visual.workflowData) {
        const forms = visual.workflowData.forms || visual.workflowData.steps || [];
        for (const f of forms) {
          const id = f.formId || f.id || slugify(f.name || f.formName || '');
          if (id === formId) return f;
        }
      }
    }
  }
  return null;
}

function slugify(text) {
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 64) || 'form';
}

function collectInlineFormData(formId) {
  const fields = document.querySelectorAll(`[data-form-field="${formId}"]`);
  const collected = {};
  for (const field of fields) {
    const name = field.name || field.id || '';
    if (name) collected[name] = field.value;
  }
  return collected;
}

// ─── End Form Package Rendering ─────────────────────────────────────

function formatBytes(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

