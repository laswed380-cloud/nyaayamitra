const assert = require('node:assert/strict');
const path = require('node:path');

const root = path.join(__dirname, '..');
const port = 4335;
const baseUrl = `http://127.0.0.1:${port}`;
const testDataDir = path.join(root, '.launchpad', 'test-db');
process.env.LEXINDIA_DATA_DIR = testDataDir;

const { createServer } = require('../server/index');

async function main() {
  const server = createServer();

  try {
    await listen(server);
    await waitForServer();

    // ─── Health ─────────────────────────────────────
    const health = await getJson('/api/health');
    assert.equal(health.ok, true);
    assert.equal(health.app, 'NyaayaMitra Launchpad');

    // ─── Home page ──────────────────────────────────
    const home = await fetch(`${baseUrl}/`);
    assert.ok(home.ok, `Home page returned ${home.status}`);
    assert.match(await home.text(), /NyaayaMitra/);

    // ─── Bootstrap ──────────────────────────────────
    const bootstrap = await getJson('/api/bootstrap');
    assert.equal(bootstrap.meta.app, 'NyaayaMitra Launchpad');
    assert.ok(bootstrap.matters.length >= 3);
    assert.ok(bootstrap.engines.length >= 10);
    assert.ok(bootstrap.connectors.length >= 3);
    assert.ok(bootstrap.library.sectors.length >= 8);
    assert.ok(bootstrap.library.packages.length >= 8);
    assert.ok(bootstrap.library.dimensions.length >= 8);
    assert.ok(bootstrap.submissions.length >= 2);

    // ─── Library ────────────────────────────────────
    const library = await getJson('/api/library');
    assert.ok(library.library.sources.length >= 10);

    // ─── Concierge (profile extraction — reply may be empty since AI generates it) ──
    const concierge = await postJson('/api/chat/concierge', {
      message: 'I am opening a restaurant in Bengaluru and need GST, FSSAI, fire and labour compliances.'
    });
    // Profile extraction still works regardless of AI
    assert.ok(concierge.result.suggestedActions.length >= 1);
    assert.equal(concierge.result.autoRun, true);
    assert.equal(concierge.result.collectedProfile.sectorId, 'restaurant');
    assert.equal(concierge.result.collectedProfile.city, 'Bengaluru');

    // ─── Clarification detection ────────────────────
    const clarifier = await postJson('/api/chat/concierge', {
      message: 'I want to update company name and objects.'
    });
    assert.ok(clarifier.result.clarificationPrompts.length >= 2);
    assert.equal(clarifier.result.autoRun, false);
    assert.ok(clarifier.result.clarificationPrompts.some((item) => item.id === 'identifierType'));

    // ─── Identifier flow ────────────────────────────
    const identifierFlow = await postJson('/api/chat/concierge', {
      message: 'Use CIN U12345KA2026PTC123456 for the company and help with GST and trade licence.'
    });
    assert.ok(identifierFlow.result.quickFacts.some((item) => /CIN/i.test(item)));
    assert.equal(identifierFlow.result.autoRun, true);
    assert.ok(identifierFlow.result.quickFacts.some((item) => /Karnataka|State/i.test(item)));
    assert.equal(identifierFlow.result.suggestedActions[0].view, 'government-lookup');
    assert.equal(identifierFlow.result.collectedProfile.businessName, '');
    assert.ok(!identifierFlow.result.suggestedActions.some((item) => item.view === 'launch'));

    // ─── Entity snapshot ────────────────────────────
    const identifierSnapshot = await postJson('/api/entity-identifier/snapshot', {
      identifierType: 'cin',
      identifierValue: 'U47912KA2026OPC218651',
      message: 'I want to update company name and objects.'
    });
    assert.match(identifierSnapshot.result.summary, /OPC/i);
    assert.ok(identifierSnapshot.result.statusBoard.length >= 4);

    // ─── Government lookup ──────────────────────────
    const governmentLookup = await postJson('/api/government-lookup', {
      identifierType: 'cin',
      identifierValue: 'U47912KA2026OPC218651',
      message: 'Tell me the company name, directors, status, and pending compliances.'
    });
    assert.match(governmentLookup.result.summary, /CIN alone|official MCA records|Legal name/i);
    assert.ok(governmentLookup.result.officialChecks.length >= 5);
    assert.ok(governmentLookup.result.recordsStillNeeded.some((item) => /Director|partner|Legal company/i.test(item)));

    // ─── Chat respond (AI-powered — skip if no API key) ──
    const aiStatus = await getJson('/api/ai/status');
    if (aiStatus.configured) {
      const chatTurn = await postJson('/api/chat/respond', {
        message: 'CIN: U47912KA2026OPC218651'
      });
      assert.ok(chatTurn.result.reply.length > 20, 'AI reply should be substantive');
      assert.ok(Array.isArray(chatTurn.result.toolResults));
      assert.ok(chatTurn.result.toolResults.some((item) => item.kind === 'government-lookup'));

      const restaurantTurn = await postJson('/api/chat/respond', {
        message: 'I run a restaurant in Bengaluru and need GST, FSSAI, and fire compliance.'
      });
      assert.ok(restaurantTurn.result.reply.length > 20, 'AI reply should be substantive');
      assert.ok(restaurantTurn.result.toolResults.some((item) => item.kind === 'compliance-manager'));
    } else {
      console.log('  AI not configured — skipping chat/respond AI tests');
    }

    // ─── Submissions ────────────────────────────────
    const homeSubmissions = await getJson('/api/submissions');
    assert.ok(homeSubmissions.submissions.length >= 2);

    // ─── Launch autopilot ───────────────────────────
    const launch = await postJson('/api/launch/autopilot', {
      brief: 'Two founders need company incorporation, DIN and DSC, office proof, GST, bank setup, and post-incorporation compliance.'
    });
    assert.ok(launch.result.workstreams.length >= 4);
    assert.ok(launch.result.blockers.length >= 3);

    // ─── Company formation ──────────────────────────
    const incorporation = await postJson('/api/company-formation/plan', {
      entityType: 'Private Limited Company',
      state: 'Karnataka',
      founders: 2,
      employees: 5,
      officeMode: 'Rented office',
      wantsGst: true,
      wantsMsme: true
    });
    assert.ok(incorporation.result.formsInOrder.length >= 5);
    assert.ok(incorporation.result.documents.length >= 6);
    assert.ok(incorporation.result.emailDrafts.length >= 2);

    // ─── Director pack ──────────────────────────────
    const directors = await postJson('/api/director-pack', {
      directors: 2,
      newCompany: true,
      hasExistingDin: false,
      hasDsc: false
    });
    assert.ok(directors.result.documents.some((item) => /PAN/i.test(item)));
    assert.ok(directors.result.citations.length >= 3);

    // ─── Office proof ───────────────────────────────
    const office = await postJson('/api/office-proof/plan', {
      officeMode: 'Virtual office',
      state: 'Karnataka',
      city: 'Bengaluru',
      sharedOffice: true
    });
    assert.ok(office.result.documents.some((item) => /NOC|Provider/i.test(item)));
    assert.ok(office.result.serviceConnectors.length >= 1);

    // ─── Linked registrations ───────────────────────
    const registrations = await postJson('/api/linked-registrations/plan', {
      state: 'Karnataka',
      employees: 5,
      wantsGst: true,
      wantsMsme: true,
      payroll: true
    });
    assert.ok(registrations.result.formsInOrder.some((item) => /INC-20A/i.test(item)));
    assert.ok(registrations.result.actionRegister.length >= 5);

    // ─── Service connectors ─────────────────────────
    const connectors = await postJson('/api/service-connectors/match', {
      need: 'Need DSC, payroll support, CA review, and maybe virtual office support',
      dsc: true,
      payroll: true,
      virtualOffice: true
    });
    assert.ok(connectors.result.serviceConnectors.length >= 4);

    // ─── Compliance manager ─────────────────────────
    const compliance = await postJson('/api/compliance-manager/plan', {
      businessName: 'Test Kitchen',
      businessType: 'Restaurant / Cafe / Cloud Kitchen',
      stage: 'pre-launch',
      entityType: 'Private Limited Company',
      state: 'Karnataka',
      city: 'Bengaluru',
      employees: 18,
      branches: 1,
      incorporated: false,
      usesLpg: true,
      servesAlcohol: true,
      existingSituation: 'Opening a Bengaluru restaurant with dine-in and takeaway.'
    });
    assert.ok(compliance.result.actionPlan.length >= 6);
    assert.ok(compliance.result.packageCards.length >= 3);
    assert.ok(compliance.result.dimensionCoverage.length >= 8);
    assert.ok(compliance.result.criticalStops.some((item) => /food|FSSAI|school|clinical|factory|corporate/i.test(item)));
    assert.ok(compliance.result.applicationPackets.length >= 3);
    assert.ok(compliance.result.knowledgeLibrary.length >= 3);
    assert.ok(compliance.result.actionPlan.some((item) => /excise|alcohol/i.test(item.title)));

    // ─── Submission prepare ─────────────────────────
    const preparedSubmission = await postJson('/api/submissions/prepare', {
      matterId: 'mat-launch-registrations',
      businessName: 'Test Kitchen',
      title: 'GST registration packet',
      authority: 'GST',
      portalName: 'GST portal',
      portalUrl: 'https://www.gst.gov.in/',
      forms: 'GST REG-01, Authorized-signatory checklist',
      documentsRequired: 'PAN and incorporation proof, principal place proof, bank details',
      evidenceChecklist: 'Application PDF, ARN / acknowledgement, registration certificate'
    });
    assert.equal(preparedSubmission.result.submission.authority, 'GST');
    assert.ok(preparedSubmission.result.packetStages.length >= 5);

    // ─── Submission update ──────────────────────────
    const updatedSubmission = await patchJson(`/api/submissions/${preparedSubmission.result.submission.id}`, {
      status: 'Submitted',
      reviewStatus: 'Submission confirmed',
      referenceNumber: 'ARN-12345',
      note: 'Reference saved and follow-up set.'
    });
    assert.equal(updatedSubmission.submission.referenceNumber, 'ARN-12345');
    assert.equal(updatedSubmission.submission.status, 'Submitted');

    // ─── Workflow start ─────────────────────────────
    const workflow = await postJson('/api/workflows/start', {
      templateId: 'incorporation-launch',
      matterId: 'mat-incorporation'
    });
    assert.equal(workflow.run.status, 'Started');
    assert.ok(workflow.run.steps.length >= 4);

    // ─── Export ─────────────────────────────────────
    const saved = await postJson('/api/exports', {
      title: 'Standalone launchpad export',
      type: 'launch-note',
      matterId: 'mat-incorporation',
      payload: { ok: true }
    });
    assert.equal(saved.export.humanReviewRequired, true);

    console.log('All NyaayaMitra Launchpad smoke tests passed.');
  } finally {
    server.close();
  }
}

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolve);
  });
}

async function waitForServer() {
  const started = Date.now();
  while (Date.now() - started < 6000) {
    try {
      await getJson('/api/health');
      return;
    } catch (_error) {
      await delay(120);
    }
  }
  throw new Error('Server did not start within 6 seconds.');
}

async function getJson(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`);
  assert.ok(response.ok, `${pathname} returned ${response.status}`);
  return response.json();
}

async function postJson(pathname, body) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  assert.ok(response.ok, `${pathname} returned ${response.status}`);
  return response.json();
}

async function patchJson(pathname, body) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  assert.ok(response.ok, `${pathname} returned ${response.status}`);
  return response.json();
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
