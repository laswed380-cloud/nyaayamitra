const { defaultPlaybook, seedSources, workflowTemplates } = require('./catalog');

const RISK_WEIGHT = { high: 22, medium: 13, low: 7 };

function reviewContract(input = {}, playbook = defaultPlaybook) {
  const text = normalizeText(input.contractText || input.text || '');
  const contractType = input.contractType || inferContractType(text);
  const clauses = playbook.rules.map((rule) => ({
    ruleId: rule.id,
    label: rule.label,
    present: Boolean(findExcerpt(text, rule.patterns)),
    excerpt: findExcerpt(text, rule.patterns) || null
  }));
  const risks = buildContractRisks(text, clauses, playbook.rules);
  const obligations = extractObligations(text);
  const score = Math.min(98, risks.reduce((sum, risk) => sum + (RISK_WEIGHT[risk.severity] || 5), 8));

  return {
    title: input.title || 'Contract review',
    contractType,
    matterId: input.matterId || null,
    riskScore: score,
    riskLabel: score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low',
    summary: {
      legal: risks.length
        ? `${risks.length} playbook issue${risks.length === 1 ? '' : 's'} detected.`
        : 'No major playbook deviations were detected in the supplied text.',
      business: createBusinessSummary(contractType, risks, obligations),
      humanCheck:
        'Confirm the full executed draft, schedules, order forms, and jurisdiction-specific enforceability before external advice or redlines.'
    },
    metadata: {
      parties: extractParties(text, input.counterparty),
      detectedDates: extractMatches(text, /\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{4})\b/gi),
      detectedMoney: extractMatches(text, /\b(?:INR|Rs\.?|₹)\s?[\d,]+(?:\.\d+)?\b/gi),
      sourceLength: text.length
    },
    clauses,
    risks,
    fallbackLanguage: risks.filter((risk) => risk.fallback).map((risk) => ({
      ruleId: risk.ruleId,
      label: risk.label,
      suggestedLanguage: risk.fallback
    })),
    obligations,
    executionChecklist: [
      'Confirm signatory authority and board / POA support if required.',
      'Confirm all schedules, annexures, SOWs, and order forms are attached.',
      'Confirm GST / tax, invoice, and payment fields are complete.',
      'Confirm DPDP / data processing terms if personal data is processed.',
      'Save final signed copy and extracted obligations to the matter timeline.'
    ],
    citations: [{ sourceId: 'src-internal-playbook', source: 'Internal contract playbook', relevance: 'Deviation scoring' }],
    guardrails: createGuardrails('contract review')
  };
}

function answerResearchQuestion(input = {}, sources = seedSources) {
  const question = normalizeText(input.question || '');
  const topic = detectTopic(question);
  const selectedSources = selectSourcesForTopic(topic, sources);
  const workflow = workflowTemplates.find((item) => item.id === 'research-memo');

  return {
    question: question || 'No question provided',
    mode: input.mode || 'Source-backed answer',
    jurisdiction: input.jurisdiction || 'India',
    topic,
    answer: buildResearchAnswer(topic, question),
    confidence: selectedSources.some((source) => source.tier === 'Tier 1') ? 'Medium-high' : 'Medium',
    citedSources: selectedSources.map((source) => ({
      id: source.id,
      name: source.name,
      sourceType: source.sourceType,
      tier: source.tier,
      url: source.url,
      humanCheck: source.humanCheck
    })),
    sourceReasoning: [
      'Official sources are ranked above licensed databases and public search.',
      'Internal policy can guide the organization position but should not override binding law.',
      'Final legal advice requires verification of the latest operative text and any conflicting authority.'
    ],
    nextSteps: [
      'Open the exact statute, rule, circular, or judgment passage.',
      'Check for amendments, stays, appeals, or superseding notifications.',
      'Route a memo export for human legal review.'
    ],
    memoTemplate: {
      workflowId: workflow.id,
      sections: ['Issue', 'Short answer', 'Sources checked', 'Analysis', 'Uncertainty', 'Recommended action']
    },
    guardrails: createGuardrails('legal research')
  };
}

