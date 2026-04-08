const officialSectorSources = {
  mca: source('src-mca-home', 'MCA portal', 'https://www.mca.gov.in/', 'Official company law portal for incorporation, annual filings, directors, and company master data.', 'India'),
  gst: source('src-gst-portal', 'GST portal', 'https://www.gst.gov.in/', 'Registration, returns, notices, and taxpayer profile management.', 'India'),
  incomeTax: source('src-income-tax', 'Income Tax portal', 'https://www.incometax.gov.in/iec/foportal/', 'PAN, TAN, income-tax, and authorized-user profile management.', 'India'),
  udyam: source('src-udyam', 'Udyam registration', 'https://udyamregistration.gov.in/Default.aspx', 'Official MSME registration portal.', 'India'),
  msmeSchemes: source('src-msme-schemes', 'MSME schemes library', 'https://msme.gov.in/e-book-schemes-msme', 'Official MSME schemes and support programs.', 'India'),
  epfo: source('src-epfo', 'EPFO employer portal', 'https://unifiedportal-emp.epfindia.gov.in/', 'Employer registration and provident-fund compliance.', 'India'),
  esic: source('src-esic', 'ESIC portal', 'https://gateway.esic.gov.in/web/guest/home', 'Employer registration and employee-state-insurance compliance.', 'India'),
  pt: source('src-karnataka-pt', 'Karnataka professional tax portal', 'https://pt.kar.nic.in/Login', 'Professional tax enrollment, registration, payment, and return workflow.', 'Karnataka'),
  karnatakaGst: source('src-karnataka-commercial-taxes', 'Karnataka Commercial Taxes Department', 'https://gst.karnataka.gov.in/Profession_tax.aspx', 'Karnataka profession-tax law and portal references.', 'Karnataka'),
  labour: source('src-karnataka-labour', 'Karnataka Labour online portal', 'https://labouronline.karnataka.gov.in/', 'Labour registrations, establishment workflows, and labour-law services.', 'Karnataka'),
  bbmpTrade: source('src-bbmp-trade', 'BBMP trade licence portal', 'https://trade.bbmpgov.in/Forms/frmRenewalTradeRegistration.aspx', 'Trade licence workflow for Bengaluru businesses under BBMP.', 'Bengaluru'),
  fssai: source('src-fssai-home', 'FSSAI', 'https://www.fssai.gov.in/', 'Food safety law, advisories, and business guidance.', 'India'),
  foscos: source('src-foscos', 'FoSCoS - FSSAI', 'https://foscos.fssai.gov.in/', 'Official food-business licensing and registration portal.', 'India'),
  fire: source('src-karnataka-fire', 'Karnataka Fire and Emergency Services', 'https://ksfes.karnataka.gov.in/', 'Fire NOC, clearance, renewal, and advisory services.', 'Karnataka'),
  peso: source('src-peso', 'PESO', 'https://www.peso.gov.in/en', 'Petroleum, explosives, and gas-cylinder regulatory authority.', 'India'),
  excise: source('src-karnataka-excise', 'Karnataka State Excise Department', 'https://stateexcise.karnataka.gov.in/', 'Official Karnataka state-excise department portal for liquor-related permissions and guidance.', 'Karnataka'),
  kspcb: source('src-kspcb', 'Karnataka State Pollution Control Board', 'https://kspcb.karnataka.gov.in/', 'Consent management, waste-management, and environmental approvals.', 'Karnataka'),
  kpme: source('src-kpme', 'Karnataka Private Medical Establishments', 'https://kpme.karnataka.gov.in/', 'KPME registration and license workflow for private medical establishments.', 'Karnataka'),
  schoolEducation: source('src-school-education', 'Karnataka School Education Department', 'https://schooleducation.karnataka.gov.in/', 'School-education department, circulars, school information, and forms.', 'Karnataka'),
  higherEducation: source('src-kshec', 'Karnataka State Higher Education Council', 'https://kshec.karnataka.gov.in/', 'Higher-education policy and institutional reference point in Karnataka.', 'Karnataka'),
  dte: source('src-dte-karnataka', 'Department of Technical Education, Karnataka', 'https://dtek.karnataka.gov.in/', 'Technical-education and institution-facing notices in Karnataka.', 'Karnataka'),
  ugc: source('src-ugc', 'University Grants Commission', 'https://www.ugc.gov.in/', 'Recognition, regulations, and higher-education institution status.', 'India'),
  aicte: source('src-aicte', 'AICTE', 'https://www.aicte.gov.in/', 'Approvals and compliance reference for technical institutions.', 'India'),
  bescom: source('src-bescom', 'BESCOM', 'https://www.bescom.karnataka.gov.in/', 'Electricity connection and commercial-power utility portal for Bengaluru areas.', 'Karnataka'),
  ccaDsc: source('src-cca-dsc', 'Controller of Certifying Authorities - DSC', 'https://cca.gov.in/index.php/digital_signature_certificate.html', 'Digital-signature-certificate basics and certifying-authority route.', 'India')
};

const sectorProfiles = [
  sector('restaurant', 'Restaurants, cafes, cloud kitchens, bakeries, and food counters', 'Food service', 'Food businesses usually need a food-safety path, trade-licence review, labour and tax setup, fire readiness, LPG or PESO review where relevant, and excise tracking if alcohol service is planned.', ['restaurant', 'cafe', 'bakery', 'cloud kitchen', 'food court', 'canteen', 'sweet shop'], ['food-and-hospitality', 'tax-and-ca', 'fire-and-safety', 'workforce-and-payroll']),
  sector('it-services', 'IT services, SaaS, software development, consulting, and BPO', 'Technology services', 'Technology businesses usually need GST and income-tax readiness, payroll and professional-tax setup, labour and data-governance review, and clean customer-contract and invoicing controls.', ['it company', 'software', 'saas', 'technology', 'consulting', 'services', 'bpo'], ['launch-and-corporate', 'tax-and-ca', 'workforce-and-payroll', 'data-and-governance']),
  sector('retail-shop', 'Retail shops, grocery, general trading, and showrooms', 'Retail and trading', 'Retail businesses often need trade-licence review, GST and invoicing, professional tax, labour registrations, and locality-specific safety or signage approvals.', ['retail', 'shop', 'grocery', 'trader', 'showroom', 'wholesale', 'general store'], ['tax-and-ca', 'trade-and-local', 'workforce-and-payroll']),
  sector('textile-garment', 'Textile units, garment factories, tailoring production, and apparel manufacturing', 'Textile and garment', 'Textile and garment units usually need manufacturing, labour, pollution, fire, payroll, and factory-process controls, plus buyer-facing tax and export readiness where relevant.', ['textile', 'garment', 'apparel', 'tailoring unit', 'manufacturing', 'knitting'], ['factory-and-environment', 'tax-and-ca', 'workforce-and-payroll', 'fire-and-safety']),
  sector('factory', 'General manufacturing factories, workshops, and industrial units', 'Manufacturing', 'Factories need a sharper sequence across labour, environmental, fire, utility, and tax controls, with equipment and plant risk treated as a live compliance topic rather than a one-time filing.', ['factory', 'manufacturing', 'industrial', 'plant', 'warehouse', 'assembly'], ['factory-and-environment', 'tax-and-ca', 'workforce-and-payroll', 'fire-and-safety']),
  sector('hospital', 'Hospitals, clinics, diagnostic centres, nursing homes, and healthcare facilities', 'Healthcare', 'Healthcare establishments need KPME or equivalent establishment controls, biomedical-waste handling, fire and patient-safety measures, payroll and tax setup, and extra module reviews for labs, imaging, blood, or pharmacy activity.', ['hospital', 'clinic', 'medical', 'diagnostic', 'nursing home', 'lab'], ['healthcare-and-biomedical', 'tax-and-ca', 'workforce-and-payroll', 'fire-and-safety']),
  sector('school', 'Schools, preschools, coaching campuses with formal school permissions, and K-12 institutions', 'School education', 'Schools need education-department alignment, campus safety, payroll and tax controls, fire readiness, and extra food or transport modules if those operations exist on campus.', ['school', 'preschool', 'k12', 'academy'], ['education-and-campus', 'workforce-and-payroll', 'fire-and-safety']),
  sector('university', 'Colleges, universities, technical institutions, and higher-education campuses', 'Higher education', 'Higher-education institutions need a recognition and affiliation map, campus safety, payroll, tax, and operational modules for hostels, canteens, labs, or technical approvals.', ['college', 'university', 'institution', 'campus', 'technical institute'], ['education-and-campus', 'tax-and-ca', 'workforce-and-payroll', 'fire-and-safety'])
];

