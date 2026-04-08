/**
 * NyaayaMitra — Chat Concierge (Profile Extraction Layer)
 *
 * This module ONLY extracts business profile signals from user messages.
 * It does NOT generate any user-facing reply text — that's Claude's job.
 *
 * Responsibilities:
 *   - Detect identifiers (CIN, GSTIN, LLPIN, Udyam, FSSAI)
 *   - Detect business sector, city, state, stage, entity type
 *   - Detect compliance signals and intent
 *   - Build suggested actions based on detected signals
 *   - Identify information gaps for clarification
 */

const { sectorProfiles } = require('./sectorCompliance');

function buildChatConciergeResponse(input = {}) {
  const message = normalize(input.message || '');
  const lower = message.toLowerCase();
  const priorProfile = normalizeProfile(input.profile || {});
  const attachments = normalizeAttachments(input.attachments);
  const identifier = detectIdentifier(message, lower) || resolveIdentifierFromProfile(priorProfile);

  const sector = detectSector(lower) || resolveSectorFromProfile(priorProfile);
  const city = detectCity(lower) || priorProfile.city;
  const state = detectState(lower) || priorProfile.state;
  const stage = detectStage(lower) || priorProfile.stage;
  const employees = detectEmployees(lower) || priorProfile.employees;
  const entityType = detectEntityType(lower) || priorProfile.entityType;
  const companyName = detectBusinessName(message) || priorProfile.businessName;
  const signals = detectSignals(lower);
  const servesAlcohol = detectAlcoholSignal(lower, priorProfile);
  const identifierMetadata = detectIdentifierMetadata(identifier?.type, identifier?.value);

  const collectedProfile = {
    businessName: companyName,
    businessType: sector ? sector.name : priorProfile.businessType,
    sectorId: sector?.id || priorProfile.sectorId,
    city,
    state: state || priorProfile.state || identifierMetadata.state || '',
    stage,
    employees,
    entityType,
    servesAlcohol,
    identifierType: identifier?.type || priorProfile.identifierType,
    identifierValue: identifier?.value || priorProfile.identifierValue,
    incorporationYear: identifierMetadata.incorporationYear || priorProfile.incorporationYear,
    listingStatus: identifierMetadata.listingStatus || priorProfile.listingStatus
  };

  const clarificationPrompts = buildClarificationPrompts({
    lower,
    signals,
    sector,
    collectedProfile
  });

  const suggestedActions = buildActions({
    message,
    lower,
    signals,
    sector,
    collectedProfile
  });

  const autoRun = shouldAutoRun({
    lower,
    signals,
    sector,
    collectedProfile,
    clarificationPrompts
  });

  return {
    // NO preset reply text — reply field is empty, Claude will generate it
    reply: '',
    collectedProfile,
    suggestedActions,
    autoRun,
    clarificationPrompts,
    quickFacts: buildQuickFacts({ sector, collectedProfile, attachments, identifierMetadata }),
    signals,
    identifierMetadata,
    tone: {}
  };
}

// ─── Action Builder ──────────────────────────────────────────

function buildActions(context) {
  const actions = [];
  const prefill = buildPrefill(context);

  if (context.collectedProfile.identifierType && context.collectedProfile.identifierType !== 'new-business') {
    actions.push(action('government-lookup', {
      ...prefill,
      identifierType: context.collectedProfile.identifierType,
      identifierValue: context.collectedProfile.identifierValue,
      message: context.message
    }));
    actions.push(action('entity-snapshot', {
      ...prefill,
      identifierType: context.collectedProfile.identifierType,
      identifierValue: context.collectedProfile.identifierValue,
      message: context.message
    }));
  }

  if (context.signals.includes('submission') || context.signals.includes('gst') || context.signals.includes('fssai')) {
    actions.push(action('submissions', submissionPrefill(context)));
  }

  if (
    context.signals.includes('compliance') ||
    context.signals.includes('name-change') ||
    context.sector
  ) {
    actions.push(action('compliance-manager', prefill));
  }

  if (context.signals.includes('incorporation') || context.signals.includes('director')) {
    actions.push(action('launch', prefill));
  }

  if (context.signals.includes('knowledge') || context.signals.includes('portal') || context.signals.includes('law')) {
    actions.push(action('library', {}));
  }

  if (!actions.length) {
    actions.push(action('compliance-manager', prefill));
  }

  return dedupeActions(actions);
}