function assessDpdp(input = {}) {
  const businessFunction = normalizeText(input.businessFunction || input.function || 'General business function');
  const text = normalizeText(input.noticeText || '');
  const lower = text.toLowerCase();
  const hasNotice = text.length > 40;
  const checks = [
    dpdpCheck('notice-purpose', 'Notice explains personal-data purposes in plain language', hasNotice && /\bpurpose|process|processing|use\b/.test(lower), 'high', 'Refresh the notice to state processing purposes clearly for each data principal group.'),
    dpdpCheck('rights-handling', 'Rights request channel and escalation owner are stated', /\bright|grievance|contact|email|request\b/.test(lower), 'high', 'Add a rights-request channel, owner, SLA, and escalation workflow.'),
    dpdpCheck('retention', 'Retention and deletion approach is documented', /\bretention|retain|delete|deletion|storage\b/.test(lower), 'medium', 'Create a retention matrix by data category, purpose, system, and legal basis.'),
    dpdpCheck('safeguards', 'Security safeguards and incident response are referenced', /\bsecurity|safeguard|breach|incident|encrypt|access\b/.test(lower), 'high', 'Document technical and organizational safeguards, breach triage, and evidence capture.'),
    dpdpCheck('vendor-processors', 'Data processor / vendor sharing controls are captured', /\bvendor|processor|third party|third-party|sharing|transfer\b/.test(lower), 'medium', 'Add a processor register and vendor questionnaire with data, purpose, retention, and breach clauses.'),
    dpdpCheck('child-data', 'Child-data handling is assessed where applicable', /\bchild|children|minor|parent|guardian\b/.test(lower), 'medium', 'Confirm whether child data is processed and document controls or non-applicability.')
  ];
  const failed = checks.filter((check) => !check.passed);
  const highFailed = failed.filter((check) => check.severity === 'high').length;
  const readinessScore = Math.max(5, Math.round((checks.length - failed.length) * (100 / checks.length) - highFailed * 6));

  return {
    businessFunction,
    readinessScore,
    readinessLabel: readinessScore >= 75 ? 'Mostly ready' : readinessScore >= 45 ? 'Needs remediation' : 'High gap load',
    summary: failed.length
      ? `${failed.length} readiness gap${failed.length === 1 ? '' : 's'} detected for ${businessFunction}. Prioritize high-severity notice, rights, and safeguards gaps first.`
      : 'The supplied material covers the baseline readiness checks. Confirm latest law, implementation phase, and operational evidence before signoff.',
    checks,
    remediationTasks: failed.map((check) => ({
      title: check.remediation,
      module: 'dpdp',
      priority: check.severity === 'high' ? 'High' : 'Medium',
      evidenceNeeded: evidenceForDpdpCheck(check.id)
    })),
    evidencePack: [
      'approved privacy notice',
      'data inventory',
      'retention matrix',
      'processor register',
      'rights request SOP',
      'incident response evidence',
      'management approval note'
    ],
    citations: [{ sourceId: 'src-dpdp-pib', source: 'MeitY / PIB DPDP publications', relevance: 'DPDP readiness checklist source anchor' }],
    guardrails: createGuardrails('DPDP compliance')
  };
}

function reviewTender(input = {}) {
  const text = normalizeText(input.tenderText || input.text || '');
  const lower = text.toLowerCase();
  const requirements = [
    extractRequirement(text, 'EMD', /\b(?:emd|earnest money deposit)\b[^.\n]*/i),
    extractRequirement(text, 'Performance security', /\bperformance security\b[^.\n]*/i),
    extractRequirement(text, 'Insurance', /\binsurance\b[^.\n]*/i),
    extractRequirement(text, 'Eligibility', /\b(?:eligibility|eligible|qualification|qualified)\b[^.\n]*/i),
    extractRequirement(text, 'Submission deadline', /\b(?:deadline|due date|last date|submission)\b[^.\n]*/i),
    extractRequirement(text, 'Pre-bid meeting', /\bpre[- ]?bid\b[^.\n]*/i)
  ].filter(Boolean);
  const riskFlags = [
    tenderRisk(lower, 'LD / penalty exposure', /\b(?:liquidated damages|ld|penalty|damages)\b/, 'Clarify cap, trigger, cure, and whether LD is sole remedy.'),
    tenderRisk(lower, 'Indemnity exposure', /\b(?:indemnity|indemnify|hold harmless)\b/, 'Clarify scope, process, exclusions, and cap.'),
    tenderRisk(lower, 'Data processing / privacy scope', /\b(?:personal data|data processing|privacy|dpdp)\b/, 'Confirm data roles, purpose, safeguards, breach notice, and processor obligations.'),
    tenderRisk(lower, 'Arbitration / dispute venue', /\b(?:arbitration|dispute|jurisdiction|court)\b/, 'Confirm seat, venue, language, governing law, and interim relief path.'),
    tenderRisk(lower, 'Unclear consortium/subcontracting limits', /\b(?:consortium|subcontract|sub-contractor|joint venture)\b/, 'Confirm approval requirements and liability allocation.')
  ].filter(Boolean);
  const missingDocuments = ['EMD proof', 'power of attorney', 'board authorization', 'technical compliance statement', 'financial bid format']
    .filter((doc) => !lower.includes(doc.toLowerCase().replace('proof', '').trim()))
    .map((title) => ({ title, status: 'Needs confirmation' }));
  const readinessScore = Math.max(10, 92 - riskFlags.length * 11 - missingDocuments.length * 4);

  return {
    title: input.title || 'Tender legal review',
    portal: input.portal || detectPortal(lower),
    readinessScore,
    readinessLabel: readinessScore >= 75 ? 'Submission track' : readinessScore >= 50 ? 'Clarifications needed' : 'At risk',
    requirements,
    riskFlags,
    missingDocuments,
    clarificationQuestions: riskFlags.map((flag) => `Please clarify ${flag.label.toLowerCase()}: ${flag.question}`),
    documentMatrix: [
      ...missingDocuments,
      ...requirements.map((requirement) => ({ title: requirement.label, status: 'Extracted - verify source pack' }))
    ],
    citations: [{
      sourceId: input.portal && input.portal.toLowerCase().includes('gem') ? 'src-gem' : 'src-eprocure',
      source: input.portal && input.portal.toLowerCase().includes('gem') ? 'Government e Marketplace' : 'CPPP / eProcure',
      relevance: 'Tender portal source anchor'
    }],
    guardrails: createGuardrails('tender review')
  };
}

