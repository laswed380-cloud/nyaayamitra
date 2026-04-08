const officialAnchors = {
  mcaMaster: {
    source: 'MCA21 master data and services help',
    url: 'https://www.mca.gov.in/Ministry/pdf/MCAV2Release2_Help.pdf',
    relevance: 'Official MCA reference for master data and company / LLP services'
  },
  spice: {
    source: 'MCA SPICe+ incorporation guide',
    url: 'https://www.mca.gov.in/content/dam/mca/videos/audio_pdfs/Video_SPICeplus_AudioText.pdf',
    relevance: 'Official incorporation workflow and linked-form behavior'
  },
  agile: {
    source: 'MCA AGILE-PRO-S instruction kit',
    url: 'https://www.mca.gov.in/Ministry/pdf/AGILE-PRO_help.pdf',
    relevance: 'Linked GST, EPFO, ESIC, bank, and professional-tax routing'
  },
  dir3: {
    source: 'MCA DIR-3 instruction kit',
    url: 'https://www.mca.gov.in/content/dam/mca/mca-forms-instruction-kit/Instruction%20Kit_Form%20No%20DIR%203.pdf',
    relevance: 'DIN route for appointment in an existing company or LLP'
  },
  dir3Kyc: {
    source: 'MCA DIR-3 KYC instruction kit',
    url: 'https://www.mca.gov.in/content/dam/mca/mca-forms-instruction-kit/Instruction%20Kit_Form%20No%20DIR%203%20KYC.pdf',
    relevance: 'Director KYC timing and evidence'
  },
  inc22: {
    source: 'MCA INC-22 instruction kit',
    url: 'https://www.mca.gov.in/MCA21/dca/help/instructionkit/NCA/Form_INC-22_help.pdf',
    relevance: 'Registered office notice and proof expectations'
  },
  inc20a: {
    source: 'MCA INC-20A instruction kit',
    url: 'https://www.mca.gov.in/content/dam/mca-aem-forms/instructionkits/Instruction%20Kit_INC-20A.pdf',
    relevance: 'Commencement of business post-incorporation'
  },
  dsc: {
    source: 'Controller of Certifying Authorities - DSC',
    url: 'https://cca.gov.in/index.php/digital_signature_certificate.html',
    relevance: 'DSC basics, certificate handling, and certifying-authority path'
  },
  gst: {
    source: 'GST Portal',
    url: 'https://www.gst.gov.in/',
    relevance: 'GST registration and business place evidence'
  },
  udyam: {
    source: 'Udyam Registration',
    url: 'https://www.udyamregistration.gov.in/UdyamRegistration.aspx',
    relevance: 'MSME registration and Aadhaar/PAN-linked enterprise facts'
  },
  epfo: {
    source: 'EPFO employer portal',
    url: 'https://unifiedportal-emp.epfindia.gov.in/',
    relevance: 'EPFO trigger and employer registration'
  },
  esic: {
    source: 'ESIC portal',
    url: 'https://gateway.esic.gov.in/web/guest/home',
    relevance: 'ESIC registration and payroll-go-live checks'
  },
  incomeTax: {
    source: 'Income Tax portal',
    url: 'https://www.incometax.gov.in/iec/foportal/',
    relevance: 'PAN/TAN activation and tax profile setup'
  }
};