const compliancePackages = [
  pkg('launch-and-corporate', 'Launch and corporate setup', 'Entity setup, PAN/TAN, bank, auditor, records, and corporate follow-through.', ['mca', 'incomeTax']),
  pkg('tax-and-ca', 'Tax, books, and CA operations', 'GST, PT, income-tax, bookkeeping, audit calendar, and filing evidence.', ['gst', 'incomeTax', 'pt', 'karnatakaGst']),
  pkg('workforce-and-payroll', 'Workforce, payroll, and labour', 'Labour registrations, EPFO, ESIC, PT, payroll records, and people-go-live controls.', ['labour', 'epfo', 'esic', 'pt']),
  pkg('food-and-hospitality', 'Food safety and hospitality', 'FSSAI, food-safety records, trade licence, fire, LPG / PESO review, and excise review where alcohol is served.', ['fssai', 'foscos', 'bbmpTrade', 'fire', 'peso', 'excise']),
  pkg('factory-and-environment', 'Factory, environment, and industrial safety', 'Factory and plant readiness, pollution-board consent, waste handling, fire, and utility controls.', ['labour', 'kspcb', 'fire', 'bescom']),
  pkg('healthcare-and-biomedical', 'Healthcare and biomedical', 'KPME, biomedical waste, fire, labour, tax, and facility-specific modules.', ['kpme', 'kspcb', 'fire', 'labour']),
  pkg('education-and-campus', 'Education and campus', 'Recognition map, campus safety, labour, payroll, and institution-level approvals.', ['schoolEducation', 'higherEducation', 'ugc', 'aicte', 'fire']),
  pkg('trade-and-local', 'Trade licence and local operations', 'Local trade-licence, signage, utility, and premises-related controls.', ['bbmpTrade', 'fire', 'bescom']),
  pkg('fire-and-safety', 'Fire, safety, and premises controls', 'Fire NOC review, premises safety documentation, and operating-condition tracking.', ['fire', 'peso', 'bescom']),
  pkg('data-and-governance', 'Data and governance baseline', 'Data, contract, and internal policy controls for digital businesses.', ['mca', 'incomeTax'])
];

const complianceDimensions = [
  dimension('corporate', 'Corporate and entity', 'Entity records, office facts, signatories, and company-law baseline.'),
  dimension('tax', 'Tax and finance', 'GST, PT, books, audit, invoicing, and return discipline.'),
  dimension('people', 'People and payroll', 'Labour, payroll, EPFO, ESIC, contractor, and HR controls.'),
  dimension('premises', 'Premises and local permissions', 'Trade licence, premises proof, utility and local-body route.'),
  dimension('safety', 'Fire and operational safety', 'Fire, premises safety, evacuation, and critical operational safety controls.'),
  dimension('environment', 'Environment and waste', 'Pollution, discharge, waste, biomedical, and environmental records.'),
  dimension('sector', 'Sector licence and authority approvals', 'Food, healthcare, education, factory, or other activity-specific permissions.'),
  dimension('policies', 'Policies, SOPs, and governance', 'Internal policies, SOPs, evidence locker, and operational governance.'),
  dimension('commercial', 'Commercial documents and customer readiness', 'Contracts, invoices, notices, consumer-facing documents, and vendor controls.'),
  dimension('renewals', 'Renewals, inspections, and follow-up', 'Renewals, inspections, display requirements, notices, and authority response discipline.')
];

const commonTemplates = [
  requirementDef({
    id: 'entity-records',
    title: 'Entity formation and corporate records check',
    packageId: 'launch-and-corporate',
    authority: 'MCA',
    category: 'Corporate',
    completionFlags: ['incorporated'],
    forms: ['SPICe+ or existing entity proof trail', 'INC-20A / corporate record follow-through as applicable'],
    documents: ['Certificate of incorporation or entity proof', 'PAN / TAN details', 'registered-office proof', 'shareholding / owner facts'],
    evidence: ['Certificate, SRN, challan, master-data screenshot, board / sole-director records'],
    portal: officialSectorSources.mca,
    laws: ['Companies Act compliance path through MCA'],
    priority: 'Critical',
    expectedProcessing: 'Check the live MCA dashboard, preserve SRN / challan, and track post-incorporation actions immediately.',
    stopRule: 'Do not assume the business is ready simply because incorporation is done; corporate records and post-incorporation steps still matter.',
    applies: () => true,
    nextAction: 'Freeze legal-name, PAN, office, and signatory facts in one approved company profile.'
  }),
  requirementDef({
    id: 'gst-position',
    title: 'GST registration and return-position review',
    packageId: 'tax-and-ca',
    authority: 'GST',
    category: 'Tax',
    completionFlags: ['gstRegistered'],
    prereqFlags: ['incorporated'],
    forms: ['GST REG-01 where registration is required', 'Return calendar setup'],
    documents: ['PAN, incorporation proof, principal-place proof, bank details, authorized-signatory pack'],
    evidence: ['GST ARN, registration certificate, profile screenshot, return calendar'],
    portal: officialSectorSources.gst,
    laws: ['GST registration and return framework'],
    priority: 'High',
    expectedProcessing: 'Registration may generate ARN, query cycle, and certificate; keep the application PDF and query replies.',
    stopRule: 'Do not charge or represent GST registration status until the legal position is checked and, where required, the GST registration is active.',
    applies: () => true,
    nextAction: 'Review turnover, inter-State supply, e-commerce, and customer-contract facts before finalizing the GST route.'
  }),
  requirementDef({
    id: 'income-tax-books',
    title: 'Books, income-tax profile, and audit calendar setup',
    packageId: 'tax-and-ca',
    authority: 'Income Tax / internal finance',
    category: 'CA and audit',
    completionFlags: ['bookkeepingLive', 'auditAssigned'],
    prereqFlags: ['incorporated', 'bankReady'],
    forms: ['Income-tax portal profile activation', 'Books and year-end closing plan'],
    documents: ['PAN / TAN, bank mandate, chart of accounts, invoice series, expense records, contracts'],
    evidence: ['Portal access matrix, books owner note, audit / CA assignment note, year-end calendar'],
    portal: officialSectorSources.incomeTax,
    laws: ['Income-tax and audit administration'],
    priority: 'High',
    expectedProcessing: 'Internal setup plus portal-user activation; monthly close discipline matters more than one-time filing.',
    stopRule: 'Do not let the business trade for months without books, invoice control, and an assigned CA / auditor owner.',
    applies: () => true,
    nextAction: 'Assign the CA / finance owner, start the books, and freeze monthly close, TDS, and audit responsibilities.'
  }),
  requirementDef({
    id: 'professional-tax',
    title: 'Karnataka professional-tax review',
    packageId: 'tax-and-ca',
    authority: 'Karnataka Commercial Taxes Department',
    category: 'State tax',
    completionFlags: ['ptRegistered'],
    prereqFlags: ['incorporated'],
    forms: ['PT registration / enrolment route review', 'Periodic PT payment and return setup'],
    documents: ['PAN / GSTIN, employee data where relevant, business facts'],
    evidence: ['PT registration, payment challans, periodic return proof'],
    portal: officialSectorSources.pt,
    laws: ['Karnataka profession-tax law and portal route'],
    priority: 'High',
    expectedProcessing: 'Registration is portal-driven; preserve login owner, challan trail, and return evidence.',
    stopRule: 'Do not start salary or profession-tax deductions without checking Karnataka PT registration and payment responsibility.',
    applies: () => true,
    nextAction: 'Confirm whether enrolment, employer registration, or both apply based on the business and payroll fact pattern.'
  }),
  requirementDef({
    id: 'labour-payroll',
    title: 'Labour, payroll, and employee-go-live review',
    packageId: 'workforce-and-payroll',
    authority: 'Karnataka Labour / EPFO / ESIC',
    category: 'Payroll',
    completionFlags: ['labourRegistered', 'epfoRegistered', 'esicRegistered'],
    prereqFlags: ['incorporated'],
    forms: ['Establishment and labour route review', 'EPFO / ESIC registration where triggers are met', 'Payroll owner setup'],
    documents: ['Employee count, salary structure, attendance and wage records, offer-letter / HR pack'],
    evidence: ['Portal registrations, payroll calendar, challans, employee master data'],
    portal: officialSectorSources.labour,
    laws: ['Labour registrations, EPFO, and ESIC operations'],
    priority: 'High',
    expectedProcessing: 'Treat this as a trigger-based workflow and preserve the employee-count rationale, registrations, and payroll trail.',
    stopRule: 'Do not hire, onboard, or pay employees casually without checking labour, EPFO, ESIC, and payroll-record requirements.',
    applies: (ctx) => ctx.employees > 0 || ctx.flags.contractWorkers,
    nextAction: 'Confirm employee count, wage bands, contract-worker use, and the date of first payroll run.'
  }),
  requirementDef({
    id: 'compliance-locker',
    title: 'Compliance evidence locker and reminder board',
    packageId: 'launch-and-corporate',
    authority: 'Internal governance',
    category: 'Governance',
    completionFlags: ['evidenceLockerReady'],
    forms: ['Internal evidence folder', 'Reminder calendar'],
    documents: ['Portal acknowledgments, certificates, challans, notices, contracts, policies'],
    evidence: ['Matter folder, reminder board, review log'],
    portal: officialSectorSources.mca,
    laws: ['Proof preservation and internal control discipline'],
    priority: 'High',
    expectedProcessing: 'Every compliance item should end with a stored certificate, challan, ARN / SRN, and owner note.',
    stopRule: 'Do not mark filings done unless the certificate, acknowledgment, and support documents are saved in one place.',
    applies: () => true,
    nextAction: 'Open a dedicated submission folder for each approval, filing, or registration.'
  }),
  requirementDef({
    id: 'commercial-docs',
    title: 'Commercial documents, notices, and customer / vendor paperwork',
    packageId: 'data-and-governance',
    authority: 'Internal commercial control',
    category: 'Commercial',
    completionFlags: ['contractsReady'],
    forms: ['Invoice and document pack', 'Customer / vendor document checklist'],
    documents: ['Invoice format, standard terms, order form / proposal template, vendor onboarding pack, authority contact list'],
    evidence: ['Approved templates, signed versions, change log'],
    portal: officialSectorSources.mca,
    laws: ['Commercial and customer-facing controls depend on the business model'],
    priority: 'Medium',
    expectedProcessing: 'Treat templates, notices, and vendor forms as controlled documents with owners and versions.',
    stopRule: 'Do not let the business scale sales or operations with ad hoc invoices, templates, and vendor paperwork.',
    applies: () => true,
    nextAction: 'Freeze the invoice template, standard terms, and business-facing document set.'
  }),
  requirementDef({
    id: 'policies-sops',
    title: 'Policies, SOPs, and internal operating controls',
    packageId: 'data-and-governance',
    authority: 'Internal governance',
    category: 'Policies',
    completionFlags: ['policiesReady'],
    forms: ['Policy pack', 'SOP owner matrix'],
    documents: ['Operations SOPs, incident / notice handling SOP, approval matrix, employee-facing policy pack'],
    evidence: ['Policy versions, approval note, owner list, review cadence'],
    portal: officialSectorSources.mca,
    laws: ['Internal operating controls should match the risk profile of the business'],
    priority: 'Medium',
    expectedProcessing: 'Policies should be versioned, approved, and tied to actual operating owners.',
    stopRule: 'Do not assume portal filings alone make the business compliant if daily operating controls are still ad hoc.',
    applies: () => true,
    nextAction: 'List the operating SOPs the business relies on and assign owners and review dates.'
  }),
  requirementDef({
    id: 'notices-and-inspections',
    title: 'Notices, inspections, and authority-response readiness',
    packageId: 'launch-and-corporate',
    authority: 'Authority response management',
    category: 'Enforcement',
    completionFlags: ['inspectionReady'],
    forms: ['Inspection prep checklist', 'Authority-response and escalation board'],
    documents: ['Authority contact matrix, premises file, latest approvals, internal escalation contacts'],
    evidence: ['Notice log, response drafts, visit / inspection notes, closure proofs'],
    portal: officialSectorSources.mca,
    laws: ['Businesses should be able to respond to notices and inspections with a clean evidence trail'],
    priority: 'Medium',
    expectedProcessing: 'Keep one live board for notices, visits, inspections, and follow-up deadlines.',
    stopRule: 'Do not scramble only after a notice arrives; prepare the response folder and escalation flow in advance.',
    applies: () => true,
    nextAction: 'Open a notice log, define who responds, and store the current approval set in one inspection-ready folder.'
  }),
  requirementDef({
    id: 'renewals-and-display',
    title: 'Renewals, display obligations, and recurring follow-up board',
    packageId: 'launch-and-corporate',
    authority: 'Recurring compliance management',
    category: 'Renewals',
    completionFlags: ['renewalBoardReady'],
    forms: ['Renewal tracker', 'Display / certificate checklist'],
    documents: ['Licence expiry dates, display requirements, monthly / annual return board'],
    evidence: ['Reminder board, renewal chronology, displayed-copy checklist'],
    portal: officialSectorSources.mca,
    laws: ['Renewals and visible compliance obligations should be tracked proactively'],
    priority: 'High',
    expectedProcessing: 'Every approval should land on a reminder board with owner, validity date, and evidence link.',
    stopRule: 'Do not treat licence renewal or display obligations as memory-based tasks.',
    applies: () => true,
    nextAction: 'Create a single board with validity dates, reminder lead times, and displayed-document checks.'
  })
];