function buildBoardPack(input = {}) {
  const action = normalizeText(input.action || 'General corporate action');
  const company = normalizeText(input.company || 'the Company');
  const facts = normalizeText(input.facts || '');
  const needsFiling = /\b(?:allotment|director|share|charge|annual|mca|roc|filing)\b/i.test(`${action} ${facts}`);

  return {
    action,
    company,
    pack: {
      agenda: `To consider and approve ${action} for ${company}.`,
      resolution: `RESOLVED THAT approval of the Board be and is hereby accorded for ${action} for ${company}, subject to applicable law, internal approvals, and completion of supporting documents.`,
      minutes: `The Board considered the proposal for ${action}. After discussion, the Board approved the matter subject to final legal and secretarial review.`
    },
    checklist: [
      'Confirm board authority and quorum.',
      'Confirm director disclosures and interested-party considerations.',
      'Attach supporting documents and management note.',
      'Confirm signatory matrix and filing responsibility.',
      needsFiling ? 'Prepare MCA / ROC filing checklist and proof-of-submission slot.' : 'Confirm whether any statutory filing is triggered.'
    ],
    signatoryMatrix: [
      { role: 'Chairperson / authorized director', action: 'Approve agenda and sign minutes' },
      { role: 'Company secretary / compliance owner', action: 'Validate filing and registers' },
      { role: 'Legal reviewer', action: 'Approve final pack before circulation' }
    ],
    guardrails: createGuardrails('board pack')
  };
}

function buildWorkflowRun(input = {}) {
  const template = workflowTemplates.find((item) => item.id === input.templateId) || workflowTemplates[0];
  return {
    id: `run-${Math.random().toString(36).slice(2, 10)}`,
    templateId: template.id,
    name: input.name || template.name,
    matterId: input.matterId || null,
    status: 'Started',
    createdAt: new Date().toISOString(),
    slaHours: template.slaHours,
    steps: template.steps.map((step, index) => ({
      id: `${template.id}-step-${index + 1}`,
      title: step,
      status: index === 0 ? 'In progress' : 'Queued',
      owner: index < 2 ? 'System' : 'Reviewer'
    })),
    outputs: template.outputs,
    guardrails: createGuardrails('workflow orchestration')
  };
}

function createGuardrails(context) {
  return {
    context,
    assistiveOnly: true,
    humanReviewRequired: true,
    exportPolicy: 'Require legal owner approval before advice memo, filing packet, tender submission, or external counsel instruction.',
    traceability: 'Every generated item should be saved to a matter with source IDs, reviewer, timestamp, and action log.'
  };
}