function runLaunchAutopilot(input = {}) {
  const brief = normalize(input.brief || '');
  const lower = brief.toLowerCase();
  const founders = Number(input.founders || extractNumber(lower, /(\d+)\s+founder/) || 2);
  const tracks = [
    track('Incorporation runbook', 'Prepare entity choice, name, object clause, capital, shareholding, SPICe+, and linked forms.'),
    track('Director and signatory pack', 'Collect PAN, address proof, photos, mobile/email, DIN route, DSC readiness, and annual KYC logic.'),
    track('Registered office proof', 'Choose owned, rented, or virtual path and assemble NOC, utility proof, and address evidence.'),
    track('Linked registrations', 'Sequence GST, bank, Udyam, EPFO, ESIC, professional tax, shops, first auditor, and INC-20A actions.')
  ];

  if (/saas|software|services|consulting|implementation/.test(lower)) {
    tracks.push(track('Tax and contract setup', 'Plan GST position, invoice and TDS basics, customer contracts, privacy terms, and post-incorporation approvals.'));
  }
  if (/employee|hire|payroll|team/.test(lower)) {
    tracks.push(track('Payroll go-live', 'Check EPFO, ESIC, professional tax, employment records, and payroll evidence before hiring.'));
  }
  if (/data|privacy|dpdp|personal data/.test(lower)) {
    tracks.push(track('Privacy baseline', 'Prepare founder, employee, and customer privacy notice, vendor review, and evidence trail.'));
  }

  return {
    title: input.title || 'Company launch autopilot',
    summary: `Launch autopilot created ${tracks.length} workstream${tracks.length === 1 ? '' : 's'} for ${founders} founder${founders === 1 ? '' : 's'}.`,
    readinessScore: 58,
    readinessLabel: 'Planning and evidence stage',
    workstreams: tracks,
    blockers: [
      'Do not buy random DSCs or submit MCA webforms before the director facts, office proof, and signatory details are internally verified.',
      'Do not assume GST, EPFO, ESIC, professional tax, or shops registration applies the same way in every fact pattern; confirm the triggers before filing.',
      'Do not start customer invoicing or salary processing until the linked registration and bank/approval path is actually ready.'
    ],
    firstSevenDays: [
      'Create one launch matter for incorporation, one for director evidence, and one for linked registrations.',
      'Collect founder PAN, address proof, photo, mobile, email, Aadhaar/passport, and signatory status.',
      'Freeze the registered office path and gather NOC plus utility proof before touching MCA forms.',
      'Confirm entity choice, founders, capital, business objects, and shareholding in one signed facts sheet.',
      'Decide which outside services must be engaged: CA/CS filing support, DSC issuance, registered office support, bank, e-sign, and document storage.',
      'Prepare the post-incorporation calendar for first board meeting, auditor, bank, GST/Udyam, payroll, and commencement.',
      'Save all proofs, drafts, and approvals into one evidence locker before portal submission.'
    ],
    documentRequests: [
      'Founder PAN, address proof, recent photograph, mobile number, email ID, and Aadhaar/passport details',
      'Name options, object clause summary, shareholding split, capital table, and state/city of registered office',
      'Owned/rented/virtual office proof pack with owner consent and recent utility document',
      'Business activity note, expected invoices, employee plan, GST and Udyam intent, and first bank preference',
      'Authorized signatory and reviewer list for filings, bank, tax, and HR operations'
    ],
    owners: [
      { owner: 'Founder', responsibility: 'Commercial facts, approvals, signatory decisions, and provider choices' },
      { owner: 'CA / CS', responsibility: 'MCA form logic, linked registrations, first auditor, and filing review' },
      { owner: 'Operations', responsibility: 'Document collection, follow-up, portal proof, and evidence filing' }
    ],
    timeline: [
      'Day 1-2: collect founder, office, and business facts',
      'Day 2-4: finish signatory and office pack',
      'Day 3-5: review SPICe+ and linked forms',
      'After incorporation: bank, GST/Udyam, first board and auditor, payroll and commencement path'
    ],
    serviceConnectors: connectorCatalog({
      needsRegisteredOffice: /virtual|office|address/.test(lower),
      needsPayroll: /employee|hire|payroll/.test(lower),
      needsTax: true
    }),
    citations: [
      officialAnchors.spice,
      officialAnchors.agile,
      officialAnchors.dsc,
      officialAnchors.gst,
      officialAnchors.udyam
    ],
    guardrails: guardrails('launch autopilot')
  };
}

