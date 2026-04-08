const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const {
  defaultPlaybook,
  platformCatalog,
  seedSources,
  workflowTemplates
} = require('../domain/catalog');

const dataDir = process.env.LEXINDIA_DATA_DIR || path.join(__dirname, '..', '..', '.launchpad');
const dbPath = path.join(dataDir, 'db.json');

function nowIso() {
  return new Date().toISOString();
}

function addDays(isoDate, days) {
  const date = new Date(isoDate);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function addHours(isoDate, hours) {
  const date = new Date(isoDate);
  date.setHours(date.getHours() + hours);
  return date.toISOString();
}

function createId(prefix) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function createSeedStore() {
  const now = nowIso();

  return {
    meta: {
      app: 'NyaayaMitra Launchpad',
      version: 1,
      createdAt: now,
      updatedAt: now,
      riskFrame: platformCatalog.product.riskFrame
    },
    catalog: platformCatalog,
    organization: {
      id: 'org-launchpad-demo',
      name: 'NyaayaMitra Launchpad Demo Workspace',
      region: 'India',
      dataResidency: 'Operator-chosen storage',
      reviewPolicy: 'Founder plus CA / CS / legal review required before portal submission, bank use, or provider handoff.'
    },
    users: [
      {
        id: 'usr-founder',
        name: 'Founder',
        role: 'Founder',
        team: 'Founding team',
        permissions: ['matter:admin', 'export:approve', 'provider:approve']
      },
      {
        id: 'usr-cacs',
        name: 'CA / CS reviewer',
        role: 'CA / CS',
        team: 'Advisory',
        permissions: ['filing:review', 'workflow:review', 'compliance:review']
      },
      {
        id: 'usr-ops',
        name: 'Launch operator',
        role: 'Operations',
        team: 'Operations',
        permissions: ['evidence:upload', 'task:manage', 'workflow:start']
      }
    ],
    matters: [
      {
        id: 'mat-incorporation',
        title: 'Private limited incorporation - Bengaluru software venture',
        type: 'Incorporation Runbook',
        ownerId: 'usr-founder',
        counterparty: 'Founders and advisors',
        status: 'Planning',
        risk: 'Medium',
        riskScore: 54,
        linkedObligations: ['Freeze name and objects', 'Collect office proof', 'Prepare signatory pack'],
        linkedFilings: ['SPICe+', 'AGILE-PRO-S'],
        linkedTenders: [],
        linkedPrivacyIncidents: [],
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'mat-director-pack',
        title: 'Director, DIN, DSC, and KYC readiness',
        type: 'Director Pack',
        ownerId: 'usr-ops',
        counterparty: 'Founders',
        status: 'Documents pending',
        risk: 'High',
        riskScore: 73,
        linkedObligations: ['Confirm DIN route', 'Collect PAN/address proof', 'Arrange DSC'],
        linkedFilings: ['DIR path review'],
        linkedTenders: [],
        linkedPrivacyIncidents: [],
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'mat-launch-registrations',
        title: 'Post-incorporation registrations and first-board actions',
        type: 'Launch Compliance',
        ownerId: 'usr-cacs',
        counterparty: 'Bank, GST, Udyam, payroll',
        status: 'Queued',
        risk: 'High',
        riskScore: 79,
        linkedObligations: ['Bank opening', 'GST / Udyam path', 'First auditor', 'INC-20A'],
        linkedFilings: ['GST', 'Udyam', 'INC-20A'],
        linkedTenders: [],
        linkedPrivacyIncidents: [],
        createdAt: now,
        updatedAt: now
      }
    ],
    tasks: [
      {
        id: 'tsk-freeze-facts',
        title: 'Freeze name, object clause, capital, and shareholding facts',
        module: 'incorporation',
        matterId: 'mat-incorporation',
        assigneeId: 'usr-founder',
        dueAt: addHours(now, 18),
        priority: 'High',
        status: 'Open'
      },
      {
        id: 'tsk-director-pack',
        title: 'Collect PAN, address proof, photos, and signatory details',
        module: 'directors',
        matterId: 'mat-director-pack',
        assigneeId: 'usr-ops',
        dueAt: addHours(now, 24),
        priority: 'High',
        status: 'Waiting on founders'
      },
      {
        id: 'tsk-office-proof',
        title: 'Confirm registered office route and get NOC plus utility proof',
        module: 'office',
        matterId: 'mat-incorporation',
        assigneeId: 'usr-ops',
        dueAt: addHours(now, 30),
        priority: 'High',
        status: 'Open'
      },
      {
        id: 'tsk-bank-gst',
        title: 'Prepare post-incorporation bank and GST / Udyam pack',
        module: 'registrations',
        matterId: 'mat-launch-registrations',
        assigneeId: 'usr-cacs',
        dueAt: addDays(now, 3),
        priority: 'Medium',
        status: 'Queued'
      }
    ],
    documents: [
      {
        id: 'doc-founder-facts',
        matterId: 'mat-incorporation',
        title: 'Founder facts sheet',
        type: 'Facts Pack',
        status: 'Draft',
        version: 'v1',
        source: 'Workspace',
        createdAt: now
      },
      {
        id: 'doc-office-pack',
        matterId: 'mat-incorporation',
        title: 'Registered office evidence checklist',
        type: 'Address Pack',
        status: 'Requested',
        version: 'v1',
        source: 'Workspace',
        createdAt: now
      }
    ],
    activities: [
      {
        id: 'act-seed-001',
        matterId: 'mat-incorporation',
        actor: 'System',
        message: 'Launch workspace created for incorporation planning.',
        createdAt: now
      },
      {
        id: 'act-seed-002',
        matterId: 'mat-director-pack',
        actor: 'System',
        message: 'Director and signatory evidence matter opened.',
        createdAt: now
      }
    ],
    sources: seedSources,
    playbooks: [defaultPlaybook],
    workflowTemplates,
    complianceItems: [
      {
        id: 'cmp-spice-review',
        module: 'incorporation',
        title: 'Review SPICe+ and linked forms before submission',
        authority: 'MCA',
        cadence: 'Event-driven',
        ownerId: 'usr-cacs',
        status: 'Open',
        dueAt: addDays(now, 2),
        evidence: ['approved facts sheet', 'director pack', 'office pack', 'review note']
      },
      {
        id: 'cmp-first-auditor',
        module: 'registrations',
        title: 'Prepare first auditor appointment pack',
        authority: 'MCA',
        cadence: 'Post-incorporation',
        ownerId: 'usr-cacs',
        status: 'Queued',
        dueAt: addDays(now, 10),
        evidence: ['auditor consent', 'eligibility certificate', 'board or sole director note']
      },
      {
        id: 'cmp-inc20a',
        module: 'registrations',
        title: 'Track INC-20A commencement proof',
        authority: 'MCA',
        cadence: 'Post-incorporation',
        ownerId: 'usr-founder',
        status: 'Queued',
        dueAt: addDays(now, 25),
        evidence: ['bank proof', 'office proof', 'SRN', 'submission PDF']
      }
    ],
    connectors: [
      {
        id: 'con-dsc',
        name: 'DSC issuance support',
        type: 'Signature and certifying authority',
        status: 'Needs provider choice',
        purpose: 'Issue or renew DSC after PAN/name/mobile/email mapping is verified.',
        ownerId: 'usr-founder'
      },
      {
        id: 'con-office',
        name: 'Registered office support',
        type: 'Address service',
        status: 'Needs route decision',
        purpose: 'Provide address proof, NOC, and continuing documentary support where required.',
        ownerId: 'usr-founder'
      },
      {
        id: 'con-cacs',
        name: 'CA / CS filing support',
        type: 'Professional advisor',
        status: 'Needed',
        purpose: 'Review forms, first board, auditor, and post-incorporation actions before filing.',
        ownerId: 'usr-cacs'
      },
      {
        id: 'con-bank',
        name: 'Bank onboarding pack',
        type: 'Bank and treasury',
        status: 'Queued',
        purpose: 'Prepare account-opening resolution, office proof, and signatory trail.',
        ownerId: 'usr-ops'
      }
    ],
    submissions: createSeedSubmissions(now),
    exports: []
  };
}

function ensureStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dbPath)) {
    writeStore(createSeedStore());
  }
}

