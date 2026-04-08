const lastVerified = '2026-04-08';

function buildGovernmentLookupPlan(input = {}) {
  const identifierType = clean(input.identifierType);
  const identifierValue = clean(input.identifierValue).toUpperCase();
  const message = clean(input.message);
  const parsed = parseIdentifier(identifierType, identifierValue);
  const checks = buildOfficialChecks(parsed, message);

  return {
    title: parsed.identifierValue || 'Official-source lookup',
    summary: buildSummary(parsed),
    identity: {
      identifierType: parsed.identifierType,
      identifierValue: parsed.identifierValue,
      entityType: parsed.entityType,
      state: parsed.state,
      incorporationYear: parsed.incorporationYear,
      listingStatus: parsed.listingStatus
    },
    whatThisIdentifierCanShow: buildIdentifierEvidence(parsed),
    recordsStillNeeded: buildRecordsStillNeeded(parsed),
    officialChecks: checks,
    nextMoves: buildNextMoves(parsed, message),
    truthRules: [
      'Do not treat inferred data as verified company data.',
      'Do not mark a compliance as complete without a certificate, filing acknowledgement, or portal proof.',
      'Do not state that licences are active or expired unless the relevant portal result or uploaded document is in the file.'
    ],
    citations: checks.map((item) => ({
      name: item.name,
      url: item.url,
      relevance: item.fields,
      lastVerified
    }))
  };
}

function buildSummary(parsed) {
  if (parsed.identifierType === 'cin') {
    return `From this CIN alone, I can safely read only the structure: ${parsed.listingStatus || 'company'} entity, ${parsed.state || 'state not decoded'}, ${parsed.incorporationYear || 'year not decoded'}, ${parsed.entityType || 'entity type not decoded'}. Legal name, directors, registered office, exact incorporation date, object clause, and filing position need official MCA records.`;
  }
  if (parsed.identifierType === 'gstin') {
    return 'A GSTIN can anchor GST taxpayer verification, but it does not by itself prove MCA directors, object clause, or non-GST licences.';
  }
  if (parsed.identifierType === 'udyam') {
    return 'A Udyam number can verify MSME registration on the official portal, but it does not replace company master data, GST profile, labour registrations, or sector licences.';
  }
  if (parsed.identifierType === 'llpin') {
    return 'An LLPIN can anchor LLP master-data checks, but partner names, filing history, and business activity still need official records.';
  }
  if (parsed.identifierType === 'fssai') {
    return 'An FSSAI licence number can anchor food-licence validation, but it does not prove company master data, GST, labour, fire, or local trade approvals.';
  }
  return 'The identifier is not enough on its own. I need the correct official portal for each compliance layer before I can say what is truly complete or pending.';
}

function buildIdentifierEvidence(parsed) {
  const items = [];

  if (parsed.identifierType === 'cin') {
    items.push(`The first character suggests ${parsed.listingStatus || 'listing status'} status.`);
    if (parsed.state) items.push(`The state code points to ${parsed.state}.`);
    if (parsed.incorporationYear) items.push(`The year block points to ${parsed.incorporationYear}.`);
    if (parsed.entityType) items.push(`The company-type code points to ${parsed.entityType}.`);
  }

  if (parsed.identifierType === 'gstin') {
    items.push('GST registration can be checked on the GST portal using the GSTIN.');
  }

  if (parsed.identifierType === 'udyam') {
    items.push('MSME / Udyam registration can be checked on the official Udyam verification route.');
  }

  if (parsed.identifierType === 'fssai') {
    items.push('Food-licence status can be checked on the FoSCoS / FSSAI portal with the licence number.');
  }

  return items;
}

function buildRecordsStillNeeded(parsed) {
  const records = [
    'Legal company or LLP name from official master data',
    'Exact incorporation date / current status from official master data',
    'Registered office from official master data or certificate',
    'Objects or business activity from MOA / constitutional documents or GST profile',
    'Actual licences and filings from portal results or uploaded certificates'
  ];

  if (parsed.identifierType === 'cin' || parsed.identifierType === 'llpin') {
    records.unshift('Director or partner names from official master data / filed records');
  }

  return records;
}