// ─── Clarification Builder ───────────────────────────────────
// These are structured UI prompts — NOT preset chat text.
// They provide quick-select options for the user interface.

function buildClarificationPrompts(context) {
  const prompts = [];

  if (context.signals.includes('name-change')) {
    if (!context.collectedProfile.identifierType) {
      prompts.push(identifierPrompt());
    }
    if (!context.collectedProfile.stage) {
      prompts.push(prompt('entityStatus', 'Is the company already incorporated?', [
        choice('Yes, already incorporated', { stage: 'operating' }),
        choice('Still being formed', { stage: 'incorporating' }),
        choice('Not sure yet', {})
      ]));
    }
    if (!context.collectedProfile.entityType) {
      prompts.push(prompt('entityType', 'What kind of entity is it?', [
        choice('Private limited', { entityType: 'Private Limited Company' }),
        choice('OPC', { entityType: 'OPC' }),
        choice('LLP', { entityType: 'LLP' }),
        choice('Partnership', { entityType: 'Partnership' }),
        choice('Proprietorship', { entityType: 'Proprietorship' }),
        choice('Not sure', {})
      ]));
    }
    return prompts.slice(0, 3);
  }

  if (!context.collectedProfile.identifierType && (context.signals.includes('incorporation') || /startup|new business|company name|entity change|name change/.test(context.lower))) {
    prompts.push(identifierPrompt());
  }

  if (!context.sector && !context.collectedProfile.identifierValue) {
    prompts.push(prompt('businessType', 'What kind of business is this?', [
      choice('Restaurant / Food', { businessType: 'Restaurant / Cafe / Cloud Kitchen', sectorId: 'restaurant' }),
      choice('IT / Software / SaaS', { businessType: 'IT / SaaS / Software Services', sectorId: 'it-services' }),
      choice('Factory / Manufacturing', { businessType: 'Factory / Manufacturing', sectorId: 'factory' }),
      choice('Hospital / Clinic', { businessType: 'Hospital / Clinic / Diagnostic Centre', sectorId: 'hospital' }),
      choice('School / Education', { businessType: 'School / K-12 Institution', sectorId: 'school' }),
      choice('Retail / Trading', { businessType: 'Retail Shop / Trading', sectorId: 'retail-shop' }),
      choice('Textile / Garment', { businessType: 'Textile / Garment Unit', sectorId: 'textile-garment' }),
      choice('Other', {})
    ]));
  }

  if (!context.collectedProfile.city && !context.collectedProfile.identifierValue) {
    // No hardcoded city list — open text input via the prompt mechanism
    prompts.push(prompt('city', 'Which city and state is this business located in?', [
      choice('Bengaluru, Karnataka', { city: 'Bengaluru', state: 'Karnataka' }),
      choice('Mumbai, Maharashtra', { city: 'Mumbai', state: 'Maharashtra' }),
      choice('Delhi NCR', { city: 'Delhi', state: 'Delhi' }),
      choice('Chennai, Tamil Nadu', { city: 'Chennai', state: 'Tamil Nadu' }),
      choice('Hyderabad, Telangana', { city: 'Hyderabad', state: 'Telangana' }),
      choice('Pune, Maharashtra', { city: 'Pune', state: 'Maharashtra' }),
      choice('Kolkata, West Bengal', { city: 'Kolkata', state: 'West Bengal' }),
      choice('Other city', {})
    ]));
  }

  if (!context.collectedProfile.stage && !context.collectedProfile.identifierValue) {
    prompts.push(prompt('stage', 'Where is the business right now?', [
      choice('Still planning / idea stage', { stage: 'idea' }),
      choice('Pre-launch / preparing', { stage: 'pre-launch' }),
      choice('Incorporating now', { stage: 'incorporating' }),
      choice('Already operating', { stage: 'operating' }),
      choice('Expanding / new branch', { stage: 'expanding' })
    ]));
  }

  if (!context.collectedProfile.employees && !context.collectedProfile.identifierValue && (context.signals.includes('compliance') || context.sector)) {
    prompts.push(prompt('employees', 'How many employees or team members?', [
      choice('Solo / 1-5', { employees: 3 }),
      choice('6-20', { employees: 15 }),
      choice('21-50', { employees: 35 }),
      choice('51-100', { employees: 75 }),
      choice('100+', { employees: 150 })
    ]));
  }

  if (context.sector?.id === 'restaurant' && context.collectedProfile.servesAlcohol == null) {
    prompts.push(prompt('servesAlcohol', 'Will the restaurant serve alcohol?', [
      choice('No alcohol', { servesAlcohol: false }),
      choice('Yes, alcohol service planned', { servesAlcohol: true }),
      choice('Not decided yet', {})
    ]));
  }

  return prompts.slice(0, 3);
}

