const { officialSectorSources } = require('./sectorCompliance');

const platformCatalog = {
  product: {
    name: 'NyaayaMitra Launchpad',
    tagline: 'Plan -> Prepare -> File -> Track -> Preserve proof',
    positioning:
      'India-native company formation, Karnataka-heavy compliance management, and founder operations workspace for sector-specific filings, registrations, reminders, and proof-driven follow-up.',
    riskFrame:
      'Assistive incorporation and compliance system. Founders, CA/CS, legal, and authorized signatories must review facts, portal fields, and filings before submission.'
  },
  engines: [
    {
      id: 'sector-compliance',
      name: 'Sector Compliance Manager',
      status: 'Karnataka-heavy workflow engine',
      purpose: 'Maps business type and current status to sector-specific approvals, tax, labour, safety, and filing workflows.',
      capabilities: [
        'sector classification',
        'compliance gap analysis',
        'action plan in order',
        'application packet drafting',
        'reminder calendar',
        'submission folder blueprint'
      ]
    },
    {
      id: 'library',
      name: 'Compliance Knowledge Library',
      status: 'source-backed library',
      purpose: 'Stores sector packages, portals, laws, authority pages, and operator notes in one searchable place.',
      capabilities: [
        'sector package browsing',
        'official source stack',
        'portal and law references',
        'renewal awareness',
        'business-type presets',
        'human-check notes'
      ]
    },
    {
      id: 'submissions',
      name: 'Submission Desk',
      status: 'packet and follow-up engine',
      purpose: 'Turns compliance items into tracked submission packets with review, reference-number, and follow-up discipline.',
      capabilities: [
        'packet preparation',
        'review checklist',
        'reference number tracking',
        'follow-up dates',
        'authority email drafts',
        'evidence preservation'
      ]
    },
    {
      id: 'launch',
      name: 'Launch Autopilot',
      status: 'guided operating planner',
      purpose: 'Turns a founder brief into incorporation, director, office, registration, and compliance workstreams.',
      capabilities: [
        'founder brief triage',
        'blocker detection',
        'owner matrix',
        'first-week plan',
        'document request list',
        'timeline sequencing'
      ]
    },
    {
      id: 'incorporation',
      name: 'Incorporation Runbook',
      status: 'filing-pack planner',
      purpose: 'Prepares SPICe+, linked forms, name/object facts, capital structure, and post-incorporation actions.',
      capabilities: [
        'entity tradeoff framing',
        'SPICe+ sequence',
        'forms in order',
        'founder facts pack',
        'signatory readiness',
        'filing evidence checklist'
      ]
    },
    {
      id: 'directors',
      name: 'Director, DIN, DSC, and KYC Pack',
      status: 'identity-readiness planner',
      purpose: 'Explains DIN routes, DSC readiness, director KYC, and evidence per signatory.',
      capabilities: [
        'DIN route logic',
        'DSC readiness',
        'DIR-3 / DIR-3 KYC checklist',
        'director evidence pack',
        'resident-director checks',
        'annual KYC reminders'
      ]
    },
    {
      id: 'office',
      name: 'Registered Office and Address Proof',
      status: 'evidence workflow',
      purpose: 'Collects the correct address trail, owner consent, utility proof, and office mode evidence.',
      capabilities: [
        'owned vs rented vs virtual logic',
        'address proof checklist',
        'NOC draft points',
        'utility-bill check',
        'office evidence locker',
        'INC-22 awareness'
      ]
    },
    {
      id: 'registrations',
      name: 'Linked Registrations and Launch Compliance',
      status: 'sequencing engine',
      purpose: 'Orders GST, Udyam, EPFO, ESIC, professional tax, shops, bank, auditor, and commencement actions.',
      capabilities: [
        'AGILE-PRO-S linkage',
        'registration order',
        'portal route guidance',
        'proof preservation',
        'processing expectations',
        'post-incorporation stops'
      ]
    },
    {
      id: 'connectors',
      name: 'Service Connector Planner',
      status: 'partner-routing shell',
      purpose: 'Maps which outside services are needed and what credentials or approvals are required to connect them.',
      capabilities: [
        'DSC provider category',
        'registered office provider category',
        'CA / CS onboarding pack',
        'bank setup pack',
        'domain and email setup',
        'e-sign and document locker handoff'
      ]
    },
    {
      id: 'governance',
      name: 'Governance and Evidence Locker',
      status: 'approval guardrail shell',
      purpose: 'Keeps the launch process source-backed, reviewable, and organized by matter and export trail.',
      capabilities: [
        'official source stack',
        'human review gates',
        'evidence exports',
        'workflow logs',
        'signoff reminders',
        'portal proof preservation'
      ]
    }
  ],
  sourceTiers: [
    {
      tier: 'Tier 1',
      name: 'Mandatory official sources',
      authorityWeight: 1,
      connectors: [
        'MCA SPICe+',
        'MCA AGILE-PRO-S',
        'MCA DIR-3',
        'MCA DIR-3 KYC',
        'MCA INC-22',
        'Controller of Certifying Authorities',
        'GST portal',
        'Udyam Registration',
        'EPFO employer portal',
        'ESIC portal',
        'Income Tax portal'
      ]
    },
    {
      tier: 'Tier 2',
      name: 'Operator-controlled evidence',
      authorityWeight: 0.8,
      connectors: [
        'founder KYC pack',
        'registered office file',
        'CA / CS checklists',
        'board and auditor records',
        'bank documents',
        'employment and payroll facts',
        'sector operating facts',
        'waste, fire, and premises documents',
        'service-line and campus module sheets'
      ]
    }
  ],
  sourceHierarchy: [
    'Official MCA / regulator portal',
    'Official Karnataka state / local authority portal',
    'Official government registration portal',
    'Customer-approved evidence and signed documents',
    'Operator notes and timeline logs',
    'Model reasoning'
  ],
  roleDashboards: {
    founder: ['Launch blockers', 'Business profile', 'Critical stop checks', 'Registrations in order'],
    'CA / CS': ['Forms in order', 'Tax and audit calendar', 'Portal-ready packs', 'Evidence locker'],
    operations: ['Document collection', 'Submission evidence', 'Follow-up targets', 'Connector gaps'],
    sector: ['Food, factory, healthcare, or education modules', 'Authority sequence', 'Renewal board', 'Open compliance gaps']
  }
};