const sectorSpecificTemplates = {
  restaurant: [
    requirementDef({
      id: 'fssai-license',
      title: 'FSSAI registration / licence and FoSCoS setup',
      packageId: 'food-and-hospitality',
      authority: 'FSSAI',
      category: 'Food safety',
      completionFlags: ['fssaiLicensed'],
      prereqFlags: ['incorporated'],
      forms: ['FoSCoS registration or licence application', 'Kind-of-business selection review'],
      documents: ['Identity and entity proof', 'kitchen / premises proof', 'food-category and activity details', 'FSMS / hygiene support where relevant'],
      evidence: ['FoSCoS application PDF, licence / registration certificate, inspection / query replies'],
      portal: officialSectorSources.foscos,
      laws: ['Food Safety and Standards Act and licensing framework'],
      priority: 'Critical',
      expectedProcessing: 'Portal filing can trigger scrutiny and inspection; keep query responses and certificate downloads.',
      stopRule: 'Do not start food operations until the food-business registration / licence position is confirmed and active.',
      applies: () => true,
      nextAction: 'Pick the exact food-business category, premises, and turnover / scale route before submitting FoSCoS.'
    }),
    requirementDef({
      id: 'restaurant-trade-license',
      title: 'Trade licence and local-body operating permission review',
      packageId: 'trade-and-local',
      authority: 'BBMP / local urban body',
      category: 'Local operations',
      completionFlags: ['tradeLicensed'],
      prereqFlags: ['incorporated'],
      forms: ['Trade licence application / renewal'],
      documents: ['Premises proof, owner consent, occupancy details, business activity description'],
      evidence: ['Application copy, licence certificate, renewal reminders'],
      portal: officialSectorSources.bbmpTrade,
      laws: ['Trade licence workflow under local-body route'],
      priority: 'High',
      expectedProcessing: 'Local-body licensing is locality-specific; preserve the exact premises, trade, and certificate trail.',
      stopRule: 'Do not assume food licence replaces local trade-licence requirements.',
      applies: () => true,
      nextAction: 'Confirm whether the premises falls under BBMP or another local body and use the correct trade category.'
    }),
    requirementDef({
      id: 'restaurant-fire',
      title: 'Fire safety and premises-clearance review',
      packageId: 'fire-and-safety',
      authority: 'Karnataka Fire and Emergency Services',
      category: 'Safety',
      completionFlags: ['fireApproved'],
      forms: ['Fire NOC / clearance / renewal review'],
      documents: ['Premises layout, occupant load, kitchen details, fire-system documents, landlord / builder approvals'],
      evidence: ['Fire application, clearance / NOC, inspection or advisory notes'],
      portal: officialSectorSources.fire,
      laws: ['Fire-safety approvals and service guidance'],
      priority: 'High',
      expectedProcessing: 'Review the premises class and whether the business needs NOC, clearance, or advisory route.',
      stopRule: 'Do not open public-facing food premises without checking fire requirements for the building and kitchen setup.',
      applies: () => true,
      nextAction: 'Map the building type, kitchen configuration, and public footfall before deciding the fire route.'
    }),
    requirementDef({
      id: 'restaurant-peso',
      title: 'PESO / LPG storage and gas-safety review',
      packageId: 'food-and-hospitality',
      authority: 'PESO',
      category: 'Gas and hazardous storage',
      completionFlags: ['pesoApproved'],
      forms: ['PESO applicability review', 'LPG and hazardous storage compliance pack'],
      documents: ['Gas storage facts, cylinder handling model, premises and safety documents'],
      evidence: ['Applicability note, approval trail where required, safety SOP'],
      portal: officialSectorSources.peso,
      laws: ['PESO and gas-storage regulatory route'],
      priority: 'High',
      expectedProcessing: 'Treat this as a trigger-based review; the exact gas-storage setup matters.',
      stopRule: 'Do not treat LPG, manifold, or hazardous-storage issues as a minor post-opening item.',
      applies: (ctx) => ctx.flags.usesLpg || ctx.flags.hazardousStorage,
      nextAction: 'Document cylinder storage, manifold arrangements, and who controls refill / handling operations.'
    }),
    requirementDef({
      id: 'restaurant-excise',
      title: 'Alcohol-service and Karnataka excise review',
      packageId: 'food-and-hospitality',
      authority: 'Karnataka State Excise Department',
      category: 'Sector licence and authority approvals',
      completionFlags: ['exciseApproved'],
      forms: ['Excise applicability and licence-route review'],
      documents: ['Restaurant business model, alcohol-service plan, premises details, ownership and signatory details'],
      evidence: ['Applicability memo, excise application trail, licence and renewal record'],
      portal: officialSectorSources.excise,
      laws: ['Karnataka state-excise route for liquor service'],
      priority: 'Critical',
      expectedProcessing: 'Alcohol permissions should be treated as a distinct licensing track with its own renewals and operating conditions.',
      stopRule: 'Do not serve or advertise alcohol until the excise position and licence path are checked and cleared.',
      applies: (ctx) => ctx.flags.servesAlcohol,
      nextAction: 'Confirm whether alcohol service is planned, then map the excise route before launch, menu printing, or outlet fit-out.'
    }),
    requirementDef({
      id: 'restaurant-environment',
      title: 'Waste, pollution, and kitchen-discharge review',
      packageId: 'food-and-hospitality',
      authority: 'KSPCB / local body',
      category: 'Environment',
      completionFlags: ['pollutionApproved'],
      forms: ['KSPCB applicability review', 'Waste-handling and discharge-control pack'],
      documents: ['Kitchen process note, waste arrangement, water / effluent facts, solid-waste vendor details'],
      evidence: ['Applicability note, consent or waste-management evidence, vendor agreements'],
      portal: officialSectorSources.kspcb,
      laws: ['Pollution-control and waste-management route'],
      priority: 'Medium',
      expectedProcessing: 'Pollution and waste obligations depend on the kitchen and premises setup; preserve the reasoning trail.',
      stopRule: 'Do not ignore grease, waste, or discharge practices just because the business is small.',
      applies: () => true,
      nextAction: 'Record the kitchen setup, waste volume, discharge pattern, and local waste-vendor arrangement.'
    })
  ],
  'it-services': [
    requirementDef({
      id: 'it-shops-labour',
      title: 'Shops / establishment and labour setup review',
      packageId: 'workforce-and-payroll',
      authority: 'Karnataka Labour',
      category: 'Establishment',
      completionFlags: ['labourRegistered'],
      prereqFlags: ['incorporated'],
      forms: ['Labour / establishment registration route review'],
      documents: ['Office proof, employee count, work-hours note, HR owner details'],
      evidence: ['Registration or applicability note, policy pack, holiday and attendance records'],
      portal: officialSectorSources.labour,
      laws: ['Karnataka establishment and labour route'],
      priority: 'High',
      expectedProcessing: 'Use the labour portal and preserve the establishment facts and owner matrix.',
      stopRule: 'Do not assume a software business has no labour registrations or employee-record obligations.',
      applies: () => true,
      nextAction: 'Document headcount, office location, remote-work model, and people operations owner.'
    }),
    requirementDef({
      id: 'it-data-governance',
      title: 'Customer-data, privacy, and contract-control baseline',
      packageId: 'data-and-governance',
      authority: 'Internal governance / digital-business review',
      category: 'Data governance',
      completionFlags: ['dataGovernanceReady'],
      forms: ['Privacy and data-inventory checklist', 'Customer-contract and DPA pack'],
      documents: ['Product data-flow note, customer categories, vendor list, privacy notice, incident owner'],
      evidence: ['Data map, privacy notice, contract templates, incident-response owner note'],
      portal: officialSectorSources.mca,
      laws: ['Digital-business governance baseline'],
      priority: 'Medium',
      expectedProcessing: 'Treat this as an internal compliance package with legal review before scaling customers.',
      stopRule: 'Do not sell enterprise software while improvising privacy, vendor, and contract controls.',
      applies: () => true,
      nextAction: 'List what personal data the product touches, which vendors process it, and who signs customer contracts.'
    })
  ],
  'retail-shop': [
    requirementDef({
      id: 'retail-trade-license',
      title: 'Trade licence and premises-permission review',
      packageId: 'trade-and-local',
      authority: 'BBMP / local body',
      category: 'Local operations',
      completionFlags: ['tradeLicensed'],
      prereqFlags: ['incorporated'],
      forms: ['Trade licence application / renewal'],
      documents: ['Premises proof, occupancy arrangement, business activity note'],
      evidence: ['Licence copy, payment trail, renewal tracker'],
      portal: officialSectorSources.bbmpTrade,
      laws: ['Local trade-licence route'],
      priority: 'High',
      expectedProcessing: 'Check the exact municipality and trade category before filing.',
      stopRule: 'Do not open the shop assuming GST registration alone covers local trade permissions.',
      applies: () => true,
      nextAction: 'Confirm the local body, shop category, and premises documentation.'
    }),
    requirementDef({
      id: 'retail-fire',
      title: 'Retail fire and public-premises review',
      packageId: 'fire-and-safety',
      authority: 'Karnataka Fire and Emergency Services',
      category: 'Safety',
      completionFlags: ['fireApproved'],
      forms: ['Fire applicability review'],
      documents: ['Premises layout, mall or standalone shop details, occupant-load facts'],
      evidence: ['Applicability note, advisory / NOC trail, premises safety checklist'],
      portal: officialSectorSources.fire,
      laws: ['Fire-safety route'],
      priority: 'Medium',
      expectedProcessing: 'Higher-footfall or mall-linked retail needs a more formal fire review.',
      stopRule: 'Do not ignore fire readiness because the business is "just a shop."',
      applies: () => true,
      nextAction: 'Map whether the shop is standalone, in a mall, or inside a shared commercial building.'
    })
  ],
  'textile-garment': [
    requirementDef({
      id: 'textile-factory-route',
      title: 'Factory / manufacturing route review',
      packageId: 'factory-and-environment',
      authority: 'Karnataka Labour and industrial regulators',
      category: 'Factory',
      completionFlags: ['factoryRegistered'],
      prereqFlags: ['incorporated'],
      forms: ['Factory / manufacturing applicability review', 'Plant and establishment pack'],
      documents: ['Premises and machinery note, process flow, headcount and shift plan'],
      evidence: ['Applicability memo, registration / licence proof, inspection trail'],
      portal: officialSectorSources.labour,
      laws: ['Factory and labour route'],
      priority: 'Critical',
      expectedProcessing: 'Factory-status questions depend on the manufacturing setup and workforce facts.',
      stopRule: 'Do not start production lines or power-backed manufacturing without settling the factory-regulation route.',
      applies: () => true,
      nextAction: 'Map machines, shifts, contract labour, and whether the unit is job-work, stitching, processing, or full manufacturing.'
    }),
    requirementDef({
      id: 'textile-pollution',
      title: 'Pollution-control and waste-management review',
      packageId: 'factory-and-environment',
      authority: 'KSPCB',
      category: 'Environment',
      completionFlags: ['pollutionApproved'],
      forms: ['Consent management / authorization review'],
      documents: ['Process note, waste / effluent facts, premises category, machine and fuel details'],
      evidence: ['Consent application, consent / authorization, waste-disposal records'],
      portal: officialSectorSources.kspcb,
      laws: ['KSPCB consent and waste-management route'],
      priority: 'High',
      expectedProcessing: 'KSPCB category and consent route depend on the activity and pollution footprint.',
      stopRule: 'Do not run stitching, washing, dyeing, printing, or related processes without checking pollution-board applicability.',
      applies: () => true,
      nextAction: 'Write down each production step, water use, dye / chemical use, and waste handling model.'
    }),
    requirementDef({
      id: 'textile-fire',
      title: 'Factory fire and safety review',
      packageId: 'fire-and-safety',
      authority: 'Karnataka Fire and Emergency Services',
      category: 'Safety',
      completionFlags: ['fireApproved'],
      forms: ['Fire NOC / safety review'],
      documents: ['Premises layout, stock type, occupant load, fire-fighting equipment details'],
      evidence: ['Fire advisory / NOC, drills / safety records'],
      portal: officialSectorSources.fire,
      laws: ['Fire-safety route'],
      priority: 'High',
      expectedProcessing: 'Textile and fabric stock can create a sharper fire-risk profile.',
      stopRule: 'Do not scale inventory or production before documenting fire load and safety controls.',
      applies: () => true,
      nextAction: 'Map stock volume, floor plan, electrical load, and evacuation routes.'
    })
  ],
  factory: [
    requirementDef({
      id: 'factory-registration',
      title: 'Factory / plant regulatory route',
      packageId: 'factory-and-environment',
      authority: 'Karnataka Labour / industrial regulators',
      category: 'Factory',
      completionFlags: ['factoryRegistered'],
      prereqFlags: ['incorporated'],
      forms: ['Factory / plant applicability review and registration path'],
      documents: ['Premises note, machinery list, production process, shift / employee plan'],
      evidence: ['Registration / licence trail, inspection records, site plan'],
      portal: officialSectorSources.labour,
      laws: ['Factory and industrial labour route'],
      priority: 'Critical',
      expectedProcessing: 'Resolve the factory route early because it affects layout, machines, labour, and downstream approvals.',
      stopRule: 'Do not energize or operate a plant as if it were a simple office or retail unit.',
      applies: () => true,
      nextAction: 'Document machines, connected load, material flow, and headcount before choosing the filing path.'
    }),
    requirementDef({
      id: 'factory-pollution',
      title: 'KSPCB consent, waste, and environmental control review',
      packageId: 'factory-and-environment',
      authority: 'KSPCB',
      category: 'Environment',
      completionFlags: ['pollutionApproved'],
      forms: ['Consent for establishment / operation review', 'Waste authorization review'],
      documents: ['Process flow, water use, emissions and waste profile, premises details'],
      evidence: ['Consent application, consent certificate, waste records, compliance board'],
      portal: officialSectorSources.kspcb,
      laws: ['Pollution-control and waste-management route'],
      priority: 'Critical',
      expectedProcessing: 'Environmental category and consent type depend on the process and pollution footprint.',
      stopRule: 'Do not operate industrial processes before settling consent and waste obligations.',
      applies: () => true,
      nextAction: 'Prepare a simple but accurate process and waste map before engaging the pollution-board route.'
    }),
    requirementDef({
      id: 'factory-fire',
      title: 'Factory fire and industrial safety review',
      packageId: 'fire-and-safety',
      authority: 'Karnataka Fire and Emergency Services',
      category: 'Safety',
      completionFlags: ['fireApproved'],
      forms: ['Fire NOC / clearance review'],
      documents: ['Site plan, storage facts, fire systems, occupancy and evacuation details'],
      evidence: ['Fire application, NOC / clearance, inspection notes'],
      portal: officialSectorSources.fire,
      laws: ['Fire and premises-safety route'],
      priority: 'High',
      expectedProcessing: 'The correct fire route depends on building and process risk.',
      stopRule: 'Do not stock combustible materials or run plant operations without documented fire controls.',
      applies: () => true,
      nextAction: 'Map hazardous stock, DG sets, cylinders, boilers, and building use before submission.'
    }),
    requirementDef({
      id: 'factory-electricity',
      title: 'Commercial power and electrical-safety review',
      packageId: 'factory-and-environment',
      authority: 'Utility and electrical safety',
      category: 'Utility',
      completionFlags: ['powerReady'],
      forms: ['Utility connection and electrical-safety record pack'],
      documents: ['Connected load, sanctioned connection details, installation drawings, contractor / vendor records'],
      evidence: ['Connection proof, inspection records, electrical safety file'],
      portal: officialSectorSources.bescom,
      laws: ['Commercial-power and installation-safety route'],
      priority: 'Medium',
      expectedProcessing: 'Industrial power and safety records should be treated as a live dossier, not a one-time bill.',
      stopRule: 'Do not ramp plant operations without a documented electricity and installation-safety file.',
      applies: () => true,
      nextAction: 'Freeze the sanctioned load, meter details, and the responsible electrical contractor / engineer.'
    })
  ],
  hospital: [
    requirementDef({
      id: 'hospital-kpme',
      title: 'KPME registration / licence path',
      packageId: 'healthcare-and-biomedical',
      authority: 'KPME',
      category: 'Healthcare establishment',
      completionFlags: ['kpmeRegistered'],
      prereqFlags: ['incorporated'],
      forms: ['KPME application / renewal review'],
      documents: ['Establishment details, categories of services, doctor / operator details, premises and safety records'],
      evidence: ['KPME application, licence certificate, category approval trail'],
      portal: officialSectorSources.kpme,
      laws: ['Karnataka Private Medical Establishments route'],
      priority: 'Critical',
      expectedProcessing: 'Healthcare category matters. Preserve the exact service mix and licence trail.',
      stopRule: 'Do not start clinical operations without settling the KPME route.',
      applies: () => true,
      nextAction: 'List every service line: OPD, IPD, diagnostics, day care, imaging, pharmacy, lab, ambulance, or specialty unit.'
    }),
    requirementDef({
      id: 'hospital-bmw',
      title: 'Biomedical-waste and pollution-control review',
      packageId: 'healthcare-and-biomedical',
      authority: 'KSPCB',
      category: 'Biomedical waste',
      completionFlags: ['pollutionApproved'],
      forms: ['Biomedical waste authorization / KSPCB review'],
      documents: ['Service mix, waste stream note, vendor / operator details, premises plan'],
      evidence: ['Authorization trail, waste-vendor agreement, manifests and disposal records'],
      portal: officialSectorSources.kspcb,
      laws: ['Biomedical-waste and pollution-control route'],
      priority: 'Critical',
      expectedProcessing: 'Biomedical-waste compliance needs an operating log, not just an application.',
      stopRule: 'Do not run a clinic or diagnostic unit while treating biomedical waste as a housekeeping issue.',
      applies: () => true,
      nextAction: 'Map each waste stream and the contracted disposal path before going live.'
    }),
    requirementDef({
      id: 'hospital-fire',
      title: 'Hospital fire and patient-safety review',
      packageId: 'fire-and-safety',
      authority: 'Karnataka Fire and Emergency Services',
      category: 'Safety',
      completionFlags: ['fireApproved'],
      forms: ['Fire NOC / clearance review'],
      documents: ['Hospital layout, occupancy and patient profile, evacuation plan, equipment and oxygen notes'],
      evidence: ['Fire application, clearance, drills and safety records'],
      portal: officialSectorSources.fire,
      laws: ['Fire and life-safety route'],
      priority: 'Critical',
      expectedProcessing: 'Patient occupancy and oxygen / equipment profile make this a high-risk workflow.',
      stopRule: 'Do not operate patient-care facilities without documented fire and evacuation controls.',
      applies: () => true,
      nextAction: 'Prepare the layout, bed count, floor plan, and critical equipment map.'
    }),
    requirementDef({
      id: 'hospital-modules',
      title: 'Facility-specific module review: pharmacy, diagnostics, imaging, blood, ambulance',
      packageId: 'healthcare-and-biomedical',
      authority: 'Sector-specific healthcare regulators',
      category: 'Special modules',
      completionFlags: ['healthcareModulesReady'],
      forms: ['Applicability review for offered services'],
      documents: ['Department list, equipment list, staff credentials, vendor contracts'],
      evidence: ['Applicability memo, service-wise approval tracker'],
      portal: officialSectorSources.kpme,
      laws: ['Healthcare module-specific permissions vary by service line'],
      priority: 'High',
      expectedProcessing: 'Treat each service line separately instead of assuming one healthcare licence covers everything.',
      stopRule: 'Do not add diagnostics, imaging, blood, or pharmacy activity without checking module-specific approvals.',
      applies: (ctx) => ctx.flags.biomedicalWaste || ctx.flags.specialClinicalServices,
      nextAction: 'List every service the facility offers and create a module-by-module approval sheet.'
    })
  ],
  school: [
    requirementDef({
      id: 'school-recognition',
      title: 'School-education recognition and institution status review',
      packageId: 'education-and-campus',
      authority: 'Karnataka School Education Department',
      category: 'Education approval',
      completionFlags: ['schoolApproved'],
      prereqFlags: ['incorporated'],
      forms: ['School recognition / institution route review'],
      documents: ['Campus details, management details, grades offered, affiliation model, infrastructure note'],
      evidence: ['Recognition trail, management approvals, campus information file'],
      portal: officialSectorSources.schoolEducation,
      laws: ['School-education department route'],
      priority: 'Critical',
      expectedProcessing: 'School permissions are fact-heavy and campus-specific.',
      stopRule: 'Do not start school operations or admissions until the recognition / institution status route is settled.',
      applies: () => true,
      nextAction: 'Map grades, board / affiliation model, campus facilities, and management structure.'
    }),
    requirementDef({
      id: 'school-fire-campus',
      title: 'Campus fire, child-safety, and premises review',
      packageId: 'education-and-campus',
      authority: 'Fire and campus operations',
      category: 'Campus safety',
      completionFlags: ['fireApproved'],
      forms: ['Fire and campus-safety review'],
      documents: ['Campus layout, student strength, evacuation plan, transport / canteen notes'],
      evidence: ['Fire trail, safety SOP, drill records'],
      portal: officialSectorSources.fire,
      laws: ['Campus safety and fire-control route'],
      priority: 'High',
      expectedProcessing: 'Student occupancy and transport / canteen modules increase the review load.',
      stopRule: 'Do not run a campus with students, staff, and visitors without a real safety dossier.',
      applies: () => true,
      nextAction: 'List buildings, floor use, student count, transport, and canteen / hostel modules.'
    })
  ],
  university: [
    requirementDef({
      id: 'higher-ed-approval',
      title: 'Higher-education recognition, approval, and affiliation map',
      packageId: 'education-and-campus',
      authority: 'UGC / AICTE / Karnataka higher-education bodies',
      category: 'Education approval',
      completionFlags: ['higherEdApproved'],
      prereqFlags: ['incorporated'],
      forms: ['Recognition / affiliation route map'],
      documents: ['Institution type, programme list, campus details, governing body and infrastructure note'],
      evidence: ['Approval matrix, recognition letters, affiliation trail'],
      portal: officialSectorSources.ugc,
      laws: ['UGC / AICTE and institution recognition route'],
      priority: 'Critical',
      expectedProcessing: 'Institution type and programme mix decide whether UGC, AICTE, state, or multiple bodies apply.',
      stopRule: 'Do not market a university or college programme until the recognition and approval map is checked carefully.',
      applies: () => true,
      nextAction: 'List each programme, mode, campus, and claimed affiliation or recognition in one approval sheet.'
    }),
    requirementDef({
      id: 'higher-ed-campus',
      title: 'Campus, hostel, lab, and canteen compliance review',
      packageId: 'education-and-campus',
      authority: 'Campus operations',
      category: 'Campus operations',
      completionFlags: ['campusOpsReady'],
      forms: ['Campus module review'],
      documents: ['Hostel, lab, canteen, transport, and public-footfall details'],
      evidence: ['Campus module tracker, safety file, food-safety or lab module records'],
      portal: officialSectorSources.higherEducation,
      laws: ['Campus operations depend on the actual facilities offered'],
      priority: 'High',
      expectedProcessing: 'Each campus module should be broken out instead of managed as one generic institution file.',
      stopRule: 'Do not add hostels, canteens, labs, or transport informally; each can trigger additional controls.',
      applies: () => true,
      nextAction: 'Create separate tracks for hostel, canteen, transport, and lab operations.'
    })
  ]
};