function buildIncorporationRunbook(input = {}) {
  const entityType = clean(input.entityType) || 'Private Limited Company';
  const state = clean(input.state) || 'Karnataka';
  const officeMode = clean(input.officeMode) || 'Rented office';
  const founders = Number(input.founders || 2);
  const employees = Number(input.employees || 0);
  const wantsGst = truthy(input.wantsGst);
  const wantsMsme = truthy(input.wantsMsme);
  const plannedFunding = clean(input.plannedFunding) || 'Bootstrapped / early external funding possible';

  const formsInOrder = [
    'SPICe+ Part A / Part B',
    'e-MOA',
    'e-AOA',
    'AGILE-PRO-S',
    'INC-9 (where the portal route requires it)',
    'Post-incorporation: first board / sole director resolution',
    'Post-incorporation: first auditor and commencement path'
  ];

  if (wantsGst) {
    formsInOrder.push('GST activation and evidence pack');
  }
  if (wantsMsme) {
    formsInOrder.push('Udyam registration');
  }

  const blockers = [
    'Stop before filing if the name list, object clause, capital split, or office proof is still unsettled.',
    'Stop before submission if any proposed director does not have the final identity and address pack ready.',
    'Stop before launch if the post-incorporation calendar has not been assigned to real owners.'
  ];

  return {
    title: `${entityType} incorporation runbook`,
    summary: `Runbook prepared for ${entityType} in ${state}. It is organized for filing readiness, not autonomous submission.`,
    readinessScore: 63 + (wantsGst ? 6 : 0) + (wantsMsme ? 4 : 0),
    readinessLabel: 'Evidence and form-planning stage',
    steps: [
      'Freeze entity choice, founders, capital, and shareholding.',
      'Prepare name choices and business objects in one approved facts sheet.',
      'Prepare director/subscriber evidence pack and DSC/signatory readiness.',
      `Prepare registered office pack for the ${officeMode.toLowerCase()} route.`,
      'Prepare SPICe+ and linked-form data in one review file.',
      'Review all facts with CA/CS/legal before uploading and signing.',
      'After approval, submit, preserve SRN, challan, and uploaded PDFs.',
      'Open post-incorporation tasks immediately after certificate issuance.'
    ],
    formsInOrder,
    documents: [
      'Founders and subscribers identity proof',
      'Founders and subscribers address proof',
      'Recent photographs and signatory details',
      'Proposed name list and object clause note',
      'Capital and shareholding table',
      'Registered office proof, NOC, and utility evidence',
      'Authorized signatory and reviewer list',
      wantsGst ? 'GST place-of-business and authorized-signatory evidence' : 'GST applicability note',
      wantsMsme ? 'Udyam-ready PAN/Aadhaar-linked enterprise facts' : 'MSME applicability note'
    ],
    owners: [
      { owner: 'Founder', responsibility: 'Approves name, objects, capital, office route, and provider choices' },
      { owner: 'CA / CS', responsibility: 'Prepares MCA webforms, linked forms, and filing review' },
      { owner: 'Operations', responsibility: 'Collects documents, tracks open items, and preserves proof' }
    ],
    timeline: [
      'Preparation: facts sheet, name options, director pack, office pack',
      'Drafting: SPICe+ and linked forms',
      'Review: CA/CS/legal and signatory check',
      'Submission: upload, payment, SRN, and proof locker',
      'Post-incorporation: bank, GST/Udyam, board, auditor, payroll, commencement'
    ],
    blockers,
    risks: [
      'Name resubmission risk if the object clause and proposed names do not align cleanly.',
      'Director or subscriber delays if the identity, address, or signatory pack is incomplete.',
      'Post-incorporation drift if first board, first auditor, bank, GST/Udyam, or commencement is not sequenced on day one.'
    ],
    serviceConnectors: connectorCatalog({
      needsRegisteredOffice: officeMode.toLowerCase().includes('virtual'),
      needsPayroll: employees > 0,
      needsTax: wantsGst
    }),
    emailDrafts: [
      {
        title: 'Founder facts approval note',
        subject: `${entityType} incorporation facts signoff`,
        body:
          'Please confirm the attached name options, object clause, shareholding, registered office route, and signatory list. We should not proceed to filing until this facts sheet is frozen.'
      },
      {
        title: 'CA / CS filing handoff',
        subject: `${entityType} incorporation filing pack ready for review`,
        body:
          'The director pack, office proof, and incorporation facts are ready. Please review SPICe+ and linked forms, mark any missing items, and confirm the signatory sequence before upload.'
      }
    ],
    citations: [officialAnchors.spice, officialAnchors.agile, officialAnchors.inc22],
    guardrails: guardrails('incorporation runbook'),
    facts: {
      entityType,
      state,
      founders,
      employees,
      officeMode,
      plannedFunding
    }
  };
}