const workflowTemplates = [
  {
    id: 'incorporation-launch',
    name: 'Incorporation launch',
    module: 'incorporation',
    slaHours: 48,
    steps: [
      'Confirm entity choice and founder facts',
      'Prepare name, objects, capital, and shareholding',
      'Complete director and subscriber evidence pack',
      'Complete SPICe+ and linked forms',
      'Review, sign, upload, and preserve SRN'
    ],
    outputs: ['Incorporation runbook', 'Founder pack', 'Forms in order', 'Submission evidence checklist']
  },
  {
    id: 'director-readiness',
    name: 'Director and signature readiness',
    module: 'directors',
    slaHours: 24,
    steps: [
      'Confirm DIN route',
      'Collect identity and address evidence',
      'Arrange DSC and signatory setup',
      'Check resident-director and KYC readiness',
      'Preserve approved signatory pack'
    ],
    outputs: ['Director pack', 'DIN route memo', 'DSC checklist', 'KYC reminders']
  },
  {
    id: 'office-proof',
    name: 'Registered office proof',
    module: 'office',
    slaHours: 24,
    steps: [
      'Choose owned, rented, or virtual office path',
      'Collect owner consent and proof',
      'Check utility proof recency',
      'Prepare address evidence bundle',
      'Store proof for incorporation and later changes'
    ],
    outputs: ['Office proof pack', 'Address checklist', 'NOC prompt']
  },
  {
    id: 'launch-registrations',
    name: 'Linked registrations and launch compliance',
    module: 'registrations',
    slaHours: 36,
    steps: [
      'Confirm which registrations are linked at incorporation',
      'Sequence bank, GST, Udyam, payroll, and compliance actions',
      'Assign owners and due dates',
      'Record proof of each submission',
      'Track first board, auditor, and commencement actions'
    ],
    outputs: ['Registration roadmap', 'Evidence matrix', 'Follow-up plan']
  },
  {
    id: 'launch-governance',
    name: 'Launch governance and evidence',
    module: 'governance',
    slaHours: 12,
    steps: [
      'Open launch matters',
      'Attach generated packs and source anchors',
      'Record signoff and portal proof',
      'Save export trail',
      'Close blockers only after evidence is filed'
    ],
    outputs: ['Evidence locker', 'Approval log', 'Launch chronology']
  }
];