function readStore() {
  ensureStore();
  const store = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  return migrateStore(store);
}

function writeStore(store) {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const nextStore = {
    ...store,
    meta: {
      ...store.meta,
      updatedAt: nowIso()
    }
  };
  const tmpPath = `${dbPath}.tmp`;
  fs.writeFileSync(tmpPath, `${JSON.stringify(nextStore, null, 2)}\n`, 'utf8');
  fs.renameSync(tmpPath, dbPath);
}

function mutateStore(mutator) {
  const store = readStore();
  const result = mutator(store);
  writeStore(store);
  return result;
}

function migrateStore(store) {
  let changed = false;

  if (
    !store.catalog ||
    store.catalog.product?.name !== platformCatalog.product.name ||
    !Array.isArray(store.catalog.engines) ||
    store.catalog.engines.length !== platformCatalog.engines.length
  ) {
    store.catalog = platformCatalog;
    changed = true;
  }

  if (!Array.isArray(store.sources)) {
    store.sources = [];
    changed = true;
  }
  for (const source of seedSources) {
    const existingIndex = store.sources.findIndex((item) => item.id === source.id);
    if (existingIndex === -1) {
      store.sources.push(source);
      changed = true;
    } else {
      const current = store.sources[existingIndex];
      if (current.url !== source.url || current.name !== source.name || current.humanCheck !== source.humanCheck) {
        store.sources[existingIndex] = { ...current, ...source };
        changed = true;
      }
    }
  }

  if (!Array.isArray(store.workflowTemplates) || store.workflowTemplates.length !== workflowTemplates.length) {
    store.workflowTemplates = workflowTemplates;
    changed = true;
  }

  if (!Array.isArray(store.playbooks) || !store.playbooks.length) {
    store.playbooks = [defaultPlaybook];
    changed = true;
  }

  if (!Array.isArray(store.connectors)) {
    store.connectors = [];
    changed = true;
  }

  if (!Array.isArray(store.submissions)) {
    store.submissions = [];
    changed = true;
  }

  if (!store.submissions.length) {
    store.submissions = createSeedSubmissions(nowIso());
    changed = true;
  }

  if (changed) {
    writeStore(store);
  }

  return store;
}