function buildDirectorCompliancePack(input = {}) {
  const directors = Number(input.directors || 2);
  const newCompany = truthy(input.newCompany !== false ? input.newCompany : true);
  const hasExistingDin = truthy(input.hasExistingDin);
  const hasDsc = truthy(input.hasDsc);
  const annualKycDue = 'DIR-3 KYC applies for DIN holders up to 31 March of the financial year and is generally due by 30 September of the immediately next financial year.';
  const dinRoute = newCompany && !hasExistingDin
    ? 'First directors in a new company usually flow through the incorporation route instead of a separate DIR-3 filing.'
    : 'If the person is being added to an existing company or LLP and does not already hold DIN, review the DIR-3 route.';

  return {
    title: 'Director, DIN, DSC, and KYC pack',
    summary: `Director-readiness pack prepared for ${directors} proposed director${directors === 1 ? '' : 's'}.`,
    readinessScore: 52 + (hasDsc ? 16 : 0) + (hasExistingDin ? 10 : 0),
    readinessLabel: hasDsc ? 'Signature partially ready' : 'Identity and signatory stage',
    steps: [
      'Confirm which people will be first directors and who will sign.',
      dinRoute,
      'Collect PAN, address proof, recent photograph, mobile number, and email ID for each director.',
      'Arrange DSC only after PAN/name/email/mobile mapping is internally checked.',
      'Record who already has DIN and who will need annual DIR-3 KYC tracking later.',
      'Store the approved director pack before filing or portal registration.'
    ],
    documents: [
      'PAN card copy',
      'Current address proof',
      'Recent photograph',
      'Mobile number and email for OTP and portal use',
      'Aadhaar or passport details as applicable',
      'Resident-director confirmation where relevant',
      'Board / founder approval for signatory roles'
    ],
    blockers: [
      'Do not order DSC until the exact legal name, PAN mapping, email, and phone details are confirmed.',
      'Do not assume DIR-3 is the correct DIN route for first directors in a fresh incorporation.',
      annualKycDue
    ],
    risks: [
      'Duplicate or mismatched identity details can delay MCA filing and DSC issuance.',
      'If the signatory pack is inconsistent across MCA, bank, GST, and payroll systems, later registrations become messy.',
      'DIR-3 KYC failure can deactivate the DIN for use until rectified.'
    ],
    serviceConnectors: connectorCatalog({
      needsDsc: !hasDsc,
      needsTax: false,
      needsRegisteredOffice: false
    }),
    timeline: [
      'Collect identity and address pack first',
      'Confirm DIN route second',
      'Arrange DSC third',
      'Track annual DIR-3 KYC after DIN activation'
    ],
    emailDrafts: [
      {
        title: 'Director document request',
        subject: 'Director KYC and signatory pack needed',
        body:
          'Please share PAN, address proof, recent photograph, mobile number, email ID, and confirmation of current DIN / DSC status so the director pack can be frozen before filing.'
      }
    ],
    citations: [officialAnchors.dir3, officialAnchors.dir3Kyc, officialAnchors.dsc],
    guardrails: guardrails('director readiness')
  };
}

function buildRegisteredOfficePlan(input = {}) {
  const officeMode = clean(input.officeMode) || 'Rented office';
  const state = clean(input.state) || 'Karnataka';
  const city = clean(input.city) || 'Bengaluru';
  const sharedOffice = truthy(input.sharedOffice);
  const route = officeMode.toLowerCase();

  const documents = route.includes('owned')
    ? ['Ownership proof', 'Recent utility proof', 'Occupancy / property support if relevant']
    : ['Owner NOC', 'Lease or occupancy arrangement', 'Recent utility proof', 'Landlord identity and address trail if needed'];

  if (route.includes('virtual') || sharedOffice) {
    documents.push('Provider agreement', 'Mail-handling / occupancy proof', 'Provider support letter for registered office use');
  }

  return {
    title: 'Registered office proof plan',
    summary: `Address-proof plan prepared for a ${officeMode.toLowerCase()} in ${city}, ${state}.`,
    readinessScore: 54 + (documents.length >= 4 ? 8 : 0),
    readinessLabel: 'Evidence collection stage',
    steps: [
      `Confirm the registered office will be a ${officeMode.toLowerCase()}.`,
      'Collect owner or provider consent before filing.',
      'Check the latest utility proof and make sure the address exactly matches the intended filing address.',
      'Store the address pack in one folder for incorporation, bank, GST, and later changes.',
      'If the office changes after incorporation, review the INC-22 path and preserve the update trail.'
    ],
    documents,
    blockers: [
      'Do not file the office address until the exact address text, pin code, and supporting proof match perfectly.',
      'Do not rely on an address service unless the provider confirms registered-office support in writing.',
      'Do not scatter office proofs across email threads; keep one approved folder.'
    ],
    risks: [
      'Mismatch between the utility proof, NOC, and filed address creates resubmission risk.',
      'Virtual or shared office routes need extra provider discipline and documentary proof.',
      'The same office evidence often gets reused for bank and GST, so errors multiply if not cleaned early.'
    ],
    serviceConnectors: connectorCatalog({
      needsRegisteredOffice: route.includes('virtual') || sharedOffice,
      needsTax: false,
      needsDsc: false
    }),
    emailDrafts: [
      {
        title: 'Owner / provider NOC request',
        subject: 'Registered office consent and address proof request',
        body:
          'Please share the signed consent / NOC and the latest address proof for use as the company registered office. The address text must match the supporting proof exactly.'
      }
    ],
    citations: [officialAnchors.inc22],
    guardrails: guardrails('registered office proof')
  };
}

