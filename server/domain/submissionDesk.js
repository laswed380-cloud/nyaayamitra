function buildSubmissionPacket(input = {}) {
  const title = clean(input.title) || 'Authority submission packet';
  const authority = clean(input.authority) || 'Authority';
  const portalName = clean(input.portalName) || 'Portal to be confirmed';
  const portalUrl = clean(input.portalUrl) || '';
  const businessName = clean(input.businessName) || 'the business';
  const forms = normalizeList(input.forms || input.formList || '');
  const documentsRequired = normalizeList(input.documentsRequired || input.documents || '');
  const evidenceChecklist = normalizeList(input.evidenceChecklist || input.evidence || '');
  const dueInDays = Number(input.dueInDays || 5);

  return {
    title,
    summary: `${title} prepared for ${businessName}. This packet organizes what to review before submission, what to upload, what proof to preserve, and how to follow up after the authority issues a reference number.`,
    authority,
    portalName,
    portalUrl,
    businessName,
    status: 'Drafting packet',
    reviewStatus: 'Pending internal review',
    dueAtHint: `Target filing window: ${Math.max(1, dueInDays)} day${dueInDays === 1 ? '' : 's'}`,
    packetStages: [
      'Prepare application fields and attachments',
      'Run founder / authorized-signatory review',
      'Run CA / auditor / sector-specialist review where needed',
      'Submit on the live portal',
      'Record the ARN / SRN / acknowledgment / application number',
      'Store certificate, challan, final PDF, and screenshots',
      'Set follow-up and renewal reminders'
    ],
    forms: forms.length ? forms : ['Application form to be confirmed'],
    documentsRequired: documentsRequired.length ? documentsRequired : ['Supporting documents to be confirmed'],
    evidenceChecklist: evidenceChecklist.length ? evidenceChecklist : ['Application PDF', 'Acknowledgement / reference number', 'Certificate / response copy'],
    submissionChecklist: [
      'Check legal name, entity type, address, and signatory details against source documents.',
      'Check the authority portal, category, and jurisdiction one more time before uploading.',
      'Stop if any attachment, address, or owner detail is inconsistent across the packet.',
      'After submit, record the reference number immediately before closing the browser tab.',
      'Create a follow-up date and owner before marking the task as submitted.'
    ],
    reviewChecklist: [
      'Founder or authorized signatory signoff',
      'CA / auditor / legal or sector specialist review where applicable',
      'Premises / activity facts reviewed against the live portal category',
      'Evidence folder opened before submission'
    ],
    followUpPlan: [
      'Capture ARN / SRN / acknowledgment / application number',
      'Upload screenshots and final filed PDF to the submission folder',
      'Set the next follow-up date based on the authority timeline',
      'Respond to notices, queries, or inspections from the same folder and thread'
    ],
    emailDrafts: [
      {
        title: 'Internal review handoff',
        subject: `${businessName} - review ${title}`,
        body:
          `Please review the attached ${title} packet for ${businessName}. Confirm the authority route, uploaded documents, signatory details, and stop checks before live submission on ${portalName}.`
      },
      {
        title: 'Authority / portal follow-up note',
        subject: `${businessName} - follow-up on ${title}`,
        body:
          `We are following up on the ${title} submitted for ${businessName}. Please refer to the application / acknowledgment number once available. Supporting documents and prior correspondence are organized in the submission folder.`
      }
    ],
    guardrails: {
      assistiveOnly: true,
      humanReviewRequired: true,
      submissionTruthfulness: 'Do not mark the item as submitted until a real portal submission happens and the reference number is recorded.',
      secretPolicy: 'Keep portal credentials, OTPs, and e-sign controls outside source files and chat logs.'
    }
  };
}

function clean(value) {
  return typeof value === 'string' ? value.trim() : String(value || '').trim();
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => clean(item)).filter(Boolean);
  }
  return String(value || '')
    .split(/\r?\n|,/)
    .map((item) => clean(item))
    .filter(Boolean);
}

module.exports = {
  buildSubmissionPacket
};