// ─── Quick Facts (structured data chips for UI) ──────────────

function buildQuickFacts(context) {
  return [
    context.sector ? `Business: ${context.sector.name}` : null,
    context.collectedProfile.city ? `City: ${context.collectedProfile.city}` : null,
    context.collectedProfile.state ? `State: ${context.collectedProfile.state}` : null,
    context.collectedProfile.stage ? `Stage: ${context.collectedProfile.stage.replace(/-/g, ' ')}` : null,
    context.collectedProfile.employees ? `Team: ~${context.collectedProfile.employees}` : null,
    context.collectedProfile.entityType ? `Entity: ${context.collectedProfile.entityType}` : null,
    context.collectedProfile.identifierType && context.collectedProfile.identifierValue
      ? `${identifierLabel(context.collectedProfile.identifierType)}: ${context.collectedProfile.identifierValue}`
      : null,
    context.identifierMetadata?.entityType ? `Type (inferred): ${context.identifierMetadata.entityType}` : null,
    context.identifierMetadata?.state ? `State (inferred): ${context.identifierMetadata.state}` : null,
    context.identifierMetadata?.incorporationYear ? `Year (inferred): ${context.identifierMetadata.incorporationYear}` : null,
    context.collectedProfile.servesAlcohol === true ? 'Alcohol: yes' : null,
    context.attachments.length ? `Files: ${context.attachments.length}` : null
  ].filter(Boolean);
}

// ─── Signal Detection (NLP-light) ────────────────────────────

function detectSignals(lower) {
  const signals = [];
  if (/(compliance|license|licence|approval|permit|registration|due|pending|renewal|audit|tax|filing|return|labour|labor|fire|pollution|safety|legal|notice|penalty|inspection|noc|consent)/.test(lower)) signals.push('compliance');
  if (/(submit|submission|file|apply|application|acknowledg|reference|arn|srn|track|status)/.test(lower)) signals.push('submission');
  if (/(incorporat|\bopc\b|\bllp\b|\bdin\b|\bdsc\b|\bdirector\b|\bkyc\b|\bfounder\b|\bspice\b|\bagile\b)/.test(lower)) signals.push('incorporation');
  if (/(\bdirector\b|\bdin\b|\bdsc\b|\bkyc\b)/.test(lower)) signals.push('director');
  if (/(gst|gstin|gstr|input credit|e-invoice|e-way|eway)/.test(lower)) signals.push('gst');
  if (/(fssai|foscos|food safety|food licence|food license)/.test(lower)) signals.push('fssai');
  if (/(law|laws|portal|website|source|rule|policy|library|act|section|notification|circular|gazette)/.test(lower)) signals.push('knowledge');
  if (/(lpg|cylinder|gas manifold|peso|petroleum|explosiv|storage licence|storage license|gas cylinder)/.test(lower)) signals.push('lpg');
  if (/(name change|change company name|objects|object clause|moa|main objects|alteration)/.test(lower)) signals.push('name-change');
  if (/(alcohol|liquor|bar|beer|wine|excise|fl-3|cl-2)/.test(lower)) signals.push('alcohol');
  if (/(portal|online form|website filing|mca portal|gst portal)/.test(lower)) signals.push('portal');
  if (/(epf|epfo|pf|provident fund|esi|esic|employee state insurance)/.test(lower)) signals.push('labour');
  if (/(income tax|tds|tan|itr|advance tax|26as|form 16)/.test(lower)) signals.push('income-tax');
  if (/(pollution|kspcb|cpcb|consent to operate|consent to establish|hazardous waste)/.test(lower)) signals.push('pollution');
  if (/(udyam|msme|micro|small enterprise|medium enterprise)/.test(lower)) signals.push('msme');
  if (/(startup india|dpiit|angel tax|startup recognition)/.test(lower)) signals.push('startup');
  if (/(trade licence|trade license|bbmp|municipal|corporation)/.test(lower)) signals.push('local');
  if (/(fire|fire noc|fire safety|fire department)/.test(lower)) signals.push('fire');
  if (/(posh|sexual harassment|icc|internal complaints)/.test(lower)) signals.push('posh');
  if (/(dpdp|data protection|privacy|personal data)/.test(lower)) signals.push('data-protection');
  return signals;
}