function buildLinkedRegistrationsPlan(input = {}) {
  const state = clean(input.state) || 'Karnataka';
  const employees = Number(input.employees || 0);
  const wantsGst = truthy(input.wantsGst);
  const wantsMsme = truthy(input.wantsMsme);
  const payroll = employees > 0 || truthy(input.payroll);

  const formsInOrder = [
    'PAN / TAN activation',
    'Bank account setup',
    wantsGst ? 'GST registration / activation' : 'GST applicability note',
    wantsMsme ? 'Udyam registration' : 'MSME applicability note',
    'First board / sole director resolutions',
    'First auditor appointment',
    'INC-20A commencement of business'
  ];

  if (payroll) {
    formsInOrder.push('EPFO / ESIC / professional tax / shops and payroll readiness');
  }

  const processing = [
    'Preserve SRN, ARN, challan, or acknowledgment immediately after each submission.',
    'Do not mark a workflow complete until the proof, final PDF, and owner note are saved.',
    'Track post-incorporation actions in parallel instead of waiting for memory or inbox threads.'
  ];

  return {
    title: 'Linked registrations and launch compliance roadmap',
    summary: `Roadmap prepared for ${state} with ${employees} planned employee${employees === 1 ? '' : 's'}.`,
    readinessScore: 61 + (wantsGst ? 8 : 0) + (wantsMsme ? 4 : 0) + (payroll ? 6 : 0),
    readinessLabel: 'Sequencing and follow-up stage',
    steps: [
      'Confirm what is linked during incorporation and what will be completed after the certificate is issued.',
      'Open one tracker each for bank, GST, Udyam, payroll-law, first board, first auditor, and commencement.',
      'Capture the authority route, signatory, required documents, and expected proof for each item.',
      'Submit only after the incorporation folder, office proof, and signatory pack are frozen.',
      'Preserve every acknowledgment and create a follow-up target date.'
    ],
    formsInOrder,
    actionRegister: [
      'Bank account opening pack',
      wantsGst ? 'GST portal pack with address and signatory evidence' : 'GST threshold memo',
      wantsMsme ? 'Udyam pack with Aadhaar/PAN-linked enterprise facts' : 'MSME note',
      'First board / sole director resolution pack',
      'First auditor consent and eligibility pack',
      'INC-20A commencement proof pack',
      payroll ? 'Payroll-law registration and onboarding pack' : 'Payroll applicability note'
    ],
    blockers: [
      'Do not start commercial operations without sequencing the commencement, bank, and tax path.',
      'Do not hire and pay employees without checking payroll-law triggers and registrations.',
      'Do not treat incorporation as done until post-incorporation tasks are assigned and tracked.'
    ],
    timeline: [
      'Immediately after certificate: bank, PAN/TAN activation, launch tracker',
      'Early post-incorporation: GST / Udyam / payroll registrations as applicable',
      'Within the early corporate window: first board or sole director action and first auditor',
      'Before operations: commencement of business, contracts, and invoice readiness'
    ],
    processNotes: processing,
    serviceConnectors: connectorCatalog({
      needsRegisteredOffice: false,
      needsPayroll: payroll,
      needsTax: wantsGst || payroll
    }),
    citations: [
      officialAnchors.agile,
      officialAnchors.gst,
      officialAnchors.udyam,
      officialAnchors.epfo,
      officialAnchors.esic,
      officialAnchors.inc20a
    ],
    guardrails: guardrails('linked registrations')
  };
}

function recommendServiceConnectors(input = {}) {
  const need = normalize(input.need || 'company launch');
  const wantsVirtualOffice = truthy(input.virtualOffice) || /virtual|registered office|address/.test(need);
  const needsDsc = truthy(input.dsc) || /dsc|signature/.test(need);
  const needsPayroll = truthy(input.payroll) || /employee|payroll|epfo|esic/.test(need);

  return {
    title: 'Service connector plan',
    summary: 'Connector categories mapped. This app can organize the handoff now and connect real providers later once you choose them.',
    readinessScore: 57,
    readinessLabel: 'Partner selection and credential stage',
    serviceConnectors: connectorCatalog({
      needsRegisteredOffice: wantsVirtualOffice,
      needsDsc,
      needsPayroll,
      needsTax: true
    }),
    steps: [
      'Decide which connector categories will be internal, external, or deferred.',
      'Freeze one owner per provider category.',
      'Collect the exact credentials, portal users, signatory approvals, and proof required to connect the provider safely.',
      'Do not paste secrets into chat or source control; add them only to runtime environment or a secure vault.'
    ],
    documents: [
      'Provider shortlist and commercial owner',
      'Scope of work / support note',
      'Credential and portal access matrix',
      'Signatory / approver matrix',
      'Evidence storage and handoff rules'
    ],
    citations: [officialAnchors.dsc, officialAnchors.spice, officialAnchors.agile],
    guardrails: guardrails('service connectors')
  };
}