function buildComplianceManagerPlan(input = {}) {
  const sector = resolveSector(input.businessType || input.brief || input.existingSituation || '');
  const profile = buildBusinessProfile(input, sector);
  const templates = [...commonTemplates, ...(sectorSpecificTemplates[sector.id] || [])];
  const actionPlan = templates
    .filter((definition) => definition.applies(profile))
    .map((definition, index) => materializeRequirement(definition, profile, index + 1))
    .sort(compareRequirements);

  const completeCount = actionPlan.filter((item) => item.status === 'Complete').length;
  const criticalOpen = actionPlan.filter((item) => item.status !== 'Complete' && item.priority === 'Critical');
  const highOpen = actionPlan.filter((item) => item.status !== 'Complete' && item.priority === 'High');
  const readinessScore = clamp(
    Math.round((completeCount / Math.max(actionPlan.length, 1)) * 100 - criticalOpen.length * 6 - highOpen.length * 2),
    12,
    96
  );
  const packageSet = new Set([...(sector.packageIds || []), ...actionPlan.map((item) => item.packageId)]);
  const packageCards = buildPackageCardList([...packageSet]);
  const citations = dedupeSources(actionPlan.flatMap((item) => item.sources));
  const pending = actionPlan.filter((item) => item.status !== 'Complete');
  const locationLabel = [profile.city, profile.state].filter(Boolean).join(', ');
  const locationText = locationLabel ? ` in ${locationLabel}` : '';

  return {
    title: `${sector.name} compliance manager`,
    summary: `${profile.businessName} is mapped as ${sector.name.toLowerCase()}${locationText}. The workflow is organized by what must be done now, what is already marked complete, and what must stop operations until cleared.`,
    readinessScore,
    readinessLabel: readinessScore >= 75 ? 'Operationally organized' : readinessScore >= 55 ? 'Work in progress' : 'Critical setup pending',
    businessProfile: {
      businessName: profile.businessName,
      businessType: sector.name,
      sectorId: profile.sectorId,
      stage: profile.stageLabel,
      entityType: profile.entityType,
      city: profile.city,
      state: profile.state,
      employees: profile.employees,
      branches: profile.branches,
      existingSituation: profile.existingSituation
    },
    sectorSummary: sector.summary,
    packageCards,
    dimensionCoverage: buildDimensionCoverage(actionPlan),
    criticalStops: criticalOpen.map((item) => `${item.title}: ${item.stopRule}`),
    actionPlan,
    pendingItems: pending.map((item) => `${item.step}. ${item.title} -> ${item.nextAction}`),
    recurringCalendar: buildRecurringCalendar(profile, actionPlan),
    submissionFolders: buildSubmissionFolders(profile, actionPlan),
    applicationPackets: buildApplicationPackets(profile, actionPlan),
    knowledgeLibrary: buildKnowledgeLibrary(sector, packageCards),
    serviceConnectors: buildSectorConnectors(profile, sector, actionPlan),
    emailDrafts: buildSectorEmails(profile, sector, actionPlan),
    updateDiscipline: [
      'Review official portal notices and law changes before every submission or renewal, not just when the business first starts.',
      'Record ARN, SRN, acknowledgement, certificate, challan, and the final filed PDF in one folder for each compliance item.',
      'Do not close a task until the proof is saved and the next reminder is scheduled.'
    ],
    citations,
    guardrails: {
      assistiveOnly: true,
      humanReviewRequired: true,
      exportPolicy: 'Use the plan to prepare, file, and track; have the founder, CA / auditor, and domain specialist review before real submission.',
      accuracyPolicy: 'Official portals and regulator materials outrank operator notes and model reasoning.'
    }
  };
}