const seedSources = [
  {
    id: 'src-mca-spice',
    name: 'MCA SPICe+ incorporation guide',
    sourceType: 'official MCA incorporation source',
    tier: 'Tier 1',
    authorityLevel: 1,
    url: 'https://www.mca.gov.in/content/dam/mca/videos/audio_pdfs/Video_SPICeplus_AudioText.pdf',
    jurisdiction: 'India',
    freshness: 'official MCA source',
    humanCheck: 'Confirm the currently live webform path, linked forms, and dashboard behavior before filing.'
  },
  {
    id: 'src-mca-agile',
    name: 'MCA AGILE-PRO-S instruction kit',
    sourceType: 'official MCA linked registration source',
    tier: 'Tier 1',
    authorityLevel: 1,
    url: 'https://www.mca.gov.in/Ministry/pdf/AGILE-PRO_help.pdf',
    jurisdiction: 'India',
    freshness: 'official MCA source',
    humanCheck: 'Check live linked-registration options and state-specific professional tax conditions before submission.'
  },
  {
    id: 'src-mca-dir3',
    name: 'MCA DIR-3 instruction kit',
    sourceType: 'official MCA DIN source',
    tier: 'Tier 1',
    authorityLevel: 1,
    url: 'https://www.mca.gov.in/content/dam/mca/mca-forms-instruction-kit/Instruction%20Kit_Form%20No%20DIR%203.pdf',
    jurisdiction: 'India',
    freshness: 'official MCA source',
    humanCheck: 'Use DIR-3 only for the route applicable to an existing company or LLP; first directors in a new company usually follow the incorporation path.'
  },
  {
    id: 'src-mca-dir3kyc',
    name: 'MCA DIR-3 KYC instruction kit',
    sourceType: 'official MCA KYC source',
    tier: 'Tier 1',
    authorityLevel: 1,
    url: 'https://www.mca.gov.in/content/dam/mca/mca-forms-instruction-kit/Instruction%20Kit_Form%20No%20DIR%203%20KYC.pdf',
    jurisdiction: 'India',
    freshness: 'official MCA source',
    humanCheck: 'Confirm the filing window and whether the DIN holder is already active or deactivated due to non-filing.'
  },
  {
    id: 'src-mca-inc22',
    name: 'MCA INC-22 instruction kit',
    sourceType: 'official MCA registered-office source',
    tier: 'Tier 1',
    authorityLevel: 1,
    url: 'https://www.mca.gov.in/MCA21/dca/help/instructionkit/NCA/Form_INC-22_help.pdf',
    jurisdiction: 'India',
    freshness: 'official MCA source',
    humanCheck: 'Check the live registered-office proof requirements and any portal-specific attachment rules.'
  },
  {
    id: 'src-mca-inc20a',
    name: 'MCA INC-20A instruction kit',
    sourceType: 'official MCA commencement source',
    tier: 'Tier 1',
    authorityLevel: 1,
    url: 'https://www.mca.gov.in/content/dam/mca-aem-forms/instructionkits/Instruction%20Kit_INC-20A.pdf',
    jurisdiction: 'India',
    freshness: 'official MCA source',
    humanCheck: 'Confirm share-subscription proof, office status, and filing deadline before commencement.'
  },
  {
    id: 'src-cca-dsc',
    name: 'Controller of Certifying Authorities - DSC',
    sourceType: 'official certifying-authority source',
    tier: 'Tier 1',
    authorityLevel: 1,
    url: 'https://cca.gov.in/index.php/digital_signature_certificate.html',
    jurisdiction: 'India',
    freshness: 'official CCA source',
    humanCheck: 'Confirm the DSC class, PAN mapping, and MCA compatibility before purchase or renewal.'
  },
  {
    id: 'src-gst',
    name: 'GST Portal',
    sourceType: 'official GST source',
    tier: 'Tier 1',
    authorityLevel: 1,
    url: 'https://www.gst.gov.in/',
    jurisdiction: 'India',
    freshness: 'official portal',
    humanCheck: 'Check threshold position, place-of-business evidence, and authorized signatory details before filing.'
  },
  {
    id: 'src-udyam',
    name: 'Udyam Registration',
    sourceType: 'official MSME source',
    tier: 'Tier 1',
    authorityLevel: 1,
    url: 'https://www.udyamregistration.gov.in/UdyamRegistration.aspx',
    jurisdiction: 'India',
    freshness: 'official portal',
    humanCheck: 'Confirm Aadhaar, PAN, and GST-linked enterprise details before applying.'
  },
  {
    id: 'src-epfo',
    name: 'EPFO employer portal',
    sourceType: 'official payroll-law source',
    tier: 'Tier 1',
    authorityLevel: 1,
    url: 'https://unifiedportal-emp.epfindia.gov.in/',
    jurisdiction: 'India',
    freshness: 'official portal',
    humanCheck: 'Check employee-count triggers and payroll-go-live timing before registration.'
  },
  {
    id: 'src-esic',
    name: 'ESIC portal',
    sourceType: 'official payroll-law source',
    tier: 'Tier 1',
    authorityLevel: 1,
    url: 'https://gateway.esic.gov.in/web/guest/home',
    jurisdiction: 'India',
    freshness: 'official portal',
    humanCheck: 'Check wage thresholds, establishment coverage, and location facts before registration.'
  },
  {
    id: 'src-income-tax',
    name: 'Income Tax portal',
    sourceType: 'official tax source',
    tier: 'Tier 1',
    authorityLevel: 1,
    url: 'https://www.incometax.gov.in/iec/foportal/',
    jurisdiction: 'India',
    freshness: 'official portal',
    humanCheck: 'Confirm PAN, TAN, authorized-user setup, and tax-profile activation after incorporation.'
  }
];

const defaultPlaybook = {
  id: 'launch-playbook',
  name: 'Company launch playbook',
  rules: []
};

module.exports = {
  defaultPlaybook,
  platformCatalog,
  seedSources: [...seedSources, ...Object.values(officialSectorSources)],
  workflowTemplates
};