function buildEntityIdentifierSnapshot(input = {}) {
  const identifierType = clean(input.identifierType).toLowerCase();
  const identifierValue = clean(input.identifierValue || input.identifier || input.businessIdentifier).toUpperCase();
  const existingSituation = normalize(input.existingSituation || input.message || '');
  const parsed = parseIdentifier(identifierType, identifierValue);

  const inferredState = clean(input.state) || parsed.state || 'Unknown';
  const inferredEntityType = clean(input.entityType) || parsed.entityType || 'Entity type needs confirmation';
  const inferredStage = clean(input.stage) || (parsed.isExistingEntity ? 'operating' : 'idea');
  const identifierLabel = humanIdentifierLabel(identifierType || parsed.type || 'identifier');

  const immediateChecks = [
    'Entity master data and incorporation details',
    'Bank and authorized-signatory setup',
    'First auditor and books / CA ownership',
    'GST, PT, payroll, and tax-trigger review',
    'Evidence locker and renewal board'
  ];

  if (/name|object/.test(existingSituation.toLowerCase())) {
    immediateChecks.unshift('Name-change and object-change board action route');
  }

  const statusBoard = [
    statusItem('Identifier', `${identifierLabel} recognized`, identifierValue || 'Identifier not supplied'),
    statusItem('Entity type', parsed.entityType ? 'Inferred' : 'Needs confirmation', inferredEntityType),
    statusItem('State of registration', parsed.state ? 'Inferred' : 'Needs confirmation', inferredState),
    statusItem('Company name and registered office', 'Need official master data or uploaded proof', 'A CIN does not encode the legal name or registered office. Those should come from MCA master data, COI, or filed records.'),
    statusItem('Objects and activity scope', 'Need MCA filings or uploaded MOA', 'Objects do not live inside the CIN. They should come from MOA / filed forms or a verified company profile.'),
    statusItem('Exact due dates', parsed.incorporationYear ? 'Need exact incorporation date' : 'Need incorporation details', 'A CIN can show the year, but not the exact incorporation date needed for precise deadline math.'),
    statusItem('Sector-specific licences', /food|hospital|factory|school|retail|software|restaurant/.test(existingSituation.toLowerCase()) ? 'Can start mapping now' : 'Need business activity', 'Food, factory, healthcare, education, excise, fire, trade, and pollution routes depend on what the company actually does.'),
    statusItem('Current compliance health', 'Needs portal checks and evidence review', 'Without filings, certificates, challans, acknowledgments, or public-portal checks, the app should not say everything is fine.')
  ];

  const pendingItems = [
    parsed.incorporationYear ? `Confirm the exact incorporation date for ${identifierValue} to compute time-bound MCA actions precisely.` : 'Upload the incorporation proof or master data screenshot so the corporate clock can be checked properly.',
    'Upload the certificate set already available: COI, PAN, GST certificate if any, trade / food / fire / labour permissions if any.',
    'Confirm what the business actually does so sector licences and local approvals can be mapped accurately.',
    'Confirm whether employees, GST billing, alcohol service, LPG, hazardous storage, or regulated activity are already live.'
  ];

  const nextSteps = [
    'Pull or upload the core corporate records first.',
    'Check whether first auditor, commencement, bank, and tax setup were completed.',
    'Map sector-specific licences only after the business activity is confirmed.',
    'Open a renewal and evidence board so nothing important lives only in email or memory.'
  ];

  return {
    title: `${identifierLabel} snapshot`,
    summary: buildIdentifierSummary({ identifierLabel, identifierValue, parsed, inferredState, inferredEntityType }),
    readinessScore: parsed.isExistingEntity ? 52 : 22,
    readinessLabel: parsed.isExistingEntity ? 'Baseline corporate review started' : 'New-business identification stage',
    identity: {
      identifierLabel,
      identifierValue,
      entityType: inferredEntityType,
      state: inferredState,
      incorporationYear: parsed.incorporationYear || 'Needs confirmation',
      listingStatus: parsed.listingStatus || 'Needs confirmation',
      industryCode: parsed.industryCode || 'Needs confirmation'
    },
    immediateChecks,
    statusBoard,
    pendingItems,
    nextSteps,
    sourceMatrix: buildOfficialSourceMatrix(parsed),
    citations: [
      officialAnchors.mcaMaster,
      officialAnchors.spice,
      officialAnchors.agile,
      officialAnchors.inc20a,
      officialAnchors.gst
    ],
    unknowns: [
      'Exact incorporation date',
      'Actual business activity',
      'City of operations',
      'Existing certificates and filings already obtained'
    ],
    guardrails: guardrails('identifier snapshot')
  };
}