function buildLibraryPayload() {
  return {
    sectors: sectorProfiles.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      summary: item.summary,
      packages: item.packageIds.map((packageId) => compliancePackages.find((entry) => entry.id === packageId)?.name).filter(Boolean)
    })),
    packages: compliancePackages.map((item) => ({
      ...item,
      sources: item.sourceIds.map((sourceId) => officialSectorSources[sourceId]).filter(Boolean)
    })),
    dimensions: complianceDimensions,
    sources: Object.values(officialSectorSources),
    updatePolicy: [
      'Official portals come first.',
      'Karnataka state and local authorities are preferred for Karnataka-specific operational rules.',
      'Source set refreshed on 8 April 2026; verify the live filing path before every real submission or renewal.',
      'Monthly, quarterly, annual, and event-driven obligations should all live on the same reminder board.'
    ]
  };
}

function listSectorProfiles() {
  return sectorProfiles;
}

function buildBusinessProfile(input, sector) {
  const flags = {
    incorporated: truthy(input.incorporated),
    bankReady: truthy(input.bankReady),
    bookkeepingLive: truthy(input.bookkeepingLive),
    auditAssigned: truthy(input.auditAssigned),
    gstRegistered: truthy(input.gstRegistered),
    ptRegistered: truthy(input.ptRegistered),
    tradeLicensed: truthy(input.tradeLicensed),
    fssaiLicensed: truthy(input.fssaiLicensed),
    fireApproved: truthy(input.fireApproved),
    pesoApproved: truthy(input.pesoApproved),
    exciseApproved: truthy(input.exciseApproved),
    pollutionApproved: truthy(input.pollutionApproved),
    labourRegistered: truthy(input.labourRegistered),
    epfoRegistered: truthy(input.epfoRegistered),
    esicRegistered: truthy(input.esicRegistered),
    kpmeRegistered: truthy(input.kpmeRegistered),
    schoolApproved: truthy(input.schoolApproved),
    higherEdApproved: truthy(input.higherEdApproved),
    udyamRegistered: truthy(input.udyamRegistered),
    evidenceLockerReady: truthy(input.evidenceLockerReady),
    factoryRegistered: truthy(input.factoryRegistered),
    powerReady: truthy(input.powerReady),
    dataGovernanceReady: truthy(input.dataGovernanceReady),
    contractsReady: truthy(input.contractsReady),
    policiesReady: truthy(input.policiesReady),
    inspectionReady: truthy(input.inspectionReady),
    renewalBoardReady: truthy(input.renewalBoardReady),
    healthcareModulesReady: truthy(input.healthcareModulesReady),
    campusOpsReady: truthy(input.campusOpsReady),
    contractWorkers: truthy(input.contractWorkers),
    usesLpg: truthy(input.usesLpg),
    servesAlcohol: truthy(input.servesAlcohol),
    hazardousStorage: truthy(input.hazardousStorage),
    biomedicalWaste: truthy(input.biomedicalWaste),
    specialClinicalServices: truthy(input.specialClinicalServices),
    cityLocalLicence: truthy(input.cityLocalLicence),
    interstateSupply: truthy(input.interstateSupply),
    ecommerce: truthy(input.ecommerce)
  };

  const stage = clean(input.stage) || (flags.incorporated ? 'operating' : '');

  return {
    businessName: clean(input.businessName) || 'This business',
    entityType: clean(input.entityType) || 'Entity type not confirmed yet',
    city: clean(input.city),
    state: clean(input.state),
    branches: Number(input.branches || 1),
    employees: Number(input.employees || 0),
    stage,
    stageLabel: stage ? stage.replace(/-/g, ' ') : 'not confirmed yet',
    sectorId: sector.id,
    existingSituation: normalize(input.existingSituation || input.brief || ''),
    flags
  };
}