function buildOfficialChecks(parsed, message) {
  const lookupChecks = [];

  if (parsed.identifierType === 'cin' || parsed.identifierType === 'llpin') {
    lookupChecks.push(check(
      'MCA master data',
      'https://www.mca.gov.in/',
      'Legal name, status, incorporation details, registered office, and director / partner baseline',
      'Public master-data route on MCA services',
      'connector needed'
    ));
    lookupChecks.push(check(
      'MCA filed records / constitutional documents',
      'https://www.mca.gov.in/',
      'MOA, AOA, object clause, corporate changes, and deeper filing trail',
      'Often needs authenticated or paid document access',
      'login or document access needed'
    ));
  }

  lookupChecks.push(check(
    'GST taxpayer search',
    'https://www.gst.gov.in/',
    'GST registration status, legal name, trade name, constitution, principal place, and return profile',
    parsed.identifierType === 'gstin' ? 'GSTIN present; public taxpayer check can be attempted' : 'Needs GSTIN',
    parsed.identifierType === 'gstin' ? 'identifier ready' : 'missing GSTIN'
  ));

  lookupChecks.push(check(
    'Udyam verification',
    'https://udyamregistration.gov.in/verifyudyambarcode.aspx?verifyudrn=oGQE3uTlfnLTelbL3EbCng%3D%3D',
    'MSME / Udyam registration verification',
    parsed.identifierType === 'udyam' ? 'Udyam number present; official verification route available' : 'Needs Udyam number and captcha',
    parsed.identifierType === 'udyam' ? 'identifier ready' : 'missing Udyam number'
  ));

  lookupChecks.push(check(
    'EPFO employer search',
    'https://unifiedportal-emp.epfindia.gov.in/publicPortal/no-auth/misReport/home/loadEstSearchHome',
    'Establishment details and employer search',
    'Usually needs establishment name or code and captcha',
    'captcha or establishment code needed'
  ));

  lookupChecks.push(check(
    'ESIC employer search',
    'https://portal.esic.gov.in/EmployerSearch',
    'Employer-code and employer-search visibility',
    'Usually needs employer code or employer name',
    'employer code or exact name needed'
  ));

  lookupChecks.push(check(
    'Sector and local approvals',
    /karnataka|bengaluru|bangalore|mysuru|mangaluru/i.test(message) || parsed.state === 'Karnataka'
      ? 'https://labouronline.karnataka.gov.in/'
      : 'https://www.nsws.gov.in/',
    /karnataka|bengaluru|bangalore|mysuru|mangaluru/i.test(message) || parsed.state === 'Karnataka'
      ? 'Karnataka labour, trade, factory, fire, excise, and sector workflows'
      : 'Central and state approval discovery',
    'Needs actual business activity and location',
    'business activity needed'
  ));

  return lookupChecks;
}

function buildNextMoves(parsed, message) {
  const steps = [];

  if (parsed.identifierType === 'cin' || parsed.identifierType === 'llpin') {
    steps.push('Open the MCA master-data route to confirm legal name, current status, exact incorporation date, and director / partner baseline.');
    steps.push('If you need objects or business activity, pull the MOA / constitutional records or upload them here.');
  }

  if (!/restaurant|food|hospital|clinic|software|it|factory|manufact|retail|school|college|university/i.test(message)) {
    steps.push('Tell me what the business actually does so I can map sector licences like FSSAI, fire, factory, clinical, excise, or pollution approvals.');
  }

  steps.push('Once the official identifiers and certificates are in hand, I can check what is missing, overdue, renewable, or still unproven.');
  return steps;
}

function parseIdentifier(type, value) {
  const parsed = {
    identifierType: type,
    identifierValue: value
  };

  if (type === 'cin' && /^[A-Z][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(value)) {
    parsed.entityType = companyTypeFromCode(value.slice(12, 15));
    parsed.state = stateFromCode(value.slice(6, 8));
    parsed.incorporationYear = value.slice(8, 12);
    parsed.listingStatus = value.startsWith('U') ? 'Unlisted' : value.startsWith('L') ? 'Listed' : 'Company';
  }

  if (type === 'llpin') {
    parsed.entityType = 'LLP';
  }

  return parsed;
}

function check(name, url, fields, access, status) {
  return { name, url, fields, access, status, lastVerified };
}

function companyTypeFromCode(code) {
  const map = {
    OPC: 'OPC',
    PTC: 'Private Limited Company',
    PLC: 'Public Limited Company',
    ULT: 'Unlimited company',
    GOI: 'Government company'
  };
  return map[String(code || '').toUpperCase()] || String(code || '').toUpperCase() || 'Company';
}

function stateFromCode(code) {
  const map = {
    KA: 'Karnataka',
    MH: 'Maharashtra',
    TN: 'Tamil Nadu',
    TS: 'Telangana',
    DL: 'Delhi',
    GJ: 'Gujarat',
    HR: 'Haryana'
  };
  return map[String(code || '').toUpperCase()] || String(code || '').toUpperCase() || 'Unknown';
}

function clean(value) {
  return String(value || '').trim();
}

module.exports = {
  buildGovernmentLookupPlan
};