function connectorCatalog(options = {}) {
  const connectors = [
    connector('CA / CS filing support', 'Needed', 'Review incorporation facts, MCA form logic, linked registrations, first board, first auditor, and commencement.'),
    connector('Document locker and e-sign workflow', 'Needed', 'Keep one approved source of truth for drafts, signatures, and portal proof.'),
    connector('Bank onboarding pack', 'Needed', 'Freeze signatories, office proof, board resolution, and post-incorporation evidence before account opening.')
  ];

  if (options.needsDsc !== false) {
    connectors.unshift(connector('DSC issuance support', options.needsDsc ? 'Select provider' : 'Optional', 'Choose a certifying-authority route, map PAN/name correctly, and preserve issuance proof.'));
  }
  if (options.needsRegisteredOffice) {
    connectors.push(connector('Registered office service / provider', 'Select provider', 'Use only a provider willing to support registered-office proof, NOC, and continuing documentary support.'));
  }
  if (options.needsTax) {
    connectors.push(connector('GST and tax operations support', 'Needed', 'Prepare GST position, authorized-signatory evidence, and filing trail.'));
  }
  if (options.needsPayroll) {
    connectors.push(connector('Payroll and labour-law support', 'Needed', 'Prepare employee onboarding, PF/ESI/PT logic, and monthly evidence trail.'));
  }
  return connectors;
}

function connector(name, fit, why) {
  return { name, fit, why };
}

function track(name, why) {
  return { id: slug(name), name, why };
}