function materializeRequirement(definition, profile, step) {
  const completed = definition.completionFlags.every((flag) => profile.flags[flag]);
  const prereqsMet = definition.prereqFlags.every((flag) => profile.flags[flag]);
  const status = completed ? 'Complete' : prereqsMet ? activeStatusForStage(profile.stage) : 'Blocked';
  const dimensions = dimensionsForRequirement(definition);

  return {
    id: definition.id,
    step,
    title: definition.title,
    packageId: definition.packageId,
    category: definition.category,
    authority: definition.authority,
    status,
    priority: definition.priority,
    dimensions,
    whyItMatters: categoryWhy(definition.category),
    forms: definition.forms,
    laws: definition.laws,
    portalName: definition.portal.name,
    portalUrl: definition.portal.url,
    documents: definition.documents,
    evidence: definition.evidence,
    nextAction: completed ? 'Keep the proof folder current and track renewals.' : definition.nextAction,
    expectedProcessing: definition.expectedProcessing,
    recurrence: recurrenceFor(definition.id, profile),
    stopRule: completed ? null : definition.stopRule,
    sources: sourceList(definition.portal, definition.extraSources),
    blockers: completed ? [] : prereqBlockers(definition.prereqFlags, profile.flags)
  };
}

function buildRecurringCalendar(profile, actionPlan) {
  const calendar = [];
  if (actionPlan.some((item) => item.id === 'gst-position')) {
    calendar.push({ title: 'GST returns and reconciliations', cadence: 'Monthly / quarterly / annual as applicable', owner: 'CA / tax operator', note: 'Use the GST profile and return scheme actually in force for the business.' });
  }
  calendar.push({ title: 'Books closure and CA review', cadence: 'Monthly', owner: 'Finance / CA', note: 'Close books, reconcile bank and tax positions, and preserve working papers.' });
  if (profile.employees > 0 || profile.flags.contractWorkers) {
    calendar.push({ title: 'Payroll, PT, EPFO, and ESIC cycle', cadence: 'Monthly', owner: 'HR / payroll', note: 'Run salary, deposits, returns, and proofs on one recurring board.' });
  }
  if (profile.sectorId === 'restaurant') {
    calendar.push({ title: 'Food-safety renewal and hygiene records', cadence: 'Periodic renewal plus ongoing records', owner: 'Operations / kitchen lead', note: 'Track food-licence validity, inspections, staff hygiene records, and customer-complaint file.' });
    if (profile.flags.servesAlcohol) {
      calendar.push({ title: 'Excise licence validity and operating-condition review', cadence: 'Licence validity and renewal cycle', owner: 'Founder / operations lead', note: 'Track excise conditions, displayed permissions, and renewal dates separately from food and trade approvals.' });
    }
  }
  if (profile.sectorId === 'hospital') {
    calendar.push({ title: 'Biomedical-waste logs and healthcare licence renewals', cadence: 'Ongoing logs plus renewal cycle', owner: 'Admin / compliance officer', note: 'Preserve waste manifests, vendor records, and healthcare licence lifecycle.' });
  }
  if (profile.sectorId === 'school' || profile.sectorId === 'university') {
    calendar.push({ title: 'Campus safety and recognition review', cadence: 'Term-wise and annual', owner: 'Institution admin', note: 'Keep recognition, campus safety, and facility modules current before admissions and term start.' });
  }
  return calendar;
}