function buildContractRisks(text, clauses, rules) {
  const lower = text.toLowerCase();
  const risks = [];
  for (const rule of rules) {
    const clause = clauses.find((item) => item.ruleId === rule.id);
    if (!clause || !clause.present) {
      risks.push({
        ruleId: rule.id,
        label: rule.label,
        severity: rule.severity,
        status: 'Missing',
        issue: `No clear ${rule.label.toLowerCase()} clause was detected.`,
        fallback: rule.fallback
      });
      continue;
    }
    if (rule.id === 'liability-cap' && /\bunlimited liability|without limitation|uncapped\b/.test(lower)) {
      risks.push({ ruleId: rule.id, label: rule.label, severity: 'high', status: 'Deviation', issue: 'Potential uncapped or unlimited liability wording detected.', fallback: rule.fallback });
    }
    if (rule.id === 'governing-law-india' && /\blaws of (england|singapore|new york|delaware|california)\b/.test(lower)) {
      risks.push({ ruleId: rule.id, label: rule.label, severity: 'medium', status: 'Deviation', issue: 'Foreign governing law appears to be present. Confirm approval and dispute strategy.', fallback: rule.fallback });
    }
    if (rule.id === 'confidentiality-survival' && /\bconfidential/i.test(text) && !/\bsurviv|five years|5 years|perpetual\b/i.test(text)) {
      risks.push({ ruleId: rule.id, label: rule.label, severity: 'medium', status: 'Deviation', issue: 'Confidentiality appears present, but survival language was not detected.', fallback: rule.fallback });
    }
  }
  return risks;
}

function inferContractType(text) {
  const lower = text.toLowerCase();
  if (/\bnon-disclosure|nda|confidential information\b/.test(lower)) return 'NDA';
  if (/\bmaster services|msa|statement of work|sow\b/.test(lower)) return 'Customer MSA';
  if (/\bvendor|supplier|purchase order|procurement\b/.test(lower)) return 'Vendor Agreement';
  if (/\bemployment|employee|salary|appointment\b/.test(lower)) return 'Employment Contract';
  if (/\blease|rent|premises|lessor|lessee\b/.test(lower)) return 'Lease';
  if (/\bdata processing|processor|personal data|dpdp\b/.test(lower)) return 'Data Processing Addendum';
  return 'Commercial Agreement';
}

function extractObligations(text) {
  return splitSentences(text)
    .filter((sentence) => /\b(shall|must|will|within|no later than|prior to|notify|pay|deliver|maintain|retain|delete|renew|terminate)\b/i.test(sentence))
    .slice(0, 8)
    .map((sentence, index) => ({
      id: `obl-${index + 1}`,
      text: sentence,
      owner: /\bvendor|supplier|service provider|processor\b/i.test(sentence) ? 'Vendor / supplier' : /\beach party|parties\b/i.test(sentence) ? 'Each party' : 'Legal owner to assign',
      trigger: inferTrigger(sentence),
      status: 'Extracted - verify'
    }));
}

function inferTrigger(sentence) {
  const within = sentence.match(/\bwithin\s+[^,.]{2,40}/i);
  if (within) return within[0];
  if (/\btermination|expiry\b/i.test(sentence)) return 'termination / expiry';
  if (/\bbreach|incident\b/i.test(sentence)) return 'breach / incident';
  if (/\brenew/i.test(sentence)) return 'renewal event';
  return 'contract lifecycle';
}

function extractParties(text, counterparty) {
  const parties = [];
  const between = text.match(/\bbetween\s+(.{2,80}?)\s+and\s+(.{2,80}?)(?:\.|,|\n|$)/i);
  if (between) parties.push(cleanParty(between[1]), cleanParty(between[2]));
  if (counterparty) parties.push(counterparty);
  return [...new Set(parties.filter(Boolean))].slice(0, 4);
}

function createBusinessSummary(contractType, risks, obligations) {
  if (!risks.length) return `${contractType} is broadly aligned to the default playbook based on supplied text. ${obligations.length} operational obligation${obligations.length === 1 ? '' : 's'} extracted for tracking.`;
  const topRisks = risks.slice(0, 3).map((risk) => risk.label.replace(/\s+should.+$/i, '')).join('; ');
  return `${contractType} needs review before approval. Main business blockers: ${topRisks}. ${obligations.length} obligation${obligations.length === 1 ? '' : 's'} should be verified and assigned.`;
}

function detectTopic(question) {
  const lower = question.toLowerCase();
  if (/\bdpdp|privacy|personal data|data fiduciary|consent|retention\b/.test(lower)) return 'DPDP / privacy';
  if (/\btender|rfp|gem|eprocure|bid|emd|performance security\b/.test(lower)) return 'public procurement / tender';
  if (/\bmca|board|resolution|company|director|roc|filing\b/.test(lower)) return 'corporate filings';
  if (/\bgst|epfo|esic|bis|labou?r\b/.test(lower)) return 'statutory compliance';
  if (/\bcontract|indemnity|liability|governing law|termination\b/.test(lower)) return 'contract law and playbook';
  if (/\bcase|judgment|court|writ|appeal\b/.test(lower)) return 'case law';
  return 'general India legal operations';
}