function slug(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractNumber(text, pattern) {
  const match = String(text || '').match(pattern);
  return match ? Number(match[1]) : 0;
}

function truthy(value) {
  return value === true || value === 'on' || String(value || '').toLowerCase() === 'yes' || String(value || '').toLowerCase() === 'true';
}

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalize(value) {
  return String(value || '').replace(/\r/g, '').replace(/[ \t]+/g, ' ').trim();
}

function guardrails(context) {
  return {
    context,
    assistiveOnly: true,
    humanReviewRequired: true,
    exportPolicy: 'Require founder and CA / CS / legal review before any real filing, bank submission, or provider handoff.'
  };
}

function buildIdentifierSummary(context) {
  if (context.parsed.type === 'cin') {
    return `I recognized ${context.identifierValue} as a ${context.parsed.listingStatus.toLowerCase()} ${context.inferredEntityType} registered in ${context.inferredState} in ${context.parsed.incorporationYear}. I can start the corporate baseline immediately, but I still need the exact incorporation date and business activity before I can truthfully say which items are overdue or fully in order.`;
  }
  if (context.parsed.type === 'gstin') {
    return `I recognized ${context.identifierValue} as a GSTIN anchored to ${context.inferredState}. That is enough to start the tax and filing baseline, but not enough by itself to confirm the whole compliance position.`;
  }
  if (context.parsed.type === 'udyam') {
    return `I recognized ${context.identifierValue} as a Udyam identifier. I can use that to anchor the MSME and core business profile, then map the remaining compliance baseline from there.`;
  }
  return `I recognized ${context.identifierValue || 'the identifier'} and can use it as the business anchor, then layer the compliance baseline around it.`;
}

function parseIdentifier(type, value) {
  if (type === 'cin' || /^[A-Z][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/i.test(value)) {
    const upper = value.toUpperCase();
    return {
      type: 'cin',
      value: upper,
      listingStatus: upper.startsWith('U') ? 'Unlisted' : upper.startsWith('L') ? 'Listed' : 'Company',
      industryCode: upper.slice(1, 6),
      state: stateFromCode(upper.slice(6, 8)),
      incorporationYear: upper.slice(8, 12),
      entityType: companyTypeFromCode(upper.slice(12, 15)),
      isExistingEntity: true
    };
  }

  if (type === 'gstin' || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][A-Z0-9]Z[A-Z0-9]$/i.test(value)) {
    const upper = value.toUpperCase();
    return {
      type: 'gstin',
      value: upper,
      state: stateFromGstin(upper.slice(0, 2)),
      entityType: 'Business registered under GST',
      isExistingEntity: true
    };
  }

  if (type === 'udyam' || /^UDYAM-[A-Z]{2}-[0-9]{2}-[0-9]{7}$/i.test(value)) {
    const upper = value.toUpperCase();
    return {
      type: 'udyam',
      value: upper,
      state: stateFromCode(upper.split('-')[1]),
      entityType: 'MSME / Udyam registered business',
      isExistingEntity: true
    };
  }

  if (type === 'llpin' || /^[A-Z]{3}-[0-9]{4}$/i.test(value)) {
    return {
      type: 'llpin',
      value: value.toUpperCase(),
      entityType: 'LLP',
      isExistingEntity: true
    };
  }

  return {
    type,
    value,
    isExistingEntity: type !== 'new-business'
  };
}

function humanIdentifierLabel(type) {
  const map = {
    cin: 'CIN',
    llpin: 'LLPIN',
    gstin: 'GSTIN',
    udyam: 'Udyam',
    fssai: 'FSSAI',
    licence: 'Licence',
    'new-business': 'New business'
  };
  return map[type] || 'Identifier';
}

function stateFromCode(code) {
  const map = {
    AP: 'Andhra Pradesh',
    AR: 'Arunachal Pradesh',
    AS: 'Assam',
    BR: 'Bihar',
    CG: 'Chhattisgarh',
    CH: 'Chandigarh',
    DL: 'Delhi',
    GA: 'Goa',
    GJ: 'Gujarat',
    HR: 'Haryana',
    HP: 'Himachal Pradesh',
    JH: 'Jharkhand',
    JK: 'Jammu and Kashmir',
    KA: 'Karnataka',
    KL: 'Kerala',
    MH: 'Maharashtra',
    MP: 'Madhya Pradesh',
    OD: 'Odisha',
    PB: 'Punjab',
    RJ: 'Rajasthan',
    TN: 'Tamil Nadu',
    TS: 'Telangana',
    UP: 'Uttar Pradesh',
    WB: 'West Bengal'
  };
  return map[String(code || '').toUpperCase()] || String(code || '').toUpperCase() || 'Unknown';
}

function stateFromGstin(code) {
  const map = {
    '29': 'Karnataka',
    '27': 'Maharashtra',
    '33': 'Tamil Nadu',
    '36': 'Telangana',
    '07': 'Delhi'
  };
  return map[String(code || '')] || 'State to be confirmed';
}

function companyTypeFromCode(code) {
  const map = {
    OPC: 'OPC',
    PTC: 'Private Limited Company',
    PLC: 'Public Limited Company',
    FTC: 'Subsidiary of foreign company',
    NPL: 'Not for profit company',
    ULT: 'Unlimited company',
    GOI: 'Government company'
  };
  return map[String(code || '').toUpperCase()] || String(code || '').toUpperCase() || 'Company';
}

function statusItem(label, status, note) {
  return { label, status, note };
}

function buildOfficialSourceMatrix(parsed) {
  return [
    sourceMatrixItem(
      'MCA master data',
      'https://www.mca.gov.in/',
      'Legal name, CIN/LLPIN, company type, incorporation details, registered office, and director baseline',
      'Public master-data access on MCA services; some deeper records or filings may require paid or authenticated access'
    ),
    sourceMatrixItem(
      'MCA filed records / constitutional documents',
      'https://www.mca.gov.in/',
      'Objects, MOA, AOA, board and filing trail, corporate changes',
      'Needs filed records, uploaded copies, or authenticated / paid access depending on the record'
    ),
    sourceMatrixItem(
      'GST taxpayer search',
      'https://www.gst.gov.in/',
      'GST registration status, legal name, trade name, constitution, principal place, return-filing visibility',
      'GSTIN required; pre-login search shows public profile, more detail after login'
    ),
    sourceMatrixItem(
      'Udyam verification',
      'https://udyamregistration.gov.in/Udyam_Verify.aspx',
      'MSME / Udyam verification',
      'Udyam number plus captcha required'
    ),
    sourceMatrixItem(
      'EPFO establishment search',
      'https://unifiedportal-emp.epfindia.gov.in/publicPortal/no-auth/misReport/home/loadEstSearchHome',
      'Establishment master details, status, Form 5A details, and payment-related visibility',
      'Establishment name or code plus captcha required'
    ),
    sourceMatrixItem(
      'ESIC employer search',
      'https://portal.esic.gov.in/EmployerSearch',
      'Employer-code and employer-search visibility',
      'Employer code or employer name plus captcha required'
    ),
    sourceMatrixItem(
      'Sector and local approvals',
      parsed.state === 'Karnataka' ? 'https://labouronline.karnataka.gov.in/' : 'https://www.nsws.gov.in',
      parsed.state === 'Karnataka'
        ? 'Karnataka labour, local trade, fire, excise, pollution, healthcare, and other sector portals'
        : 'State and central approval discovery'
      ,
      'Usually depends on state, city, business activity, and often requires login or uploaded certificates'
    )
  ];
}

function sourceMatrixItem(name, url, canShow, accessNote) {
  return { name, url, canShow, accessNote };
}

module.exports = {
  buildEntityIdentifierSnapshot,
  buildDirectorCompliancePack,
  buildIncorporationRunbook,
  buildLinkedRegistrationsPlan,
  buildRegisteredOfficePlan,
  planCompanyFormation: buildIncorporationRunbook,
  recommendServiceConnectors,
  runBusinessAutopilot: runLaunchAutopilot
};