function shouldAutoRun(context) {
  if (context.signals.includes('submission')) return true;
  if (context.signals.includes('gst') || context.signals.includes('fssai')) return true;
  if (context.collectedProfile.identifierValue) return true;
  if (context.signals.includes('name-change')) return false;

  const explicitPlan = /(what compliances|all compliances|roadmap|plan|what do i need|guide me|tell me what applies|help me|what should i do|where do i start)/.test(context.lower);
  const hasCoreFacts = Boolean(context.sector && context.collectedProfile.city && context.collectedProfile.stage);

  if (explicitPlan && (hasCoreFacts || context.clarificationPrompts.length <= 1)) return true;
  if (hasCoreFacts && context.signals.includes('compliance')) return true;
  if (context.signals.includes('incorporation') && context.clarificationPrompts.length <= 1) return true;
  return false;
}

// ─── Identifier Detection ────────────────────────────────────

function detectIdentifier(message, lower) {
  const cin = String(message).match(/\b[A-Z][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}\b/i);
  if (cin) return { type: 'cin', value: cin[0].toUpperCase() };

  const gstin = String(message).match(/\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][A-Z0-9]Z[A-Z0-9]\b/i);
  if (gstin) return { type: 'gstin', value: gstin[0].toUpperCase() };

  const llpin = String(message).match(/\b[A-Z]{3}-[0-9]{4}\b/i);
  if (llpin) return { type: 'llpin', value: llpin[0].toUpperCase() };

  const udyam = String(message).match(/\bUDYAM-[A-Z]{2}-[0-9]{2}-[0-9]{7}\b/i);
  if (udyam) return { type: 'udyam', value: udyam[0].toUpperCase() };

  const fssai = lower.includes('fssai') ? String(message).match(/\b[0-9]{14}\b/) : null;
  if (fssai) return { type: 'fssai', value: fssai[0] };

  return null;
}

function detectIdentifierMetadata(type, value) {
  if (type === 'cin' && /^[A-Z][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/i.test(value || '')) {
    const upper = value.toUpperCase();
    return {
      type: 'cin',
      entityType: companyTypeFromCode(upper.slice(12, 15)),
      state: stateFromCode(upper.slice(6, 8)),
      incorporationYear: upper.slice(8, 12),
      listingStatus: upper.startsWith('U') ? 'Unlisted' : upper.startsWith('L') ? 'Listed' : 'Company'
    };
  }
  if (type === 'gstin' && /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][A-Z0-9]Z[A-Z0-9]$/i.test(value || '')) {
    const upper = value.toUpperCase();
    return {
      type: 'gstin',
      state: gstStateFromCode(upper.slice(0, 2)),
      pan: upper.slice(2, 12)
    };
  }
  if (type === 'udyam' && /^UDYAM-[A-Z]{2}-[0-9]{2}-[0-9]{7}$/i.test(value || '')) {
    const upper = value.toUpperCase();
    return {
      type: 'udyam',
      state: stateFromCode(upper.slice(6, 8))
    };
  }
  return { type };
}

// ─── Entity/City/Sector Detection ────────────────────────────

function detectSector(lower) {
  return sectorProfiles.find((profile) => profile.aliases.some((alias) => lower.includes(alias))) || null;
}

