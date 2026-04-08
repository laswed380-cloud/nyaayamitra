const { buildWorkflowRun } = require('./domain/analyzers');
const {
  buildEntityIdentifierSnapshot,
  buildDirectorCompliancePack,
  buildIncorporationRunbook,
  buildLinkedRegistrationsPlan,
  buildRegisteredOfficePlan,
  recommendServiceConnectors,
  runBusinessAutopilot
} = require('./domain/businessAdvisors');
const { buildGovernmentLookupPlan } = require('./domain/governmentLookup');
const {
  buildComplianceManagerPlan,
  buildLibraryPayload,
  listSectorProfiles
} = require('./domain/sectorCompliance');
const {
  createSubmission,
  createExport,
  createMatter,
  createTask,
  mutateStore,
  readStore,
  recordActivity
} = require('./data/store');
const { updateSubmission } = require('./data/store');
const { askAnthropic, getAiStatus } = require('./services/anthropic');
const { buildSubmissionPacket } = require('./domain/submissionDesk');
const { buildChatConciergeResponse } = require('./domain/chatConcierge');
const { buildChatTurn } = require('./domain/chatTurn');
const { parseRequestUrl, readJsonBody, sendError, sendJson, sendNoContent } = require('./utils/http');

async function handleApi(req, res) {
  if (req.method === 'OPTIONS') return sendNoContent(res);

  const url = parseRequestUrl(req);
  const routePath = url.pathname;

  try {
    if (req.method === 'GET' && routePath === '/api/health') {
      return sendJson(res, 200, { ok: true, app: 'NyaayaMitra Launchpad', time: new Date().toISOString() });
    }

    if (req.method === 'GET' && routePath === '/api/bootstrap') {
      const store = readStore();
      return sendJson(res, 200, createBootstrapPayload(store));
    }

    if (req.method === 'GET' && routePath === '/api/catalog') {
      const store = readStore();
      return sendJson(res, 200, {
        catalog: store.catalog,
        workflowTemplates: store.workflowTemplates,
        sourceHierarchy: store.catalog.sourceHierarchy,
        library: buildLibraryPayload()
      });
    }

    if (req.method === 'GET' && routePath === '/api/library') {
      return sendJson(res, 200, { library: buildLibraryPayload() });
    }

    if (req.method === 'GET' && routePath === '/api/sectors') {
      return sendJson(res, 200, { sectors: listSectorProfiles() });
    }

    if (req.method === 'GET' && routePath === '/api/ai/status') {
      return sendJson(res, 200, getAiStatus());
    }

    if (req.method === 'POST' && routePath === '/api/chat/concierge') {
      const body = await readJsonBody(req);
      const result = buildChatConciergeResponse(body, readStore());
      return sendJson(res, 200, { result });
    }

    if (req.method === 'POST' && routePath === '/api/chat/respond') {
      const body = await readJsonBody(req);
      const result = await buildChatTurn(body, readStore());
      return sendJson(res, 200, { result });
    }

    if (req.method === 'POST' && routePath === '/api/ai/ask') {
      const body = await readJsonBody(req);
      const result = await askAnthropic({
        prompt: body.prompt,
        system: body.system,
        maxTokens: body.maxTokens
      });
      saveAnalysisActivity(body.matterId, 'AI drafting layer', 'Anthropic draft generated.', result);
      return sendJson(res, 200, { result });
    }

    if (req.method === 'POST' && (routePath === '/api/autopilot' || routePath === '/api/launch/autopilot')) {
      const body = await readJsonBody(req);
      const result = runBusinessAutopilot(body);
      await attachOptionalAiDraft(body, result, 'company launch autopilot note');
      saveAnalysisActivity(body.matterId, 'Launch autopilot', 'Launch operating plan generated.', result);
      return sendJson(res, 200, { result });
    }

    if (req.method === 'POST' && routePath === '/api/company-formation/plan') {
      const body = await readJsonBody(req);
      const result = buildIncorporationRunbook(body);
      await attachOptionalAiDraft(body, result, 'incorporation runbook');
      saveAnalysisActivity(body.matterId, 'Incorporation runbook', 'Company incorporation plan generated.', result);
      return sendJson(res, 200, { result });
    }

    if (req.method === 'POST' && routePath === '/api/entity-identifier/snapshot') {
      const body = await readJsonBody(req);
      const result = buildEntityIdentifierSnapshot(body);
      saveAnalysisActivity(body.matterId, 'Business identifier snapshot', 'Identifier-based business snapshot generated.', result);
      return sendJson(res, 200, { result });
    }

    if (req.method === 'POST' && routePath === '/api/government-lookup') {
      const body = await readJsonBody(req);
      const result = buildGovernmentLookupPlan(body);
      saveAnalysisActivity(body.matterId, 'Government source lookup', 'Official-source lookup plan generated.', result);
      return sendJson(res, 200, { result });
    }

    if (req.method === 'POST' && routePath === '/api/director-pack') {
      const body = await readJsonBody(req);
      const result = buildDirectorCompliancePack(body);
      await attachOptionalAiDraft(body, result, 'director DIN DSC and KYC pack');
      saveAnalysisActivity(body.matterId, 'Director pack', 'Director readiness pack generated.', result);
      return sendJson(res, 200, { result });
    }

    if (req.method === 'POST' && routePath === '/api/office-proof/plan') {
      const body = await readJsonBody(req);
      const result = buildRegisteredOfficePlan(body);
      await attachOptionalAiDraft(body, result, 'registered office and address-proof plan');
      saveAnalysisActivity(body.matterId, 'Registered office engine', 'Registered office plan generated.', result);
      return sendJson(res, 200, { result });
    }

    if (req.method === 'POST' && routePath === '/api/linked-registrations/plan') {
      const body = await readJsonBody(req);
      const result = buildLinkedRegistrationsPlan(body);
      await attachOptionalAiDraft(body, result, 'linked registrations and post-incorporation roadmap');
      saveAnalysisActivity(body.matterId, 'Registrations engine', 'Linked registrations roadmap generated.', result);
      return sendJson(res, 200, { result });
    }

    if (req.method === 'POST' && routePath === '/api/service-connectors/match') {
      const body = await readJsonBody(req);
      const result = recommendServiceConnectors(body);
      saveAnalysisActivity(body.matterId, 'Connector planner', 'Service connector plan generated.', result);
      return sendJson(res, 200, { result });
    }

    if (req.method === 'POST' && (routePath === '/api/compliance-manager/plan' || routePath === '/api/sector-compliance/plan')) {
      const body = await readJsonBody(req);
      const result = buildComplianceManagerPlan(body);
      await attachOptionalAiDraft(body, result, 'sector-specific compliance manager plan');
      saveAnalysisActivity(body.matterId, 'Sector compliance manager', 'Sector compliance roadmap generated.', result);
      return sendJson(res, 200, { result });
    }

    if (req.method === 'GET' && routePath === '/api/service-connectors') {
      const store = readStore();
      return sendJson(res, 200, { connectors: store.connectors });
    }

    if (req.method === 'GET' && routePath === '/api/submissions') {
      return sendJson(res, 200, { submissions: readStore().submissions || [] });
    }

    if (req.method === 'POST' && routePath === '/api/submissions/prepare') {
      const body = await readJsonBody(req);
      const packet = buildSubmissionPacket(body);
      const submission = mutateStore((store) => createSubmission(store, {
        matterId: body.matterId,
        title: packet.title,
        authority: packet.authority,
        portalName: packet.portalName,
        portalUrl: packet.portalUrl,
        businessName: packet.businessName,
        forms: packet.forms,
        documentsRequired: packet.documentsRequired,
        evidenceChecklist: packet.evidenceChecklist,
        notes: packet.submissionChecklist,
        dueAt: body.dueAt,
        followUpAt: body.followUpAt
      }));
      return sendJson(res, 201, { result: { ...packet, submission } });
    }

    if (req.method === 'PATCH' && routePath.startsWith('/api/submissions/')) {
      const submissionId = decodeURIComponent(routePath.split('/').pop());
      const body = await readJsonBody(req);
      const submission = mutateStore((store) => updateSubmission(store, submissionId, body));
      if (!submission) return sendError(res, 404, 'Submission not found.');
      return sendJson(res, 200, { submission });
    }

    if (req.method === 'GET' && routePath === '/api/matters') {
      return sendJson(res, 200, { matters: readStore().matters });
    }

    if (req.method === 'POST' && routePath === '/api/matters') {
      const body = await readJsonBody(req);
      const matter = mutateStore((store) => createMatter(store, body));
      return sendJson(res, 201, { matter });
    }

    if (req.method === 'GET' && routePath.startsWith('/api/matters/')) {
      const matterId = decodeURIComponent(routePath.split('/').pop());
      const store = readStore();
      const matter = store.matters.find((item) => item.id === matterId);
      if (!matter) return sendError(res, 404, 'Matter not found.');
      return sendJson(res, 200, {
        matter,
        tasks: store.tasks.filter((item) => item.matterId === matterId),
        documents: store.documents.filter((item) => item.matterId === matterId),
        activities: store.activities.filter((item) => item.matterId === matterId),
        exports: store.exports.filter((item) => item.matterId === matterId)
      });
    }

    if (req.method === 'GET' && routePath === '/api/tasks') {
      return sendJson(res, 200, { tasks: readStore().tasks });
    }

    if (req.method === 'POST' && routePath === '/api/tasks') {
      const body = await readJsonBody(req);
      const task = mutateStore((store) => createTask(store, body));
      return sendJson(res, 201, { task });
    }

    if (req.method === 'GET' && routePath === '/api/sources') {
      const store = readStore();
      return sendJson(res, 200, { sources: store.sources, sourceTiers: store.catalog.sourceTiers });
    }

    if (req.method === 'GET' && routePath === '/api/workflows') {
      return sendJson(res, 200, { workflows: readStore().workflowTemplates });
    }

    if (req.method === 'POST' && routePath === '/api/workflows/start') {
      const body = await readJsonBody(req);
      const run = buildWorkflowRun(body);
      mutateStore((store) => {
        recordActivity(store, {
          matterId: run.matterId,
          actor: 'Workflow engine',
          message: `Workflow started: ${run.name}.`
        });
      });
      return sendJson(res, 201, { run });
    }

    if (req.method === 'GET' && routePath === '/api/exports') {
      return sendJson(res, 200, { exports: readStore().exports });
    }

    if (req.method === 'POST' && routePath === '/api/exports') {
      const body = await readJsonBody(req);
      const exportRecord = mutateStore((store) => createExport(store, body));
      return sendJson(res, 201, { export: exportRecord });
    }

    return sendError(res, 404, 'API route not found.');
  } catch (error) {
    return sendError(res, 500, 'API request failed.', error.message);
  }
}