function buildSubmissionFolders(profile, actionPlan) {
  return actionPlan.filter((item) => item.status !== 'Complete').slice(0, 6).map((item) => ({
    name: `${profile.businessName} - ${item.title}`,
    contains: ['application draft', 'supporting documents', 'portal screenshots', 'payment challan / acknowledgment', 'certificate / approval copy', 'internal review note'],
    referenceField: `${item.authority} acknowledgement / reference number`,
    followUp: `Set a follow-up date as soon as ${item.portalName} or the authority issues an ARN, SRN, or acknowledgment.`
  }));
}

function buildApplicationPackets(profile, actionPlan) {
  return actionPlan.filter((item) => item.status !== 'Complete').slice(0, 5).map((item) => ({
    title: `${item.title} draft packet`,
    portalName: item.portalName,
    portalUrl: item.portalUrl,
    prefilledFields: [
      fieldMap('Business name', profile.businessName),
      fieldMap('Entity type', profile.entityType),
      fieldMap('State', profile.state),
      fieldMap('City', profile.city),
      fieldMap('Employees', String(profile.employees)),
      fieldMap('Branches / locations', String(profile.branches))
    ],
    attachments: item.documents,
    reviewBeforeSubmit: ['Founder / authorized signatory review', 'CA / auditor / sector specialist review where applicable', 'Premises and address proof match check']
  }));
}

function buildKnowledgeLibrary(sector, packageCards) {
  return packageCards.map((item) => ({
    title: item.name,
    summary: item.summary,
    sourceLinks: item.sourceIds.map((sourceId) => officialSectorSources[sourceId]).filter(Boolean),
    notes: knowledgeNotesForPackage(item.id, sector.id)
  }));
}

function buildSectorConnectors(profile, sector, actionPlan) {
  const connectors = [
    connector('CA / tax operator', 'Needed', 'Own GST, PT, books, audit calendar, and filing proofs.'),
    connector('Document and evidence locker', 'Needed', 'Store all acknowledgments, certificates, challans, and source material.'),
    connector('Authorized signatory control', 'Needed', 'Keep portal access, e-sign, and approval flow clean.')
  ];
  if (actionPlan.some((item) => item.id.includes('fssai'))) connectors.push(connector('Food-safety operations lead', 'Needed', 'Own food-licence records, hygiene, and renewals.'));
  if (actionPlan.some((item) => item.id.includes('excise'))) connectors.push(connector('Excise and outlet-operations owner', 'Review', 'Track excise conditions, renewals, and outlet-level alcohol controls.'));
  if (actionPlan.some((item) => item.id.includes('fire'))) connectors.push(connector('Fire and premises consultant', 'Review', 'Validate building, evacuation, and fire-system readiness.'));
  if (actionPlan.some((item) => item.id.includes('pollution') || item.id.includes('bmw'))) connectors.push(connector('Pollution / waste compliance support', 'Review', 'Own consent, authorization, and waste trail.'));
  if (sector.id === 'hospital') connectors.push(connector('Healthcare admin compliance owner', 'Needed', 'Track KPME, module approvals, and biomedical waste.'));
  if (sector.id === 'school' || sector.id === 'university') connectors.push(connector('Institution admin and recognition owner', 'Needed', 'Track recognition, affiliations, and campus approvals.'));
  if (profile.employees > 0 || profile.flags.contractWorkers) connectors.push(connector('Payroll and HR operator', 'Needed', 'Own attendance, payroll, PT, EPFO, ESIC, and employee records.'));
  return connectors;
}

function buildSectorEmails(profile, sector, actionPlan) {
  const firstOpen = actionPlan.find((item) => item.status !== 'Complete');
  return [
    {
      title: 'Internal compliance kickoff',
      subject: `${profile.businessName} - ${sector.name} compliance kickoff`,
      body: `Please review the attached action plan for ${profile.businessName}. The first hard-stop item is "${firstOpen ? firstOpen.title : 'no open item'}". No filing or operating step should be marked complete until the portal proof and supporting documents are saved in the submission folder.`
    },
    {
      title: 'CA / sector-specialist handoff',
      subject: `${profile.businessName} - review compliance roadmap and filing sequence`,
      body: `We have mapped the business as ${sector.name.toLowerCase()}${formatLocation(profile) ? ` in ${formatLocation(profile)}` : ''}. Please review the action plan, confirm the filing order, mark any sector-specific approvals that still need validation, and return the authority-wise sequence with owner names.`
    }
  ];
}

function buildDimensionCoverage(actionPlan) {
  return complianceDimensions.map((dimension) => {
    const items = actionPlan.filter((item) => item.dimensions.includes(dimension.id));
    const complete = items.filter((item) => item.status === 'Complete').length;
    const critical = items.filter((item) => item.status !== 'Complete' && item.priority === 'Critical').length;
    const high = items.filter((item) => item.status !== 'Complete' && item.priority === 'High').length;
    const open = items.filter((item) => item.status !== 'Complete').length;
    const score = items.length ? Math.max(0, Math.min(100, Math.round((complete / items.length) * 100 - critical * 15 - high * 8))) : 100;

    return {
      id: dimension.id,
      name: dimension.name,
      summary: dimension.summary,
      itemCount: items.length,
      complete,
      open,
      critical,
      high,
      score,
      status: score >= 75 ? 'Covered' : score >= 50 ? 'Needs work' : 'Critical gap'
    };
  });
}

function resolveSector(value) {
  const lower = normalize(value).toLowerCase();
  return sectorProfiles.find((profile) => profile.aliases.some((alias) => lower.includes(alias))) || sectorProfiles[0];
}

function buildPackageCardList(packageIds) {
  return compliancePackages.filter((item) => packageIds.includes(item.id));
}