function resolveSectorFromProfile(profile) {
  if (!profile.sectorId) return null;
  return sectorProfiles.find((item) => item.id === profile.sectorId) || null;
}

function detectCity(lower) {
  const cities = {
    'bengaluru': 'Bengaluru', 'bangalore': 'Bengaluru',
    'mumbai': 'Mumbai', 'bombay': 'Mumbai',
    'delhi': 'Delhi', 'new delhi': 'Delhi',
    'chennai': 'Chennai', 'madras': 'Chennai',
    'hyderabad': 'Hyderabad',
    'pune': 'Pune', 'poona': 'Pune',
    'kolkata': 'Kolkata', 'calcutta': 'Kolkata',
    'ahmedabad': 'Ahmedabad',
    'jaipur': 'Jaipur',
    'lucknow': 'Lucknow',
    'chandigarh': 'Chandigarh',
    'gurgaon': 'Gurugram', 'gurugram': 'Gurugram',
    'noida': 'Noida',
    'kochi': 'Kochi', 'cochin': 'Kochi',
    'thiruvananthapuram': 'Thiruvananthapuram', 'trivandrum': 'Thiruvananthapuram',
    'mysuru': 'Mysuru', 'mysore': 'Mysuru',
    'mangaluru': 'Mangaluru', 'mangalore': 'Mangaluru',
    'hubballi': 'Hubballi', 'hubli': 'Hubballi',
    'coimbatore': 'Coimbatore',
    'nagpur': 'Nagpur',
    'indore': 'Indore',
    'bhopal': 'Bhopal',
    'visakhapatnam': 'Visakhapatnam', 'vizag': 'Visakhapatnam',
    'patna': 'Patna',
    'goa': 'Goa',
    'surat': 'Surat',
    'vadodara': 'Vadodara'
  };
  for (const [key, value] of Object.entries(cities)) {
    if (lower.includes(key)) return value;
  }
  return '';
}

function detectState(lower) {
  const states = {
    'karnataka': 'Karnataka', 'maharashtra': 'Maharashtra',
    'tamil nadu': 'Tamil Nadu', 'tamilnadu': 'Tamil Nadu',
    'telangana': 'Telangana', 'andhra pradesh': 'Andhra Pradesh',
    'kerala': 'Kerala', 'gujarat': 'Gujarat',
    'rajasthan': 'Rajasthan', 'madhya pradesh': 'Madhya Pradesh',
    'uttar pradesh': 'Uttar Pradesh', 'west bengal': 'West Bengal',
    'punjab': 'Punjab', 'haryana': 'Haryana',
    'bihar': 'Bihar', 'odisha': 'Odisha', 'orissa': 'Odisha',
    'jharkhand': 'Jharkhand', 'chhattisgarh': 'Chhattisgarh',
    'assam': 'Assam', 'goa': 'Goa',
    'himachal': 'Himachal Pradesh', 'uttarakhand': 'Uttarakhand',
    'jammu': 'Jammu & Kashmir'
  };
  for (const [key, value] of Object.entries(states)) {
    if (lower.includes(key)) return value;
  }
  return '';
}

function detectStage(lower) {
  if (/idea|still planning|thinking of|want to start|considering/.test(lower)) return 'idea';
  if (/pre[- ]launch|starting|about to start|new business|not started|setting up/.test(lower)) return 'pre-launch';
  if (/incorporat|forming|registration in progress|applying for/.test(lower)) return 'incorporating';
  if (/running|operating|already open|already started|currently running/.test(lower)) return 'operating';
  if (/expand|branch|new location|scale|scaling|second outlet|franchise/.test(lower)) return 'expanding';
  return '';
}

function detectEmployees(lower) {
  const match = lower.match(/(\d+)\s+(employee|employees|worker|workers|staff|people|member|team)/);
  return match ? Number(match[1]) : 0;
}