function recordActivity(store, { matterId, actor = 'System', message }) {
  const activity = {
    id: createId('act'),
    matterId: matterId || null,
    actor,
    message,
    createdAt: nowIso()
  };
  store.activities.unshift(activity);
  return activity;
}

function createMatter(store, input) {
  const matter = {
    id: createId('mat'),
    title: cleanString(input.title) || 'Untitled matter',
    type: cleanString(input.type) || 'Launch matter',
    ownerId: cleanString(input.ownerId) || 'usr-founder',
    counterparty: cleanString(input.counterparty) || 'Internal',
    status: cleanString(input.status) || 'Open',
    risk: cleanString(input.risk) || 'Unscored',
    riskScore: Number.isFinite(Number(input.riskScore)) ? Number(input.riskScore) : 0,
    linkedObligations: Array.isArray(input.linkedObligations) ? input.linkedObligations : [],
    linkedFilings: Array.isArray(input.linkedFilings) ? input.linkedFilings : [],
    linkedTenders: [],
    linkedPrivacyIncidents: [],
    createdAt: nowIso(),
    updatedAt: nowIso()
  };

  store.matters.unshift(matter);
  recordActivity(store, {
    matterId: matter.id,
    actor: 'System',
    message: `Matter opened: ${matter.title}.`
  });
  return matter;
}

function createTask(store, input) {
  const task = {
    id: createId('tsk'),
    title: cleanString(input.title) || 'Untitled task',
    module: cleanString(input.module) || 'launch',
    matterId: cleanString(input.matterId) || null,
    assigneeId: cleanString(input.assigneeId) || 'usr-founder',
    dueAt: cleanString(input.dueAt) || addDays(nowIso(), 3),
    priority: cleanString(input.priority) || 'Medium',
    status: cleanString(input.status) || 'Open'
  };

  store.tasks.unshift(task);
  recordActivity(store, {
    matterId: task.matterId,
    actor: 'System',
    message: `Task created: ${task.title}.`
  });
  return task;
}

function createExport(store, input) {
  const exportRecord = {
    id: createId('exp'),
    matterId: cleanString(input.matterId) || null,
    title: cleanString(input.title) || 'Generated export',
    type: cleanString(input.type) || 'launch-note',
    status: 'Generated - review required',
    humanReviewRequired: true,
    payload: input.payload || {},
    createdAt: nowIso()
  };

  store.exports.unshift(exportRecord);
  recordActivity(store, {
    matterId: exportRecord.matterId,
    actor: 'System',
    message: `Export generated and marked for human review: ${exportRecord.title}.`
  });
  return exportRecord;
}