function saveAnalysisActivity(matterId, actor, message, result) {
  if (!matterId) return;
  mutateStore((store) => {
    const matter = store.matters.find((item) => item.id === matterId);
    if (matter) {
      if (Number.isFinite(result.riskScore)) {
        matter.riskScore = result.riskScore;
        matter.risk = result.riskLabel || matter.risk;
      }
      if (Number.isFinite(result.readinessScore)) {
        matter.riskScore = Math.max(matter.riskScore || 0, 100 - Number(result.readinessScore));
        matter.risk = result.readinessScore >= 75 ? 'Low' : result.readinessScore >= 55 ? 'Medium' : 'High';
      }
      matter.updatedAt = new Date().toISOString();
    }
    recordActivity(store, { matterId, actor, message });
  });
}

async function attachOptionalAiDraft(body, result, purpose) {
  if (!(body.useAi === 'on' || body.useAi === true || body.useAi === 'true')) return;
  try {
    result.aiDraft = await askAnthropic({
      prompt: [
        `Purpose: ${purpose}`,
        'Use the structured NyaayaMitra Launchpad result below.',
        'Create a concise, founder-friendly action note.',
        'Do not invent legal thresholds, filing routes, or portal behavior.',
        'Mark anything that still needs CA / CS / legal or portal verification.',
        JSON.stringify(result, null, 2)
      ].join('\n')
    });
  } catch (error) {
    result.aiDraft = {
      error: error.message,
      humanReviewRequired: true
    };
  }
}