function detectEntityType(lower) {
  if (/private limited|pvt ltd|private ltd/.test(lower)) return 'Private Limited Company';
  if (/\bopc\b|one person company/.test(lower)) return 'OPC';
  if (/\bllp\b|limited liability partnership/.test(lower)) return 'LLP';
  if (/partnership firm/.test(lower)) return 'Partnership';
  if (/proprietor|proprietorship|sole proprietor/.test(lower)) return 'Proprietorship';
  if (/trust|section 8|society|ngo/.test(lower)) return 'Trust / Society / Section 8';
  if (/public limited|public company/.test(lower)) return 'Public Limited Company';
  return '';
}

function detectAlcoholSignal(lower, profile) {
  if (/(alcohol|liquor|bar|beer|wine|excise)/.test(lower)) return true;
  if (profile.servesAlcohol === true || profile.servesAlcohol === false) return profile.servesAlcohol;
  return null;
}

function detectBusinessName(message) {
  const explicit = String(message || '').match(/(?:company|business|restaurant|firm|entity|brand)\s+(?:name|called|named)\s+(?:is|:)?\s*([A-Z][A-Za-z0-9& .'-]{2,})/i);
  if (explicit) return explicit[1].trim();
  return '';
}

// ─── Helpers ─────────────────────────────────────────────────

function buildPrefill(context) {
  return {
    businessName: context.collectedProfile.businessName || '',
    businessType: context.collectedProfile.businessType || '',
    city: context.collectedProfile.city || '',
    state: context.collectedProfile.state || '',
    stage: context.collectedProfile.stage || '',
    employees: context.collectedProfile.employees ? String(context.collectedProfile.employees) : '',
    entityType: context.collectedProfile.entityType || '',
    identifierType: context.collectedProfile.identifierType || '',
    identifierValue: context.collectedProfile.identifierValue || '',
    usesLpg: context.signals.includes('lpg'),
    servesAlcohol: context.collectedProfile.servesAlcohol === true,
    existingSituation: context.message
  };
}

function submissionPrefill(context) {
  const base = buildPrefill(context);
  let title = 'Authority submission packet';
  let authority = 'Authority';
  let portalName = 'Portal';
  let portalUrl = '';
  let forms = 'Application form';
  let documentsRequired = 'Supporting documents';
  let evidenceChecklist = 'Application PDF, acknowledgement / reference, approval / certificate';

  if (context.signals.includes('gst')) {
    title = 'GST registration packet';
    authority = 'GST';
    portalName = 'GST portal';
    portalUrl = 'https://www.gst.gov.in/';
    forms = 'GST REG-01, authorized-signatory checklist';
    documentsRequired = 'PAN and incorporation proof, principal place proof, bank details, authorized signatory pack';
  } else if (context.signals.includes('fssai') || context.sector?.id === 'restaurant') {
    title = 'FSSAI / FoSCoS packet';
    authority = 'FSSAI';
    portalName = 'FoSCoS - FSSAI';
    portalUrl = 'https://foscos.fssai.gov.in/';
    forms = 'FoSCoS registration / licence route';
    documentsRequired = 'Premises proof, food category note, kitchen facts, identity and entity proof';
  }

  return { ...base, title, authority, portalName, portalUrl, forms, documentsRequired, evidenceChecklist };
}

function action(view, prefill) { return { id: `${view}-${slug(view)}`, view, prefill }; }
function prompt(id, question, choices) { return { id, question, choices }; }
function choice(label, patch) { return { label, patch }; }

function dedupeActions(items) {
  const seen = new Set();
  return items.filter((item) => { if (seen.has(item.view)) return false; seen.add(item.view); return true; });
}

function identifierPrompt() {
  return prompt('identifierType', 'How should I identify this business?', [
    choice('Use CIN', { identifierType: 'cin' }),
    choice('Use LLPIN', { identifierType: 'llpin' }),
    choice('Use GSTIN', { identifierType: 'gstin' }),
    choice('Use Udyam number', { identifierType: 'udyam' }),
    choice('Use FSSAI or trade licence', { identifierType: 'licence' }),
    choice('New business, no ID yet', { identifierType: 'new-business', stage: 'idea' })
  ]);
}

function identifierLabel(value) {
  const map = { cin: 'CIN', llpin: 'LLPIN', gstin: 'GSTIN', udyam: 'Udyam', fssai: 'FSSAI', licence: 'Licence', 'new-business': 'New business' };
  return map[value] || value;
}

function companyTypeFromCode(code) {
  const map = { OPC: 'OPC', PTC: 'Private Limited Company', PLC: 'Public Limited Company', ULT: 'Unlimited company', GOI: 'Government company', GAP: 'Guarantee company', FTC: 'Foreign company', NPL: 'Section 8 company' };
  return map[String(code || '').toUpperCase()] || String(code || '').toUpperCase() || 'Company';
}

function stateFromCode(code) {
  const map = {
    AN: 'Andaman & Nicobar', AP: 'Andhra Pradesh', AR: 'Arunachal Pradesh', AS: 'Assam',
    BR: 'Bihar', CH: 'Chandigarh', CT: 'Chhattisgarh', DD: 'Daman & Diu', DL: 'Delhi',
    GA: 'Goa', GJ: 'Gujarat', HP: 'Himachal Pradesh', HR: 'Haryana', JH: 'Jharkhand',
    JK: 'Jammu & Kashmir', KA: 'Karnataka', KL: 'Kerala', LA: 'Ladakh', LD: 'Lakshadweep',
    MH: 'Maharashtra', ML: 'Meghalaya', MN: 'Manipur', MP: 'Madhya Pradesh', MZ: 'Mizoram',
    NL: 'Nagaland', OR: 'Odisha', PB: 'Punjab', PY: 'Puducherry', RJ: 'Rajasthan',
    SK: 'Sikkim', TN: 'Tamil Nadu', TR: 'Tripura', TS: 'Telangana', UK: 'Uttarakhand',
    UP: 'Uttar Pradesh', WB: 'West Bengal'
  };
  return map[String(code || '').toUpperCase()] || String(code || '').toUpperCase() || '';
}

function gstStateFromCode(code) {
  const map = {
    '01': 'Jammu & Kashmir', '02': 'Himachal Pradesh', '03': 'Punjab', '04': 'Chandigarh',
    '05': 'Uttarakhand', '06': 'Haryana', '07': 'Delhi', '08': 'Rajasthan', '09': 'Uttar Pradesh',
    '10': 'Bihar', '11': 'Sikkim', '12': 'Arunachal Pradesh', '13': 'Nagaland', '14': 'Manipur',
    '15': 'Mizoram', '16': 'Tripura', '17': 'Meghalaya', '18': 'Assam', '19': 'West Bengal',
    '20': 'Jharkhand', '21': 'Odisha', '22': 'Chhattisgarh', '23': 'Madhya Pradesh', '24': 'Gujarat',
    '27': 'Maharashtra', '29': 'Karnataka', '30': 'Goa', '32': 'Kerala', '33': 'Tamil Nadu',
    '34': 'Puducherry', '36': 'Telangana', '37': 'Andhra Pradesh', '38': 'Ladakh'
  };
  return map[code] || '';
}

function resolveIdentifierFromProfile(profile) {
  if (!profile.identifierType && !profile.identifierValue) return null;
  return { type: profile.identifierType, value: profile.identifierValue };
}

function normalizeProfile(profile) {
  return {
    businessName: clean(profile.businessName),
    businessType: clean(profile.businessType),
    sectorId: clean(profile.sectorId),
    city: clean(profile.city),
    state: clean(profile.state),
    stage: clean(profile.stage),
    employees: Number(profile.employees || 0),
    entityType: clean(profile.entityType),
    servesAlcohol: typeof profile.servesAlcohol === 'boolean' ? profile.servesAlcohol : null,
    identifierType: clean(profile.identifierType),
    identifierValue: clean(profile.identifierValue),
    incorporationYear: clean(profile.incorporationYear),
    listingStatus: clean(profile.listingStatus)
  };
}

function normalizeAttachments(items) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => ({ name: clean(item.name), sizeLabel: clean(item.sizeLabel), type: clean(item.type) })).filter((item) => item.name);
}

function slug(value) { return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
function clean(value) { return typeof value === 'string' ? value.trim() : String(value || '').trim(); }
function normalize(value) { return String(value || '').replace(/\r/g, '').replace(/[ \t]+/g, ' ').trim(); }

module.exports = { buildChatConciergeResponse };