function createSubmission(store, input) {
  const now = nowIso();
  const dueAt = cleanString(input.dueAt) || addDays(now, 5);
  const followUpAt = cleanString(input.followUpAt) || addDays(dueAt, 2);
  const submission = {
    id: createId('sub'),
    matterId: cleanString(input.matterId) || null,
    title: cleanString(input.title) || 'Untitled submission packet',
    authority: cleanString(input.authority) || 'Authority review',
    portalName: cleanString(input.portalName) || 'Portal to be confirmed',
    portalUrl: cleanString(input.portalUrl) || '',
    status: cleanString(input.status) || 'Drafting packet',
    reviewStatus: cleanString(input.reviewStatus) || 'Pending internal review',
    dueAt,
    followUpAt,
    referenceNumber: cleanString(input.referenceNumber) || '',
    businessName: cleanString(input.businessName) || 'Business name not set',
    forms: normalizeArray(input.forms),
    documentsRequired: normalizeArray(input.documentsRequired),
    evidenceChecklist: normalizeArray(input.evidenceChecklist),
    notes: normalizeArray(input.notes),
    createdAt: now,
    updatedAt: now
  };

  store.submissions.unshift(submission);
  recordActivity(store, {
    matterId: submission.matterId,
    actor: 'Submission desk',
    message: `Submission packet opened: ${submission.title}.`
  });
  return submission;
}

function updateSubmission(store, submissionId, input) {
  const submission = store.submissions.find((item) => item.id === submissionId);
  if (!submission) return null;

  const fields = ['title', 'authority', 'portalName', 'portalUrl', 'status', 'reviewStatus', 'dueAt', 'followUpAt', 'referenceNumber', 'businessName'];
  for (const field of fields) {
    const value = cleanString(input[field]);
    if (value) submission[field] = value;
  }

  if (Array.isArray(input.forms) || typeof input.forms === 'string') submission.forms = normalizeArray(input.forms);
  if (Array.isArray(input.documentsRequired) || typeof input.documentsRequired === 'string') submission.documentsRequired = normalizeArray(input.documentsRequired);
  if (Array.isArray(input.evidenceChecklist) || typeof input.evidenceChecklist === 'string') submission.evidenceChecklist = normalizeArray(input.evidenceChecklist);
  if (Array.isArray(input.notes) || typeof input.notes === 'string') submission.notes = normalizeArray(input.notes);
  if (cleanString(input.note)) submission.notes.unshift(cleanString(input.note));

  submission.updatedAt = nowIso();

  recordActivity(store, {
    matterId: submission.matterId,
    actor: 'Submission desk',
    message: `Submission updated: ${submission.title} -> ${submission.status}${submission.referenceNumber ? ` (${submission.referenceNumber})` : ''}.`
  });

  return submission;
}

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeArray(value) {
  if (Array.isArray(value)) {
    return value.map((item) => cleanString(item)).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(/\r?\n|,/)
      .map((item) => cleanString(item))
      .filter(Boolean);
  }
  return [];
}

function createSeedSubmissions(now) {
  return [
    {
      id: 'sub-gst-kickoff',
      matterId: 'mat-launch-registrations',
      title: 'GST registration packet',
      authority: 'GST',
      portalName: 'GST portal',
      portalUrl: 'https://www.gst.gov.in/',
      status: 'Drafting packet',
      reviewStatus: 'Founder and CA review pending',
      dueAt: addDays(now, 5),
      followUpAt: addDays(now, 7),
      referenceNumber: '',
      businessName: 'Demo workspace entity',
      forms: ['GST REG-01', 'Authorized-signatory checklist'],
      documentsRequired: ['PAN and incorporation proof', 'Principal place of business proof', 'Bank details', 'Authorized signatory pack'],
      evidenceChecklist: ['Application PDF', 'ARN / acknowledgement', 'Certificate', 'Profile screenshot'],
      notes: ['Confirm GST applicability and threshold before submit.'],
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'sub-fssai-prep',
      matterId: 'mat-launch-registrations',
      title: 'FSSAI / FoSCoS packet',
      authority: 'FSSAI',
      portalName: 'FoSCoS - FSSAI',
      portalUrl: 'https://foscos.fssai.gov.in/',
      status: 'Awaiting facts',
      reviewStatus: 'Operations review pending',
      dueAt: addDays(now, 4),
      followUpAt: addDays(now, 8),
      referenceNumber: '',
      businessName: 'Demo workspace entity',
      forms: ['FoSCoS registration / licence flow'],
      documentsRequired: ['Premises proof', 'Kitchen facts', 'Identity and entity proof', 'Food business category note'],
      evidenceChecklist: ['Application PDF', 'Registration / licence', 'Inspection or query replies'],
      notes: ['Use only after food-business category is frozen.'],
      createdAt: now,
      updatedAt: now
    }
  ];
}

module.exports = {
  createSubmission,
  createExport,
  createId,
  createMatter,
  createTask,
  ensureStore,
  mutateStore,
  nowIso,
  readStore,
  recordActivity,
  updateSubmission,
  writeStore
};