function selectSourcesForTopic(topic, sources) {
  const idsByTopic = {
    'DPDP / privacy': ['src-dpdp-pib', 'src-india-code', 'src-internal-playbook'],
    'public procurement / tender': ['src-gem', 'src-eprocure', 'src-internal-playbook'],
    'corporate filings': ['src-india-code', 'src-internal-playbook'],
    'statutory compliance': ['src-india-code', 'src-internal-playbook'],
    'contract law and playbook': ['src-internal-playbook', 'src-india-code'],
    'case law': ['src-ecourts-judgments', 'src-india-code']
  };
  return (idsByTopic[topic] || ['src-india-code', 'src-ecourts-judgments', 'src-internal-playbook'])
    .map((id) => sources.find((source) => source.id === id))
    .filter(Boolean);
}

function buildResearchAnswer(topic, question) {
  const prefix = question ? `For the issue "${clip(question, 120)}"` : 'For this issue';
  const answers = {
    'DPDP / privacy': `${prefix}, use official DPDP publications as the first source, then map the requirement into notice, rights intake, retention, safeguards, processor controls, incidents, and governance evidence.`,
    'public procurement / tender': `${prefix}, start from the live tender portal record and corrigenda. Extract eligibility, EMD, performance security, LD/penalty, indemnity, dispute, insurance, technical-compliance, and submission requirements.`,
    'corporate filings': `${prefix}, identify the corporate action, approving authority, board/shareholder threshold, form packet, signatory matrix, and proof-of-submission requirement.`,
    'statutory compliance': `${prefix}, separate recurring calendar obligations from event-driven notices. Build a document request list, owner matrix, portal evidence record, and escalation timer.`,
    'contract law and playbook': `${prefix}, compare the clause against the internal playbook first, then verify enforceability and mandatory law through official or licensed sources.`,
    'case law': `${prefix}, retrieve official judgments/orders and verify court, date, bench, procedural status, and whether the proposition remains good law before citing it.`
  };
  return answers[topic] || `${prefix}, retrieve official India sources first, then internal approved material, and mark any legal conclusion that lacks source support for human review.`;
}

function evidenceForDpdpCheck(id) {
  const evidence = {
    'notice-purpose': ['approved notice copy', 'purpose mapping table', 'business owner signoff'],
    'rights-handling': ['rights intake SOP', 'grievance contact', 'request log sample'],
    retention: ['retention matrix', 'deletion workflow', 'system owner signoff'],
    safeguards: ['security controls summary', 'incident response SOP', 'access control evidence'],
    'vendor-processors': ['processor register', 'vendor questionnaire', 'DPA / contract clauses'],
    'child-data': ['child data assessment', 'parent / guardian process if applicable', 'non-applicability approval']
  };
  return evidence[id] || ['owner signoff', 'policy evidence'];
}

function dpdpCheck(id, label, passed, severity, remediation) {
  return { id, label, passed: Boolean(passed), severity, remediation };
}

function extractRequirement(text, label, regex) {
  const match = text.match(regex);
  return match ? { label, text: clip(match[0], 240), status: 'Extracted - verify against source pack' } : null;
}

function tenderRisk(lower, label, regex, question) {
  return regex.test(lower) ? { label, severity: label.includes('LD') || label.includes('Indemnity') ? 'High' : 'Medium', question } : null;
}

function detectPortal(lower) {
  if (lower.includes('gem')) return 'GeM';
  if (lower.includes('eprocure') || lower.includes('cppp')) return 'CPPP / eProcure';
  return 'Unknown portal - verify source';
}

function findExcerpt(text, patterns) {
  const lowerPatterns = patterns.map((pattern) => pattern.toLowerCase());
  const match = splitSentences(text).find((sentence) => lowerPatterns.some((pattern) => sentence.toLowerCase().includes(pattern)));
  return match ? clip(match, 260) : '';
}

function splitSentences(text) {
  return normalizeText(text).split(/(?<=[.!?])\s+|\n+/).map((sentence) => sentence.trim()).filter(Boolean);
}

function cleanParty(value) {
  return value.replace(/\b(each|together|party|parties|a company|private limited|pvt ltd)\b/gi, '').replace(/\s+/g, ' ').trim();
}

function extractMatches(text, regex) {
  const matches = text.match(regex);
  return matches ? [...new Set(matches)].slice(0, 8) : [];
}

function normalizeText(value) {
  return String(value || '').replace(/\r/g, '').replace(/[ \t]+/g, ' ').trim();
}

function clip(value, maxLength) {
  const text = normalizeText(value);
  return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
}

module.exports = {
  answerResearchQuestion,
  assessDpdp,
  buildBoardPack,
  buildWorkflowRun,
  reviewContract,
  reviewTender
};