function knowledgeNotesForPackage(packageId, sectorId) {
  const notes = {
    'launch-and-corporate': ['Start with the company profile, signatory matrix, and evidence locker.', 'Corporate setup is not complete until post-incorporation tasks are assigned.'],
    'tax-and-ca': ['Separate "registration done" from "returns and books are running correctly."', 'Keep a monthly close checklist and owner.'],
    'workforce-and-payroll': ['Headcount and payroll facts drive multiple registrations; keep them current.', 'Store monthly challans, return proofs, and employee records.'],
    'food-and-hospitality': ['Food businesses should track food category, kitchen model, and premise facts carefully.', 'Trade, food, fire, LPG, and excise issues are separate workflows.'],
    'factory-and-environment': ['Industrial approvals depend on the actual process and pollution profile.', 'One process change can affect consent, safety, and waste controls.'],
    'healthcare-and-biomedical': ['Healthcare services should be broken into service modules, not treated as one generic hospital licence.', 'Biomedical waste should have its own live evidence trail.'],
    'education-and-campus': ['Recognition, affiliation, and campus operations should be tracked separately.', 'Hostels, labs, and canteens often create extra compliance modules.'],
    'trade-and-local': ['Local-body permissions depend on municipality, building, and trade type.', 'Keep a local-body copy of the premises and trade documents.'],
    'fire-and-safety': ['Fire review should reflect the actual premises and occupancy, not a guessed template.', 'Renewals and inspections need a stored chronology.'],
    'data-and-governance': ['Digital businesses should map customer data, vendors, and contract templates early.', 'Data governance should be reviewed before enterprise scaling.']
  };

  const sectorNotes = {
    restaurant: ['Restaurants should keep kitchen, storage, and waste facts in one place.', 'If alcohol is planned, excise should run as a separate approval and renewal track.'],
    hospital: ['Hospitals should split OPD, IPD, diagnostics, pharmacy, and imaging into separate modules.'],
    school: ['Schools should align recognition, admissions, campus safety, and canteen / transport modules.'],
    university: ['Higher-education institutions should separate programme approvals from campus operations.']
  };

  return [...(notes[packageId] || []), ...(sectorNotes[sectorId] || [])];
}

function compareRequirements(left, right) {
  return priorityRank(left.priority) - priorityRank(right.priority) || left.step - right.step;
}

function priorityRank(value) {
  return { Critical: 0, High: 1, Medium: 2, Low: 3 }[value] ?? 9;
}

function categoryWhy(category) {
  const map = {
    Corporate: 'This keeps the legal entity and signatory base valid.',
    Tax: 'This controls tax registration, invoicing, and return discipline.',
    'CA and audit': 'This keeps books, audit ownership, and year-end close from slipping.',
    'State tax': 'This handles Karnataka-specific tax obligations.',
    Payroll: 'This controls employees, payroll, and labour-law triggers.',
    Governance: 'This keeps proof, reminders, and audit trail organized.',
    'Food safety': 'This controls the food-licence and food-safety operating position.',
    'Sector licence and authority approvals': 'This keeps sector-specific permissions from getting buried under generic tax or local filings.',
    'Local operations': 'This handles municipal and premises-level permissioning.',
    Safety: 'This keeps premises and operational safety risk under review.',
    'Gas and hazardous storage': 'This covers LPG and hazardous-storage exposure.',
    Environment: 'This handles pollution, waste, and discharge controls.',
    Establishment: 'This sets up establishment and labour footing for the business.',
    'Data governance': 'This keeps digital-business and contract operations reviewable.',
    Factory: 'This controls industrial setup and production law exposure.',
    Utility: 'This handles power and installation readiness.',
    'Healthcare establishment': 'This handles health-facility permissioning.',
    'Biomedical waste': 'This controls healthcare waste and disposal traceability.',
    'Special modules': 'This catches specialty services that need separate review.',
    'Education approval': 'This controls recognition, affiliation, and institution legitimacy.',
    'Campus safety': 'This keeps student and campus operations safe and reviewable.',
    'Campus operations': 'This maps extra campus modules such as labs, hostels, and canteens.'
  };
  return map[category] || 'This item affects whether the business can operate cleanly and prove compliance later.';
}

function dimensionsForRequirement(definition) {
  const map = {
    Corporate: ['corporate', 'policies'],
    Tax: ['tax', 'renewals'],
    'CA and audit': ['tax', 'renewals'],
    'State tax': ['tax', 'renewals'],
    Payroll: ['people', 'renewals'],
    Governance: ['policies', 'renewals'],
    'Food safety': ['sector', 'renewals'],
    'Sector licence and authority approvals': ['sector', 'renewals'],
    'Local operations': ['premises', 'sector'],
    Safety: ['safety', 'premises'],
    'Gas and hazardous storage': ['safety', 'sector'],
    Environment: ['environment', 'renewals'],
    Establishment: ['people', 'premises'],
    'Data governance': ['policies', 'commercial'],
    Factory: ['sector', 'safety'],
    Utility: ['premises', 'safety'],
    'Healthcare establishment': ['sector', 'renewals'],
    'Biomedical waste': ['environment', 'sector'],
    'Special modules': ['sector', 'policies'],
    'Education approval': ['sector', 'renewals'],
    'Campus safety': ['safety', 'people'],
    'Campus operations': ['premises', 'policies'],
    Commercial: ['commercial', 'tax'],
    Policies: ['policies', 'people'],
    Enforcement: ['renewals', 'policies'],
    Renewals: ['renewals', 'policies']
  };
  return map[definition.category] || ['policies'];
}

function sourceList(primary, extraSources = []) {
  return [primary, ...extraSources].filter(Boolean);
}

function recurrenceFor(requirementId, profile) {
  if (requirementId === 'gst-position') return 'Registration once; returns and reconciliations recur.';
  if (requirementId === 'professional-tax') return 'Registration once; payments and returns recur.';
  if (requirementId === 'income-tax-books') return 'Monthly close plus annual tax and audit cycle.';
  if (requirementId === 'labour-payroll') return profile.employees > 0 ? 'Monthly payroll and periodic labour filings.' : 'Review again before first hire.';
  if (requirementId.includes('fssai')) return 'Licence / registration validity cycle plus ongoing food-safety records.';
  if (requirementId.includes('excise')) return 'Licence validity cycle plus outlet-condition and renewal tracking.';
  if (requirementId.includes('fire')) return 'Initial clearance / review plus renewal and inspection readiness.';
  if (requirementId.includes('pollution') || requirementId.includes('bmw')) return 'Authorization / consent cycle plus ongoing records.';
  return 'Track at setup and review whenever the business model, premises, or scale changes.';
}

function prereqBlockers(prereqFlags, flags) {
  return prereqFlags.filter((flag) => !flags[flag]).map((flag) => `Missing prerequisite: ${humanFlag(flag)}`);
}

function humanFlag(flag) {
  const map = {
    incorporated: 'entity / incorporation proof',
    bankReady: 'bank and signatory setup',
    gstRegistered: 'GST profile',
    ptRegistered: 'professional-tax profile',
    labourRegistered: 'labour / establishment setup',
    epfoRegistered: 'EPFO registration',
    esicRegistered: 'ESIC registration'
  };
  return map[flag] || flag;
}

function activeStatusForStage(stage) {
  if (stage === 'idea') return 'Plan now';
  if (stage === 'pre-launch' || stage === 'incorporating') return 'Open now';
  if (stage === 'operating') return 'Live gap';
  if (stage === 'expanding') return 'Scale review';
  return 'Needs facts first';
}

function fieldMap(label, value) {
  return { label, value: clean(value) || 'Collect and verify' };
}

function connector(name, fit, why) {
  return { name, fit, why };
}

function source(id, name, url, relevance, jurisdiction) {
  return {
    id,
    name,
    url,
    sourceType: 'official source',
    tier: 'Tier 1',
    authorityLevel: 1,
    relevance,
    jurisdiction,
    lastVerified: '2026-04-08',
    freshness: 'Verify live portal workflow before submission',
    humanCheck: 'Use the current live portal and the business facts before filing.'
  };
}

function sector(id, name, category, summary, aliases, packageIds) {
  return { id, name, category, summary, aliases, packageIds };
}

function pkg(id, name, summary, sourceIds) {
  return { id, name, summary, sourceIds };
}

function dimension(id, name, summary) {
  return { id, name, summary };
}

function requirementDef(input) {
  return {
    applies: () => true,
    completionFlags: [],
    prereqFlags: [],
    extraSources: [],
    ...input
  };
}

function dedupeSources(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function truthy(value) {
  return value === true || value === 'on' || String(value || '').toLowerCase() === 'yes' || String(value || '').toLowerCase() === 'true';
}

function clean(value) {
  return typeof value === 'string' ? value.trim() : String(value || '').trim();
}

function normalize(value) {
  return String(value || '').replace(/\r/g, '').replace(/[ \t]+/g, ' ').trim();
}

function formatLocation(profile) {
  return [profile.city, profile.state].filter(Boolean).join(', ');
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

module.exports = {
  buildComplianceManagerPlan,
  buildLibraryPayload,
  complianceDimensions,
  compliancePackages,
  listSectorProfiles,
  officialSectorSources,
  sectorProfiles
};