function createBootstrapPayload(store) {
  const upcomingTasks = [...store.tasks]
    .sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt))
    .slice(0, 8);
  const openCompliance = store.complianceItems.filter((item) => item.status !== 'Closed');
  const connectorGaps = store.connectors.filter((item) => /need|queued|select|decision/i.test(item.status));
  const blockers = store.tasks.filter((item) => item.priority === 'High').slice(0, 5);
  const openSubmissions = (store.submissions || []).filter((item) => item.status !== 'Complete' && item.status !== 'Closed');
  const library = buildLibraryPayload();

  return {
    meta: store.meta,
    organization: store.organization,
    users: store.users,
    dashboard: {
      counts: {
        matters: store.matters.length,
        tasks: store.tasks.length,
        blockers: blockers.length,
        sources: store.sources.length,
        workflows: store.workflowTemplates.length,
        connectorGaps: connectorGaps.length,
        exports: store.exports.length,
        sectors: library.sectors.length,
        packages: library.packages.length,
        dimensions: library.dimensions.length,
        submissions: (store.submissions || []).length
      },
      quickActions: [
        'Run sector compliance manager',
        'Prepare submission packet',
        'Run launch autopilot',
        'Create incorporation runbook',
        'Build director pack',
        'Plan office proof',
        'Sequence registrations',
        'Browse compliance library',
        'Save to evidence'
      ],
      blockers,
      upcomingTasks,
      openSubmissions: openSubmissions.slice(0, 6),
      complianceRiskAlerts: openCompliance,
      recentDocuments: store.documents.slice(0, 5),
      recentActivity: store.activities.slice(0, 8),
      connectorGaps
    },
    matters: store.matters,
    tasks: store.tasks,
    sources: store.sources,
    sourceHierarchy: store.catalog.sourceHierarchy,
    sourceTiers: store.catalog.sourceTiers,
    library: buildLibraryPayload(),
    sectors: listSectorProfiles(),
    ai: getAiStatus(),
    workflows: store.workflowTemplates,
    engines: store.catalog.engines,
    complianceItems: store.complianceItems,
    connectors: store.connectors,
    submissions: store.submissions || [],
    exports: store.exports
  };
}

module.exports = { handleApi };
