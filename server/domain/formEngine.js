/* ================================================================
   formEngine.js — Indian Government Form Engine for NyaayaMitra
   Comprehensive form templates, prefill logic, package generation,
   and professional HTML rendering for all major compliance forms.
   ================================================================ */

const lastVerified = '2026-04-08';

// ---------------------------------------------------------------------------
// FORM TEMPLATES
// ---------------------------------------------------------------------------

const FORM_TEMPLATES = {};

// ===========================
// 1. SPICe+ Part A (INC-32) — Name Reservation
// ===========================
FORM_TEMPLATES['spice-plus-a'] = {
  id: 'spice-plus-a',
  name: 'SPICe+ Part A \u2014 Name Reservation (INC-32)',
  authority: 'Ministry of Corporate Affairs (MCA)',
  portalUrl: 'https://www.mca.gov.in/MinistryV2/spiceplusform.html',
  description: 'Application for reservation of a name for a new company under Section 4(4) and 4(5)(i) of the Companies Act, 2013. Part A of the integrated SPICe+ form handles name approval before Part B (incorporation) can proceed.',
  sections: [
    {
      title: 'Type of Entity',
      fields: [
        { id: 'entity_type', label: 'Type of Company', type: 'select', options: ['Private Limited Company', 'One Person Company (OPC)', 'Public Limited Company', 'Producer Company', 'Section 8 Company'], required: true, helpText: 'Select the type of company to be incorporated.', prefillFrom: 'profile.entityType', defaultValue: 'Private Limited Company' },
        { id: 'company_category', label: 'Company Category', type: 'select', options: ['Company limited by shares', 'Company limited by guarantee', 'Unlimited company'], required: true, helpText: 'Most companies are limited by shares.', prefillFrom: '', defaultValue: 'Company limited by shares' },
        { id: 'company_sub_category', label: 'Company Sub-category', type: 'select', options: ['Non-government company', 'Government company', 'Subsidiary of foreign company'], required: true, helpText: 'Choose Non-government company for most private entities.', prefillFrom: '', defaultValue: 'Non-government company' }
      ]
    },
    {
      title: 'Proposed Name(s)',
      fields: [
        { id: 'proposed_name_1', label: 'Proposed Name 1 (First Preference)', type: 'text', required: true, helpText: 'The desired company name. Must end with "Private Limited" for private companies. Avoid names identical or too similar to existing companies.', prefillFrom: 'profile.businessName', defaultValue: '' },
        { id: 'proposed_name_1_significance', label: 'Significance / Meaning of Name 1', type: 'textarea', required: true, helpText: 'Explain the meaning or derivation of the proposed name and why it was chosen.', prefillFrom: '', defaultValue: '' },
        { id: 'proposed_name_2', label: 'Proposed Name 2 (Second Preference)', type: 'text', required: false, helpText: 'Alternative name in case the first choice is rejected.', prefillFrom: '', defaultValue: '' },
        { id: 'proposed_name_2_significance', label: 'Significance / Meaning of Name 2', type: 'textarea', required: false, helpText: 'Explain the meaning or derivation of this alternative name.', prefillFrom: '', defaultValue: '' },
        { id: 'trademark_applied', label: 'Whether trademark application has been filed for the proposed name', type: 'radio', options: ['Yes', 'No'], required: true, helpText: 'Indicate if you have filed a trademark application for any of the proposed names.', prefillFrom: '', defaultValue: 'No' },
        { id: 'trademark_details', label: 'Trademark Application Number (if applicable)', type: 'text', required: false, helpText: 'Enter the trademark application number if filed.', prefillFrom: '', defaultValue: '' }
      ]
    },
    {
      title: 'Main Division of Industrial Activity',
      fields: [
        { id: 'nic_code_main', label: 'NIC Code (Main Business Activity)', type: 'text', required: true, helpText: 'National Industrial Classification code for your primary business activity. Available at mospi.gov.in.', prefillFrom: 'profile.nicCode', defaultValue: '' },
        { id: 'nic_description', label: 'Description of Main Activity', type: 'textarea', required: true, helpText: 'Describe the main business activity in detail.', prefillFrom: 'profile.businessActivity', defaultValue: '' },
        { id: 'nic_code_secondary', label: 'NIC Code (Secondary Business Activity)', type: 'text', required: false, helpText: 'NIC code for any secondary business activity if applicable.', prefillFrom: '', defaultValue: '' }
      ]
    },
    {
      title: 'Registered Office State',
      fields: [
        { id: 'state', label: 'State / Union Territory where the Registered Office will be situated', type: 'select', options: ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'], required: true, helpText: 'Select the state where the company registered office will be located. This determines the ROC jurisdiction.', prefillFrom: 'profile.state', defaultValue: '' },
        { id: 'roc_jurisdiction', label: 'Registrar of Companies (ROC) Jurisdiction', type: 'text', required: true, helpText: 'Automatically determined based on the state. E.g., ROC Bangalore for Karnataka.', prefillFrom: '', defaultValue: '' }
      ]
    }
  ],
  fees: { amount: 1000, description: 'Rs.1,000 for name reservation. Additional stamp duty varies by state at Part B stage.' },
  timeline: '1-3 working days for name approval',
  prerequisites: ['DSC (Digital Signature Certificate) of at least one proposed director', 'DIN (Director Identification Number) of at least one proposed director (can be applied simultaneously in Part B)', 'Approved RUN (Reserve Unique Name) is now integrated into SPICe+ Part A'],
  postSubmission: ['On name approval, proceed to SPICe+ Part B within 20 days', 'If name is rejected, re-apply with different name choices'],
  portalSteps: [
    'Go to mca.gov.in and log in with your MCA account',
    'Navigate to MCA Services > Company Services > SPICe+ (Simplified Proforma for Incorporating Company Electronically Plus)',
    'Select "Part A - Name Reservation"',
    'Fill in entity type, proposed names, NIC code, and state',
    'Attach DSC of the professional (CA/CS/CMA) certifying the form',
    'Pay the filing fee online',
    'Note the SRN (Service Request Number) for tracking',
    'Check status under "Track SRN" on the MCA portal'
  ]
};

// ===========================
// 2. SPICe+ Part B — Full Incorporation
// ===========================
FORM_TEMPLATES['spice-plus-b'] = {
  id: 'spice-plus-b',
  name: 'SPICe+ Part B \u2014 Company Incorporation (INC-32)',
  authority: 'Ministry of Corporate Affairs (MCA)',
  portalUrl: 'https://www.mca.gov.in/MinistryV2/spiceplusform.html',
  description: 'Integrated incorporation form under Section 7 of the Companies Act, 2013. Part B is the main incorporation application that covers company details, directors, subscribers, capital structure, registered office, and enables linked applications for PAN, TAN, GST, EPFO, ESIC, and Shops Act through AGILE-PRO-S.',
  sections: [
    {
      title: 'Company Name',
      fields: [
        { id: 'approved_name', label: 'Approved Company Name (from Part A)', type: 'text', required: true, helpText: 'Enter the company name exactly as approved in Part A. Copy from the name approval letter.', prefillFrom: 'profile.businessName', defaultValue: '' },
        { id: 'name_approval_srn', label: 'Part A SRN / Name Approval Number', type: 'text', required: true, helpText: 'The SRN received after Part A name approval.', prefillFrom: '', defaultValue: '' }
      ]
    },
    {
      title: 'Company Details',
      fields: [
        { id: 'entity_type', label: 'Type of Company', type: 'select', options: ['Private Limited Company', 'One Person Company (OPC)', 'Public Limited Company', 'Producer Company', 'Section 8 Company'], required: true, helpText: 'Must match the type chosen in Part A.', prefillFrom: 'profile.entityType', defaultValue: 'Private Limited Company' },
        { id: 'company_category', label: 'Company Category', type: 'select', options: ['Company limited by shares', 'Company limited by guarantee', 'Unlimited company'], required: true, helpText: 'Must match Part A selection.', prefillFrom: '', defaultValue: 'Company limited by shares' },
        { id: 'company_sub_category', label: 'Company Sub-category', type: 'select', options: ['Non-government company', 'Government company', 'Subsidiary of foreign company'], required: true, helpText: 'Must match Part A selection.', prefillFrom: '', defaultValue: 'Non-government company' },
        { id: 'nic_code', label: 'NIC Code (Main Business Activity)', type: 'text', required: true, helpText: 'National Industrial Classification code.', prefillFrom: 'profile.nicCode', defaultValue: '' },
        { id: 'business_activity_description', label: 'Description of Main Business Activity', type: 'textarea', required: true, helpText: 'Detailed description of business activity.', prefillFrom: 'profile.businessActivity', defaultValue: '' },
        { id: 'object_clause', label: 'Object Clause of the Company (Main Objects)', type: 'textarea', required: true, helpText: 'Define the main objects for which the company is being incorporated. This will appear in the MOA.', prefillFrom: 'profile.objectClause', defaultValue: '' },
        { id: 'object_incidental', label: 'Objects Incidental or Ancillary to Main Objects', type: 'textarea', required: false, helpText: 'Define secondary / ancillary objects.', prefillFrom: '', defaultValue: '' }
      ]
    },
    {
      title: 'Capital Structure',
      fields: [
        { id: 'authorized_capital', label: 'Authorized Share Capital (Rs.)', type: 'number', required: true, helpText: 'Maximum capital the company is authorized to issue. Minimum Rs. 1,00,000 for private limited.', prefillFrom: 'profile.authorizedCapital', defaultValue: '100000' },
        { id: 'paid_up_capital', label: 'Paid-up Share Capital (Rs.)', type: 'number', required: true, helpText: 'Amount of capital actually paid by subscribers.', prefillFrom: 'profile.paidUpCapital', defaultValue: '100000' },
        { id: 'number_of_equity_shares', label: 'Number of Equity Shares', type: 'number', required: true, helpText: 'Total number of equity shares.', prefillFrom: 'profile.numberOfShares', defaultValue: '10000' },
        { id: 'face_value_per_share', label: 'Nominal / Face Value per Share (Rs.)', type: 'number', required: true, helpText: 'Face value of each share. Commonly Rs. 10.', prefillFrom: '', defaultValue: '10' },
        { id: 'premium_per_share', label: 'Premium per Share (Rs.), if any', type: 'number', required: false, helpText: 'Share premium amount per share, if shares are issued at premium.', prefillFrom: '', defaultValue: '0' },
        { id: 'preference_shares', label: 'Number of Preference Shares (if any)', type: 'number', required: false, helpText: 'Only if the company issues preference shares.', prefillFrom: '', defaultValue: '0' },
        { id: 'preference_face_value', label: 'Face Value of Preference Shares (Rs.)', type: 'number', required: false, helpText: 'Face value per preference share.', prefillFrom: '', defaultValue: '0' }
      ]
    },
    {
      title: 'Registered Office Address',
      fields: [
        { id: 'address_line_1', label: 'Address Line 1 (Flat / Door / Building)', type: 'text', required: true, helpText: 'Flat number, door number, building name.', prefillFrom: 'profile.addressLine1', defaultValue: '' },
        { id: 'address_line_2', label: 'Address Line 2 (Road / Street / Lane)', type: 'text', required: false, helpText: 'Road name, street, lane.', prefillFrom: 'profile.addressLine2', defaultValue: '' },
        { id: 'city', label: 'City / Town / Village', type: 'text', required: true, helpText: 'City or town name.', prefillFrom: 'profile.city', defaultValue: '' },
        { id: 'state', label: 'State', type: 'select', options: ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'], required: true, helpText: 'State of registered office.', prefillFrom: 'profile.state', defaultValue: '' },
        { id: 'district', label: 'District', type: 'text', required: true, helpText: 'District name.', prefillFrom: 'profile.district', defaultValue: '' },
        { id: 'pincode', label: 'PIN Code', type: 'text', required: true, helpText: '6-digit PIN code.', prefillFrom: 'profile.pincode', defaultValue: '', validation: 'pin' },
        { id: 'phone', label: 'Phone Number', type: 'text', required: true, helpText: 'STD code with phone number or mobile number.', prefillFrom: 'profile.phone', defaultValue: '', validation: 'phone' },
        { id: 'email', label: 'Email Address', type: 'text', required: true, helpText: 'Official email address for the company.', prefillFrom: 'profile.email', defaultValue: '', validation: 'email' },
        { id: 'proof_of_office', label: 'Proof of Registered Office Address', type: 'select', options: ['Utility Bill (not older than 2 months)', 'Property Tax Receipt', 'Rent Agreement with NOC from owner', 'Sale Deed / Registry Copy', 'Lease Agreement'], required: true, helpText: 'Document to be uploaded as proof of the registered office.', prefillFrom: '', defaultValue: 'Rent Agreement with NOC from owner' },
        { id: 'office_ownership', label: 'Office Premises Ownership Status', type: 'select', options: ['Owned', 'Rented', 'Leased'], required: true, helpText: 'Whether the registered office is owned, rented, or leased.', prefillFrom: '', defaultValue: 'Rented' }
      ]
    },
    {
      title: 'Director 1 Details',
      fields: [
        { id: 'dir1_din', label: 'DIN (Director Identification Number)', type: 'text', required: true, helpText: 'Existing DIN or leave blank to apply for new DIN through this form. 8-digit number.', prefillFrom: 'profile.directors[0].din', defaultValue: '', validation: 'din' },
        { id: 'dir1_first_name', label: 'First Name', type: 'text', required: true, helpText: 'As per PAN card.', prefillFrom: 'profile.directors[0].firstName', defaultValue: '' },
        { id: 'dir1_middle_name', label: 'Middle Name', type: 'text', required: false, helpText: 'As per PAN card.', prefillFrom: 'profile.directors[0].middleName', defaultValue: '' },
        { id: 'dir1_last_name', label: 'Last Name / Surname', type: 'text', required: true, helpText: 'As per PAN card.', prefillFrom: 'profile.directors[0].lastName', defaultValue: '' },
        { id: 'dir1_father_name', label: "Father's Name", type: 'text', required: true, helpText: "Father's full name.", prefillFrom: 'profile.directors[0].fatherName', defaultValue: '' },
        { id: 'dir1_dob', label: 'Date of Birth', type: 'date', required: true, helpText: 'As per PAN card / Aadhaar.', prefillFrom: 'profile.directors[0].dob', defaultValue: '' },
        { id: 'dir1_gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true, helpText: 'Gender of the director.', prefillFrom: 'profile.directors[0].gender', defaultValue: '' },
        { id: 'dir1_nationality', label: 'Nationality', type: 'text', required: true, helpText: 'Indian / other nationality.', prefillFrom: 'profile.directors[0].nationality', defaultValue: 'Indian' },
        { id: 'dir1_pan', label: 'PAN', type: 'text', required: true, helpText: '10-character PAN number. Mandatory for Indian nationals.', prefillFrom: 'profile.directors[0].pan', defaultValue: '', validation: 'pan' },
        { id: 'dir1_aadhaar', label: 'Aadhaar Number', type: 'text', required: false, helpText: '12-digit Aadhaar number. Used for e-KYC.', prefillFrom: 'profile.directors[0].aadhaar', defaultValue: '' },
        { id: 'dir1_passport', label: 'Passport Number (for foreign nationals)', type: 'text', required: false, helpText: 'Required only for foreign nationals.', prefillFrom: 'profile.directors[0].passport', defaultValue: '' },
        { id: 'dir1_mobile', label: 'Mobile Number', type: 'text', required: true, helpText: 'Indian mobile number for OTP verification.', prefillFrom: 'profile.directors[0].mobile', defaultValue: '', validation: 'phone' },
        { id: 'dir1_email', label: 'Email Address', type: 'text', required: true, helpText: 'Personal email address (must be unique, not shared with other directors).', prefillFrom: 'profile.directors[0].email', defaultValue: '', validation: 'email' },
        { id: 'dir1_address_line_1', label: 'Residential Address Line 1', type: 'text', required: true, helpText: 'Flat/Door/Building.', prefillFrom: 'profile.directors[0].addressLine1', defaultValue: '' },
        { id: 'dir1_address_line_2', label: 'Residential Address Line 2', type: 'text', required: false, helpText: 'Road/Street/Lane.', prefillFrom: 'profile.directors[0].addressLine2', defaultValue: '' },
        { id: 'dir1_city', label: 'City', type: 'text', required: true, helpText: 'City of residence.', prefillFrom: 'profile.directors[0].city', defaultValue: '' },
        { id: 'dir1_state', label: 'State', type: 'text', required: true, helpText: 'State of residence.', prefillFrom: 'profile.directors[0].state', defaultValue: '' },
        { id: 'dir1_pincode', label: 'PIN Code', type: 'text', required: true, helpText: '6-digit PIN code.', prefillFrom: 'profile.directors[0].pincode', defaultValue: '', validation: 'pin' },
        { id: 'dir1_country', label: 'Country', type: 'text', required: true, helpText: 'Country of residence.', prefillFrom: 'profile.directors[0].country', defaultValue: 'India' },
        { id: 'dir1_occupation', label: 'Occupation', type: 'select', options: ['Business', 'Professional', 'Self-employed', 'Service', 'Homemaker', 'Student', 'Others'], required: true, helpText: 'Current occupation of the director.', prefillFrom: 'profile.directors[0].occupation', defaultValue: 'Business' },
        { id: 'dir1_educational_qualification', label: 'Educational Qualification', type: 'select', options: ['Graduate', 'Post Graduate', 'Doctorate', 'Professional (CA/CS/CMA/ICWA)', 'Under Graduate', 'Illiterate', 'Others'], required: true, helpText: 'Highest educational qualification.', prefillFrom: 'profile.directors[0].education', defaultValue: 'Graduate' },
        { id: 'dir1_shares_subscribed', label: 'Number of Shares Subscribed', type: 'number', required: true, helpText: 'Number of shares subscribed by this director in the MOA.', prefillFrom: 'profile.directors[0].sharesSubscribed', defaultValue: '' },
        { id: 'dir1_amount_paid', label: 'Amount Paid for Shares (Rs.)', type: 'number', required: true, helpText: 'Total amount paid for subscribed shares.', prefillFrom: 'profile.directors[0].amountPaid', defaultValue: '' },
        { id: 'dir1_designation', label: 'Designation', type: 'select', options: ['Director', 'Managing Director', 'Whole-time Director', 'Nominee Director', 'Additional Director'], required: true, helpText: 'Designation of the director in the company.', prefillFrom: 'profile.directors[0].designation', defaultValue: 'Director' },
        { id: 'dir1_dsc_registered', label: 'Whether DSC is registered on MCA portal', type: 'radio', options: ['Yes', 'No'], required: true, helpText: 'Digital Signature Certificate must be registered on the MCA portal before filing.', prefillFrom: '', defaultValue: 'Yes' }
      ]
    },
    {
      title: 'Director 2 Details',
      fields: [
        { id: 'dir2_din', label: 'DIN (Director Identification Number)', type: 'text', required: true, helpText: 'Existing DIN or leave blank to apply for new DIN through this form.', prefillFrom: 'profile.directors[1].din', defaultValue: '', validation: 'din' },
        { id: 'dir2_first_name', label: 'First Name', type: 'text', required: true, helpText: 'As per PAN card.', prefillFrom: 'profile.directors[1].firstName', defaultValue: '' },
        { id: 'dir2_middle_name', label: 'Middle Name', type: 'text', required: false, helpText: 'As per PAN card.', prefillFrom: 'profile.directors[1].middleName', defaultValue: '' },
        { id: 'dir2_last_name', label: 'Last Name / Surname', type: 'text', required: true, helpText: 'As per PAN card.', prefillFrom: 'profile.directors[1].lastName', defaultValue: '' },
        { id: 'dir2_father_name', label: "Father's Name", type: 'text', required: true, helpText: "Father's full name.", prefillFrom: 'profile.directors[1].fatherName', defaultValue: '' },
        { id: 'dir2_dob', label: 'Date of Birth', type: 'date', required: true, helpText: 'As per PAN card / Aadhaar.', prefillFrom: 'profile.directors[1].dob', defaultValue: '' },
        { id: 'dir2_gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true, helpText: 'Gender of the director.', prefillFrom: 'profile.directors[1].gender', defaultValue: '' },
        { id: 'dir2_nationality', label: 'Nationality', type: 'text', required: true, helpText: 'Indian / other nationality.', prefillFrom: 'profile.directors[1].nationality', defaultValue: 'Indian' },
        { id: 'dir2_pan', label: 'PAN', type: 'text', required: true, helpText: '10-character PAN number.', prefillFrom: 'profile.directors[1].pan', defaultValue: '', validation: 'pan' },
        { id: 'dir2_aadhaar', label: 'Aadhaar Number', type: 'text', required: false, helpText: '12-digit Aadhaar number.', prefillFrom: 'profile.directors[1].aadhaar', defaultValue: '' },
        { id: 'dir2_passport', label: 'Passport Number (for foreign nationals)', type: 'text', required: false, helpText: 'Required only for foreign nationals.', prefillFrom: 'profile.directors[1].passport', defaultValue: '' },
        { id: 'dir2_mobile', label: 'Mobile Number', type: 'text', required: true, helpText: 'Indian mobile number.', prefillFrom: 'profile.directors[1].mobile', defaultValue: '', validation: 'phone' },
        { id: 'dir2_email', label: 'Email Address', type: 'text', required: true, helpText: 'Personal email address.', prefillFrom: 'profile.directors[1].email', defaultValue: '', validation: 'email' },
        { id: 'dir2_address_line_1', label: 'Residential Address Line 1', type: 'text', required: true, helpText: 'Flat/Door/Building.', prefillFrom: 'profile.directors[1].addressLine1', defaultValue: '' },
        { id: 'dir2_address_line_2', label: 'Residential Address Line 2', type: 'text', required: false, helpText: 'Road/Street/Lane.', prefillFrom: 'profile.directors[1].addressLine2', defaultValue: '' },
        { id: 'dir2_city', label: 'City', type: 'text', required: true, helpText: 'City of residence.', prefillFrom: 'profile.directors[1].city', defaultValue: '' },
        { id: 'dir2_state', label: 'State', type: 'text', required: true, helpText: 'State of residence.', prefillFrom: 'profile.directors[1].state', defaultValue: '' },
        { id: 'dir2_pincode', label: 'PIN Code', type: 'text', required: true, helpText: '6-digit PIN code.', prefillFrom: 'profile.directors[1].pincode', defaultValue: '', validation: 'pin' },
        { id: 'dir2_country', label: 'Country', type: 'text', required: true, helpText: 'Country of residence.', prefillFrom: 'profile.directors[1].country', defaultValue: 'India' },
        { id: 'dir2_occupation', label: 'Occupation', type: 'select', options: ['Business', 'Professional', 'Self-employed', 'Service', 'Homemaker', 'Student', 'Others'], required: true, helpText: 'Current occupation.', prefillFrom: 'profile.directors[1].occupation', defaultValue: 'Business' },
        { id: 'dir2_educational_qualification', label: 'Educational Qualification', type: 'select', options: ['Graduate', 'Post Graduate', 'Doctorate', 'Professional (CA/CS/CMA/ICWA)', 'Under Graduate', 'Illiterate', 'Others'], required: true, helpText: 'Highest educational qualification.', prefillFrom: 'profile.directors[1].education', defaultValue: 'Graduate' },
        { id: 'dir2_shares_subscribed', label: 'Number of Shares Subscribed', type: 'number', required: true, helpText: 'Number of shares subscribed by this director.', prefillFrom: 'profile.directors[1].sharesSubscribed', defaultValue: '' },
        { id: 'dir2_amount_paid', label: 'Amount Paid for Shares (Rs.)', type: 'number', required: true, helpText: 'Total amount paid.', prefillFrom: 'profile.directors[1].amountPaid', defaultValue: '' },
        { id: 'dir2_designation', label: 'Designation', type: 'select', options: ['Director', 'Managing Director', 'Whole-time Director', 'Nominee Director', 'Additional Director'], required: true, helpText: 'Designation of the director.', prefillFrom: 'profile.directors[1].designation', defaultValue: 'Director' },
        { id: 'dir2_dsc_registered', label: 'Whether DSC is registered on MCA portal', type: 'radio', options: ['Yes', 'No'], required: true, helpText: 'DSC must be registered.', prefillFrom: '', defaultValue: 'Yes' }
      ]
    },
    {
      title: 'Memorandum of Association (MOA)',
      fields: [
        { id: 'moa_format', label: 'MOA Format / Table', type: 'select', options: ['Table B (Company limited by shares)', 'Table C (Company limited by guarantee and having share capital)', 'Table D (Company limited by guarantee and not having share capital)', 'Table E (Unlimited company)'], required: true, helpText: 'Select the appropriate MOA table based on company type.', prefillFrom: '', defaultValue: 'Table B (Company limited by shares)' },
        { id: 'main_objects', label: 'Main Objects (Clause III(A))', type: 'textarea', required: true, helpText: 'Define main objects. SPICe+ allows selection from a standard list or custom entry.', prefillFrom: 'profile.objectClause', defaultValue: '' },
        { id: 'liability_clause', label: 'Liability Clause', type: 'textarea', required: true, helpText: 'Standard liability clause for the MOA.', prefillFrom: '', defaultValue: 'The liability of the members is limited.' },
        { id: 'capital_clause', label: 'Capital Clause', type: 'textarea', required: true, helpText: 'Capital clause specifying authorized capital.', prefillFrom: '', defaultValue: '' }
      ]
    },
    {
      title: 'Articles of Association (AOA)',
      fields: [
        { id: 'aoa_type', label: 'AOA Type', type: 'select', options: ['Table F (As per Companies Act, 2013)', 'Custom AOA'], required: true, helpText: 'Most companies adopt Table F. Custom AOA can be drafted separately.', prefillFrom: '', defaultValue: 'Table F (As per Companies Act, 2013)' },
        { id: 'aoa_custom_clauses', label: 'Special / Custom Clauses (if Custom AOA)', type: 'textarea', required: false, helpText: 'Enter any special clauses to be added to the AOA.', prefillFrom: '', defaultValue: '' }
      ]
    },
    {
      title: 'Professional Certification',
      fields: [
        { id: 'professional_name', label: 'Name of the Certifying Professional', type: 'text', required: true, helpText: 'Name of the CA / CS / CMA certifying the form.', prefillFrom: 'profile.professionalName', defaultValue: '' },
        { id: 'professional_membership', label: 'Membership Number', type: 'text', required: true, helpText: 'ICAI / ICSI / ICMAI membership number.', prefillFrom: 'profile.professionalMembershipNo', defaultValue: '' },
        { id: 'professional_designation', label: 'Professional Designation', type: 'select', options: ['Chartered Accountant', 'Company Secretary', 'Cost Accountant'], required: true, helpText: 'Designation of the certifying professional.', prefillFrom: 'profile.professionalDesignation', defaultValue: 'Chartered Accountant' },
        { id: 'professional_cop', label: 'Certificate of Practice Number', type: 'text', required: true, helpText: 'COP number of the professional.', prefillFrom: 'profile.professionalCOP', defaultValue: '' }
      ]
    },
    {
      title: 'Stamp Duty Details',
      fields: [
        { id: 'stamp_duty_state', label: 'State for Stamp Duty Payment', type: 'text', required: true, helpText: 'Stamp duty varies by state. Paid electronically through MCA.', prefillFrom: 'profile.state', defaultValue: '' },
        { id: 'stamp_duty_amount_moa', label: 'Stamp Duty on MOA (Rs.)', type: 'number', required: true, helpText: 'Varies by state and authorized capital. Calculated by the portal.', prefillFrom: '', defaultValue: '' },
        { id: 'stamp_duty_amount_aoa', label: 'Stamp Duty on AOA (Rs.)', type: 'number', required: true, helpText: 'Varies by state. Calculated by the portal.', prefillFrom: '', defaultValue: '' }
      ]
    }
  ],
  fees: { amount: 500, description: 'Government fee: Rs. 500 for authorized capital up to Rs. 1,00,000. Higher fees for higher authorized capital. Stamp duty on MOA and AOA varies by state.' },
  timeline: '2-5 working days after name approval',
  prerequisites: ['Approved company name from SPICe+ Part A', 'DSC of all proposed directors (registered on MCA portal)', 'DIN of at least one director (or apply via this form)', 'NOC from property owner for registered office', 'Utility bill as proof of office (not older than 2 months)', 'Photographs of all directors (passport size)', 'Identity proof (PAN, Passport, Voter ID, Driving Licence) of all directors', 'Address proof (Aadhaar, Bank Statement, Utility Bill) of all directors', 'Declaration by the professional (INC-9)'],
  postSubmission: ['File INC-20A (Commencement of Business) within 180 days of incorporation', 'Open a bank account in the company name', 'Deposit the subscription money into the company bank account', 'Issue share certificates to subscribers', 'Hold the first board meeting within 30 days of incorporation', 'Appoint statutory auditor within 30 days of incorporation', 'File ADT-1 (Auditor Appointment) within 15 days of appointment'],
  portalSteps: [
    'Go to mca.gov.in and log in with your MCA account',
    'Navigate to MCA Services > Company Services > SPICe+ (INC-32)',
    'Select "Part B - Incorporation" and link to approved Part A SRN',
    'Fill in company details, capital structure, registered office address',
    'Add director details for each proposed director',
    'Fill in MOA and AOA details',
    'Fill in linked AGILE-PRO-S details (PAN, TAN, GST, EPFO, ESIC)',
    'Upload attachments: identity proofs, address proofs, photographs, office proof, declarations',
    'Attach DSC of each proposed director (affix in the designated order)',
    'Attach DSC of the certifying professional',
    'Verify all details and submit',
    'Pay the government fee and stamp duty online',
    'Note the SRN for tracking',
    'Download Certificate of Incorporation once approved'
  ]
};

// ===========================
// 3. AGILE-PRO-S
// ===========================
FORM_TEMPLATES['agile-pro-s'] = {
  id: 'agile-pro-s',
  name: 'AGILE-PRO-S \u2014 PAN, TAN, GSTIN, EPFO, ESIC, Shops Act',
  authority: 'Ministry of Corporate Affairs (MCA) / Multi-agency',
  portalUrl: 'https://www.mca.gov.in/MinistryV2/spiceplusform.html',
  description: 'Application for Goods and Services Tax Identification Number (GSTIN), Employees Provident Fund Organisation (EPFO) registration, Employees State Insurance Corporation (ESIC) registration, Permanent Account Number (PAN), Tax Deduction Account Number (TAN), and Shops and Establishment Act registration. Filed as part of SPICe+ Part B.',
  sections: [
    {
      title: 'PAN Application Details',
      fields: [
        { id: 'pan_applicant_name', label: 'Name of Applicant (Company Name)', type: 'text', required: true, helpText: 'Company name as approved in SPICe+ Part A.', prefillFrom: 'profile.businessName', defaultValue: '' },
        { id: 'pan_dob_incorporation', label: 'Date of Incorporation (auto-filled)', type: 'date', required: true, helpText: 'Will be the date of incorporation of the company.', prefillFrom: '', defaultValue: '' },
        { id: 'pan_source_of_income', label: 'Source of Income', type: 'select', options: ['Income from Business/Profession', 'Income from House Property', 'Capital Gains', 'Income from Other Sources'], required: true, helpText: 'Primary source of income for the company.', prefillFrom: '', defaultValue: 'Income from Business/Profession' },
        { id: 'pan_address', label: 'Address for PAN Communication', type: 'text', required: true, helpText: 'Registered office address of the company.', prefillFrom: 'profile.addressLine1', defaultValue: '' },
        { id: 'pan_ao_code', label: 'AO Code (Area Code / AO Type / Range Code / AO Number)', type: 'text', required: true, helpText: 'Assessing Officer code. Obtain from the Income Tax website or your CA.', prefillFrom: '', defaultValue: '' }
      ]
    },
    {
      title: 'TAN Application Details',
      fields: [
        { id: 'tan_applicant_name', label: 'Name of Applicant (Company Name)', type: 'text', required: true, helpText: 'Same as company name.', prefillFrom: 'profile.businessName', defaultValue: '' },
        { id: 'tan_category', label: 'Category of Deductor', type: 'select', options: ['Company', 'Firm', 'Government', 'Individual / HUF', 'Trust', 'Association of Persons', 'Body of Individuals', 'Local Authority', 'Artificial Juridical Person'], required: true, helpText: 'Select "Company" for a company.', prefillFrom: '', defaultValue: 'Company' },
        { id: 'tan_responsible_person', label: 'Name of Person Responsible for Deduction', type: 'text', required: true, helpText: 'Director or authorized person responsible for TDS.', prefillFrom: 'profile.directors[0].firstName', defaultValue: '' },
        { id: 'tan_responsible_designation', label: 'Designation of Responsible Person', type: 'text', required: true, helpText: 'Director / Managing Director.', prefillFrom: '', defaultValue: 'Director' }
      ]
    },
    {
      title: 'GST Registration Details',
      fields: [
        { id: 'gst_reason', label: 'Reason for Registration', type: 'select', options: ['Voluntary registration', 'Threshold limit exceeded', 'Inter-state supply', 'Casual taxable person', 'E-commerce operator', 'Input service distributor', 'TDS / TCS deductor', 'Non-resident taxable person'], required: true, helpText: 'Select the reason for GST registration. New companies typically choose voluntary or threshold.', prefillFrom: '', defaultValue: 'Voluntary registration' },
        { id: 'gst_constitution', label: 'Constitution of Business', type: 'select', options: ['Private Limited Company', 'Public Limited Company', 'One Person Company', 'Partnership Firm', 'LLP', 'Proprietorship', 'HUF', 'Society / Trust / Club', 'Government Department', 'Others'], required: true, helpText: 'Select the constitution matching your entity type.', prefillFrom: '', defaultValue: 'Private Limited Company' },
        { id: 'gst_state', label: 'State of Registration', type: 'text', required: true, helpText: 'State where principal place of business is located.', prefillFrom: 'profile.state', defaultValue: '' },
        { id: 'gst_principal_place', label: 'Address of Principal Place of Business', type: 'text', required: true, helpText: 'Same as registered office or separate business premises.', prefillFrom: 'profile.addressLine1', defaultValue: '' },
        { id: 'gst_hsn_1', label: 'HSN / SAC Code 1 (Primary Goods / Services)', type: 'text', required: true, helpText: 'Harmonized System of Nomenclature code for goods or SAC for services.', prefillFrom: 'profile.hsnCode', defaultValue: '' },
        { id: 'gst_hsn_description_1', label: 'Description of Primary Goods / Services', type: 'text', required: true, helpText: 'Describe the main goods or services.', prefillFrom: 'profile.businessActivity', defaultValue: '' },
        { id: 'gst_hsn_2', label: 'HSN / SAC Code 2 (Secondary, if any)', type: 'text', required: false, helpText: 'Additional HSN/SAC code.', prefillFrom: '', defaultValue: '' },
        { id: 'gst_bank_account', label: 'Bank Account Number', type: 'text', required: false, helpText: 'Company bank account. Can be added within 45 days of registration.', prefillFrom: 'profile.bankAccountNumber', defaultValue: '' },
        { id: 'gst_bank_ifsc', label: 'Bank IFSC Code', type: 'text', required: false, helpText: 'IFSC code of the bank branch.', prefillFrom: 'profile.bankIFSC', defaultValue: '' },
        { id: 'gst_bank_name', label: 'Bank Name', type: 'text', required: false, helpText: 'Name of the bank.', prefillFrom: 'profile.bankName', defaultValue: '' },
        { id: 'gst_authorized_signatory', label: 'Name of Authorized Signatory for GST', type: 'text', required: true, helpText: 'Director or authorized person.', prefillFrom: 'profile.directors[0].firstName', defaultValue: '' }
      ]
    },
    {
      title: 'EPFO Registration Details',
      fields: [
        { id: 'epfo_employer_name', label: 'Name of Employer / Establishment', type: 'text', required: true, helpText: 'Company name.', prefillFrom: 'profile.businessName', defaultValue: '' },
        { id: 'epfo_establishment_type', label: 'Type of Establishment', type: 'select', options: ['Factory', 'Shop', 'Establishment', 'Motor Transport', 'Newspaper', 'Plantation', 'Mine', 'Contractor', 'Others'], required: true, helpText: 'Select the establishment type.', prefillFrom: '', defaultValue: 'Establishment' },
        { id: 'epfo_activity', label: 'Nature of Business / Industry', type: 'text', required: true, helpText: 'Main business activity.', prefillFrom: 'profile.businessActivity', defaultValue: '' },
        { id: 'epfo_date_setup', label: 'Date of Setup', type: 'date', required: true, helpText: 'Date when the establishment was set up.', prefillFrom: 'profile.incorporationDate', defaultValue: '' },
        { id: 'epfo_num_employees', label: 'Number of Employees at the Time of Registration', type: 'number', required: true, helpText: 'EPFO is mandatory if 20 or more employees. Can register voluntarily with fewer.', prefillFrom: 'profile.employeeCount', defaultValue: '' },
        { id: 'epfo_wage_month', label: 'Month from which PF Contribution is Due', type: 'text', required: true, helpText: 'The month from which PF deductions begin.', prefillFrom: '', defaultValue: '' }
      ]
    },
    {
      title: 'ESIC Registration Details',
      fields: [
        { id: 'esic_employer_name', label: 'Name of Employer / Establishment', type: 'text', required: true, helpText: 'Company name.', prefillFrom: 'profile.businessName', defaultValue: '' },
        { id: 'esic_nature_of_business', label: 'Nature of Business / Activity', type: 'text', required: true, helpText: 'Main business activity.', prefillFrom: 'profile.businessActivity', defaultValue: '' },
        { id: 'esic_num_employees', label: 'Number of Employees', type: 'number', required: true, helpText: 'ESIC is mandatory if 10 or more employees (in some states 20). Applies to employees earning up to Rs. 21,000/month.', prefillFrom: 'profile.employeeCount', defaultValue: '' },
        { id: 'esic_date_coverage', label: 'Date from which ESIC Coverage is Applicable', type: 'date', required: true, helpText: 'Date when employee count reached the threshold.', prefillFrom: '', defaultValue: '' }
      ]
    },
    {
      title: 'Shops and Establishment Act Details',
      fields: [
        { id: 'shops_act_name', label: 'Name of Establishment', type: 'text', required: true, helpText: 'Company / business name.', prefillFrom: 'profile.businessName', defaultValue: '' },
        { id: 'shops_act_category', label: 'Category of Establishment', type: 'select', options: ['Shop', 'Commercial Establishment', 'Residential Hotel', 'Restaurant / Eating House', 'Theatre / Cinema', 'Others'], required: true, helpText: 'Select the category.', prefillFrom: '', defaultValue: 'Commercial Establishment' },
        { id: 'shops_act_employer_name', label: 'Name of Employer / Occupier', type: 'text', required: true, helpText: 'Director or authorized person.', prefillFrom: 'profile.directors[0].firstName', defaultValue: '' },
        { id: 'shops_act_address', label: 'Address of Establishment', type: 'text', required: true, helpText: 'Business premises address.', prefillFrom: 'profile.addressLine1', defaultValue: '' },
        { id: 'shops_act_num_employees', label: 'Number of Employees', type: 'number', required: true, helpText: 'Total employees at this location.', prefillFrom: 'profile.employeeCount', defaultValue: '' },
        { id: 'shops_act_date_commencement', label: 'Date of Commencement of Business', type: 'date', required: true, helpText: 'Date when business operations began.', prefillFrom: 'profile.commencementDate', defaultValue: '' },
        { id: 'shops_act_working_hours', label: 'Daily Working Hours', type: 'text', required: true, helpText: 'E.g., 9:00 AM to 6:00 PM.', prefillFrom: '', defaultValue: '9:00 AM to 6:00 PM' },
        { id: 'shops_act_weekly_holiday', label: 'Weekly Holiday', type: 'select', options: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Alternate days'], required: true, helpText: 'Declared weekly holiday.', prefillFrom: '', defaultValue: 'Sunday' }
      ]
    }
  ],
  fees: { amount: 0, description: 'No additional fee for AGILE-PRO-S; it is part of the SPICe+ filing. Individual registrations (PAN, TAN, GST, EPFO, ESIC) are free when applied through SPICe+.' },
  timeline: 'PAN and TAN: 7-10 days. GST: 3-7 days. EPFO & ESIC: 2-5 days. Shops Act: state-dependent.',
  prerequisites: ['SPICe+ Part B must be filed simultaneously', 'Company bank account details (can be updated within 45 days for GST)', 'Employee details for EPFO and ESIC', 'Registered office proof'],
  postSubmission: ['Receive PAN card by post (usually 15-20 days)', 'Receive TAN allotment letter', 'Log in to GST portal and complete profile', 'Register on EPFO Unified Portal for employer', 'Register on ESIC portal and add employee details', 'Obtain Shops Act certificate from the local municipal body (if not auto-issued)'],
  portalSteps: [
    'AGILE-PRO-S is integrated within SPICe+ Part B on MCA portal',
    'Fill in the AGILE-PRO-S section while completing SPICe+ Part B',
    'Enter PAN, TAN, GST, EPFO, ESIC, and Shops Act details as prompted',
    'No separate filing is needed',
    'After SPICe+ approval, individual registrations are auto-processed',
    'Check respective portals for registration numbers'
  ]
};

// ===========================
// 4. INC-9 — Declaration by Subscribers
// ===========================
FORM_TEMPLATES['inc-9'] = {
  id: 'inc-9',
  name: 'INC-9 \u2014 Declaration by Subscribers and First Directors',
  authority: 'Ministry of Corporate Affairs (MCA)',
  portalUrl: 'https://www.mca.gov.in/MinistryV2/spiceplusform.html',
  description: 'Declaration by each subscriber to the MOA and each first director that they are not convicted of any offence, have not been found guilty of fraud, and the information provided in SPICe+ is true and correct. Required under Section 7(1)(c) of the Companies Act, 2013.',
  sections: [
    {
      title: 'Declaration by Subscriber / Director',
      fields: [
        { id: 'declarant_name', label: 'Full Name of Declarant', type: 'text', required: true, helpText: 'As per PAN / identity document.', prefillFrom: 'profile.directors[0].firstName', defaultValue: '' },
        { id: 'declarant_din', label: 'DIN (if director)', type: 'text', required: false, helpText: 'Enter DIN if the declarant is a proposed director.', prefillFrom: 'profile.directors[0].din', defaultValue: '', validation: 'din' },
        { id: 'declarant_father_name', label: "Father's / Husband's Name", type: 'text', required: true, helpText: "Father's or husband's name of the declarant.", prefillFrom: 'profile.directors[0].fatherName', defaultValue: '' },
        { id: 'declarant_dob', label: 'Date of Birth', type: 'date', required: true, helpText: 'As per identity proof.', prefillFrom: 'profile.directors[0].dob', defaultValue: '' },
        { id: 'declarant_nationality', label: 'Nationality', type: 'text', required: true, helpText: 'Nationality of the declarant.', prefillFrom: 'profile.directors[0].nationality', defaultValue: 'Indian' },
        { id: 'declarant_pan', label: 'PAN', type: 'text', required: true, helpText: 'PAN of the declarant.', prefillFrom: 'profile.directors[0].pan', defaultValue: '', validation: 'pan' },
        { id: 'declarant_address', label: 'Residential Address', type: 'textarea', required: true, helpText: 'Full residential address.', prefillFrom: 'profile.directors[0].addressLine1', defaultValue: '' },
        { id: 'company_name', label: 'Name of the Proposed Company', type: 'text', required: true, helpText: 'Name as approved in SPICe+ Part A.', prefillFrom: 'profile.businessName', defaultValue: '' },
        { id: 'shares_subscribed', label: 'Number of Shares Subscribed', type: 'number', required: true, helpText: 'Number of shares being subscribed by this person.', prefillFrom: 'profile.directors[0].sharesSubscribed', defaultValue: '' },
        { id: 'amount_paid', label: 'Total Amount to be Paid (Rs.)', type: 'number', required: true, helpText: 'Total subscription amount.', prefillFrom: 'profile.directors[0].amountPaid', defaultValue: '' },
        { id: 'no_conviction', label: 'I have not been convicted of any offence in connection with formation, promotion, management of any company', type: 'checkbox', required: true, helpText: 'Mandatory declaration. Check only if true.', prefillFrom: '', defaultValue: false },
        { id: 'no_fraud', label: 'I have not been found guilty of any fraud or misfeasance', type: 'checkbox', required: true, helpText: 'Mandatory declaration.', prefillFrom: '', defaultValue: false },
        { id: 'not_disqualified', label: 'I am not disqualified under Section 164 of the Companies Act', type: 'checkbox', required: true, helpText: 'Confirm that you are not disqualified from being a director.', prefillFrom: '', defaultValue: false },
        { id: 'all_info_correct', label: 'All information provided in the incorporation form is true and correct', type: 'checkbox', required: true, helpText: 'Confirm veracity of all information.', prefillFrom: '', defaultValue: false },
        { id: 'declaration_place', label: 'Place of Signing', type: 'text', required: true, helpText: 'City where the declaration is signed.', prefillFrom: 'profile.city', defaultValue: '' },
        { id: 'declaration_date', label: 'Date of Signing', type: 'date', required: true, helpText: 'Date of signing the declaration.', prefillFrom: '', defaultValue: '' }
      ]
    }
  ],
  fees: { amount: 0, description: 'No separate fee. Filed as part of SPICe+ Part B.' },
  timeline: 'Submitted with SPICe+ Part B',
  prerequisites: ['Must be signed individually by each subscriber and each first director', 'PAN and identity proof of each declarant', 'DSC of each declarant (affixed on SPICe+)'],
  postSubmission: ['Maintained in company records for inspection'],
  portalSteps: [
    'INC-9 is a declaration generated as part of SPICe+ Part B filing',
    'Each subscriber and first director must affirm the declarations',
    'Affix DSC of each declarant in the SPICe+ form',
    'No separate filing is required'
  ]
};

// ===========================
// 5. DIR-2 — Consent to Act as Director
// ===========================
FORM_TEMPLATES['dir-2'] = {
  id: 'dir-2',
  name: 'DIR-2 \u2014 Consent to Act as Director',
  authority: 'Ministry of Corporate Affairs (MCA)',
  portalUrl: 'https://www.mca.gov.in/MinistryV2/spiceplusform.html',
  description: 'Consent by a person to act as a director of a company. Required under Section 152(5) of the Companies Act, 2013. Every person appointed as director shall give consent in writing in DIR-2.',
  sections: [
    {
      title: 'Director Consent Details',
      fields: [
        { id: 'director_name', label: 'Full Name of Director', type: 'text', required: true, helpText: 'As per PAN card.', prefillFrom: 'profile.directors[0].firstName', defaultValue: '' },
        { id: 'director_din', label: 'DIN', type: 'text', required: true, helpText: '8-digit Director Identification Number.', prefillFrom: 'profile.directors[0].din', defaultValue: '', validation: 'din' },
        { id: 'director_father_name', label: "Father's Name", type: 'text', required: true, helpText: "Father's full name.", prefillFrom: 'profile.directors[0].fatherName', defaultValue: '' },
        { id: 'director_dob', label: 'Date of Birth', type: 'date', required: true, helpText: 'As per PAN / Aadhaar.', prefillFrom: 'profile.directors[0].dob', defaultValue: '' },
        { id: 'director_nationality', label: 'Nationality', type: 'text', required: true, helpText: 'Indian or other.', prefillFrom: 'profile.directors[0].nationality', defaultValue: 'Indian' },
        { id: 'director_pan', label: 'PAN', type: 'text', required: true, helpText: 'PAN of the director.', prefillFrom: 'profile.directors[0].pan', defaultValue: '', validation: 'pan' },
        { id: 'director_address', label: 'Residential Address', type: 'textarea', required: true, helpText: 'Full residential address.', prefillFrom: 'profile.directors[0].addressLine1', defaultValue: '' },
        { id: 'director_email', label: 'Email Address', type: 'text', required: true, helpText: 'Personal email.', prefillFrom: 'profile.directors[0].email', defaultValue: '', validation: 'email' },
        { id: 'director_mobile', label: 'Mobile Number', type: 'text', required: true, helpText: 'Mobile number.', prefillFrom: 'profile.directors[0].mobile', defaultValue: '', validation: 'phone' },
        { id: 'company_name', label: 'Name of the Company', type: 'text', required: true, helpText: 'Name of the company in which directorship is being accepted.', prefillFrom: 'profile.businessName', defaultValue: '' },
        { id: 'company_cin', label: 'CIN of the Company (if already incorporated)', type: 'text', required: false, helpText: 'Corporate Identification Number. Leave blank for new incorporation.', prefillFrom: 'profile.cin', defaultValue: '', validation: 'cin' },
        { id: 'designation', label: 'Designation', type: 'select', options: ['Director', 'Managing Director', 'Whole-time Director', 'Nominee Director', 'Additional Director', 'Alternate Director'], required: true, helpText: 'Designation being accepted.', prefillFrom: 'profile.directors[0].designation', defaultValue: 'Director' },
        { id: 'date_of_appointment', label: 'Date of Appointment / Proposed Date', type: 'date', required: true, helpText: 'Date on which directorship begins.', prefillFrom: '', defaultValue: '' },
        { id: 'other_directorships', label: 'List of Other Directorships Held', type: 'textarea', required: false, helpText: 'List CIN and name of other companies where this person is a director.', prefillFrom: '', defaultValue: '' },
        { id: 'consent_declaration', label: 'I hereby consent to act as a Director of the company and confirm that I am not disqualified from being a director', type: 'checkbox', required: true, helpText: 'Mandatory consent declaration.', prefillFrom: '', defaultValue: false },
        { id: 'consent_place', label: 'Place', type: 'text', required: true, helpText: 'City where consent is given.', prefillFrom: 'profile.city', defaultValue: '' },
        { id: 'consent_date', label: 'Date', type: 'date', required: true, helpText: 'Date of giving consent.', prefillFrom: '', defaultValue: '' }
      ]
    }
  ],
  fees: { amount: 0, description: 'No fee. Filed as part of SPICe+ or separately for existing companies.' },
  timeline: 'Must be obtained before or at the time of appointment',
  prerequisites: ['DIN of the director', 'PAN and identity proof', 'List of other directorships held'],
  postSubmission: ['Maintained in company records', 'Filed with ROC as part of incorporation or DIR-12 (for existing companies)'],
  portalSteps: [
    'DIR-2 is integrated within SPICe+ Part B for new companies',
    'For existing companies, file separately on MCA portal',
    'Each director must individually consent',
    'Affix DSC of the consenting director'
  ]
};

// ===========================
// 6. INC-20A — Commencement of Business
// ===========================
FORM_TEMPLATES['inc-20a'] = {
  id: 'inc-20a',
  name: 'INC-20A \u2014 Declaration for Commencement of Business',
  authority: 'Ministry of Corporate Affairs (MCA)',
  portalUrl: 'https://www.mca.gov.in/content/mca/global/en/e-Filing/e-filing.html',
  description: 'Declaration by a director that every subscriber to the MOA has paid the value of shares agreed to be taken, and the company has filed a verification of its registered office with the ROC. Must be filed within 180 days of incorporation under Section 10A of the Companies Act, 2013.',
  sections: [
    {
      title: 'Company Details',
      fields: [
        { id: 'company_name', label: 'Name of the Company', type: 'text', required: true, helpText: 'As per Certificate of Incorporation.', prefillFrom: 'profile.businessName', defaultValue: '' },
        { id: 'cin', label: 'CIN (Corporate Identification Number)', type: 'text', required: true, helpText: '21-character CIN allotted at incorporation.', prefillFrom: 'profile.cin', defaultValue: '', validation: 'cin' },
        { id: 'incorporation_date', label: 'Date of Incorporation', type: 'date', required: true, helpText: 'As per Certificate of Incorporation.', prefillFrom: 'profile.incorporationDate', defaultValue: '' },
        { id: 'registered_office', label: 'Registered Office Address', type: 'textarea', required: true, helpText: 'Full registered office address.', prefillFrom: 'profile.addressLine1', defaultValue: '' },
        { id: 'authorized_capital', label: 'Authorized Share Capital (Rs.)', type: 'number', required: true, helpText: 'As per MOA.', prefillFrom: 'profile.authorizedCapital', defaultValue: '' },
        { id: 'paid_up_capital', label: 'Paid-up Share Capital (Rs.)', type: 'number', required: true, helpText: 'Total paid-up capital.', prefillFrom: 'profile.paidUpCapital', defaultValue: '' }
      ]
    },
    {
      title: 'Declaration Details',
      fields: [
        { id: 'declarant_name', label: 'Name of Director Making the Declaration', type: 'text', required: true, helpText: 'Director who is certifying this form.', prefillFrom: 'profile.directors[0].firstName', defaultValue: '' },
        { id: 'declarant_din', label: 'DIN of the Declaring Director', type: 'text', required: true, helpText: '8-digit DIN.', prefillFrom: 'profile.directors[0].din', defaultValue: '', validation: 'din' },
        { id: 'subscribers_paid', label: 'Whether all subscribers have paid the value of shares agreed to be taken', type: 'radio', options: ['Yes', 'No'], required: true, helpText: 'Confirm that all subscription money has been deposited in the company bank account.', prefillFrom: '', defaultValue: 'Yes' },
        { id: 'bank_name', label: 'Name of Bank where Subscription Money is Deposited', type: 'text', required: true, helpText: 'Bank where the company bank account is held.', prefillFrom: 'profile.bankName', defaultValue: '' },
        { id: 'bank_account_number', label: 'Company Bank Account Number', type: 'text', required: true, helpText: 'Account number where subscription money is deposited.', prefillFrom: 'profile.bankAccountNumber', defaultValue: '' },
        { id: 'bank_statement_date', label: 'Date of Bank Statement Showing Deposit', type: 'date', required: true, helpText: 'Date of the bank statement showing receipt of subscription money.', prefillFrom: '', defaultValue: '' },
        { id: 'registered_office_verified', label: 'Whether verification of registered office (INC-22) has been filed', type: 'radio', options: ['Yes', 'No'], required: true, helpText: 'INC-22 must be filed within 30 days of incorporation. Confirm it has been filed.', prefillFrom: '', defaultValue: 'Yes' },
        { id: 'inc22_srn', label: 'SRN of INC-22 filing', type: 'text', required: false, helpText: 'SRN of the INC-22 form if already filed.', prefillFrom: '', defaultValue: '' },
        { id: 'declaration_place', label: 'Place', type: 'text', required: true, helpText: 'City where declaration is signed.', prefillFrom: 'profile.city', defaultValue: '' },
        { id: 'declaration_date', label: 'Date', type: 'date', required: true, helpText: 'Date of signing.', prefillFrom: '', defaultValue: '' }
      ]
    }
  ],
  fees: { amount: 500, description: 'Rs. 500 government filing fee.' },
  timeline: 'Must be filed within 180 days of incorporation. Penalty of Rs. 50,000 for the company and Rs. 1,000/day for each director for default.',
  prerequisites: ['Certificate of Incorporation', 'Company bank account opened', 'All subscription money deposited in company bank account', 'Bank statement showing the deposit', 'INC-22 (Verification of Registered Office) already filed', 'DSC of a director'],
  postSubmission: ['Company can commence business operations', 'Failure to file may lead to striking off by ROC'],
  portalSteps: [
    'Log in to MCA portal at mca.gov.in',
    'Navigate to e-Filing > Company Forms > INC-20A',
    'Enter CIN to auto-populate company details',
    'Fill in declaration details and bank statement information',
    'Upload bank statement showing receipt of subscription money',
    'Affix DSC of the declaring director',
    'Certify by a practicing professional (CA/CS/CMA)',
    'Pay the fee and submit',
    'Note the SRN for tracking'
  ]
};

// ===========================
// 7. DIR-3 KYC — Director KYC Annual
// ===========================
FORM_TEMPLATES['dir-3-kyc'] = {
  id: 'dir-3-kyc',
  name: 'DIR-3 KYC \u2014 Director Annual KYC',
  authority: 'Ministry of Corporate Affairs (MCA)',
  portalUrl: 'https://www.mca.gov.in/content/mca/global/en/e-Filing/e-filing.html',
  description: 'Annual KYC form for every individual who holds a DIN. Must be filed by September 30 every year. Failure to file leads to DIN deactivation and a penalty of Rs. 5,000 for re-activation. Required under Rule 12A of the Companies (Appointment and Qualification of Directors) Rules, 2014.',
  sections: [
    {
      title: 'Director Identification',
      fields: [
        { id: 'din', label: 'DIN', type: 'text', required: true, helpText: '8-digit DIN.', prefillFrom: 'profile.directors[0].din', defaultValue: '', validation: 'din' },
        { id: 'first_name', label: 'First Name', type: 'text', required: true, helpText: 'As per PAN.', prefillFrom: 'profile.directors[0].firstName', defaultValue: '' },
        { id: 'middle_name', label: 'Middle Name', type: 'text', required: false, helpText: 'As per PAN.', prefillFrom: 'profile.directors[0].middleName', defaultValue: '' },
        { id: 'last_name', label: 'Last Name / Surname', type: 'text', required: true, helpText: 'As per PAN.', prefillFrom: 'profile.directors[0].lastName', defaultValue: '' },
        { id: 'father_name', label: "Father's Name", type: 'text', required: true, helpText: "Father's full name.", prefillFrom: 'profile.directors[0].fatherName', defaultValue: '' },
        { id: 'dob', label: 'Date of Birth', type: 'date', required: true, helpText: 'As per PAN.', prefillFrom: 'profile.directors[0].dob', defaultValue: '' },
        { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true, helpText: 'Gender.', prefillFrom: 'profile.directors[0].gender', defaultValue: '' },
        { id: 'nationality', label: 'Nationality', type: 'text', required: true, helpText: 'Nationality.', prefillFrom: 'profile.directors[0].nationality', defaultValue: 'Indian' }
      ]
    },
    {
      title: 'Identity Verification',
      fields: [
        { id: 'pan', label: 'PAN', type: 'text', required: true, helpText: 'Mandatory for Indian nationals.', prefillFrom: 'profile.directors[0].pan', defaultValue: '', validation: 'pan' },
        { id: 'aadhaar', label: 'Aadhaar Number', type: 'text', required: true, helpText: 'Mandatory for Indian nationals. Aadhaar-based OTP verification is required.', prefillFrom: 'profile.directors[0].aadhaar', defaultValue: '' },
        { id: 'passport', label: 'Passport Number', type: 'text', required: false, helpText: 'Mandatory for foreign nationals.', prefillFrom: 'profile.directors[0].passport', defaultValue: '' },
        { id: 'voter_id', label: 'Voter ID Number', type: 'text', required: false, helpText: 'Optional additional identity proof.', prefillFrom: '', defaultValue: '' },
        { id: 'driving_licence', label: 'Driving Licence Number', type: 'text', required: false, helpText: 'Optional.', prefillFrom: '', defaultValue: '' }
      ]
    },
    {
      title: 'Contact Details',
      fields: [
        { id: 'mobile', label: 'Mobile Number (Indian)', type: 'text', required: true, helpText: 'Indian mobile number for OTP. Must be unique.', prefillFrom: 'profile.directors[0].mobile', defaultValue: '', validation: 'phone' },
        { id: 'email', label: 'Personal Email Address', type: 'text', required: true, helpText: 'Personal email. Must be unique. OTP sent to this email.', prefillFrom: 'profile.directors[0].email', defaultValue: '', validation: 'email' }
      ]
    },
    {
      title: 'Residential Address (Present)',
      fields: [
        { id: 'present_address_line_1', label: 'Address Line 1', type: 'text', required: true, helpText: 'Current residential address.', prefillFrom: 'profile.directors[0].addressLine1', defaultValue: '' },
        { id: 'present_address_line_2', label: 'Address Line 2', type: 'text', required: false, helpText: 'Road/Street.', prefillFrom: 'profile.directors[0].addressLine2', defaultValue: '' },
        { id: 'present_city', label: 'City / Town', type: 'text', required: true, helpText: 'City.', prefillFrom: 'profile.directors[0].city', defaultValue: '' },
        { id: 'present_state', label: 'State', type: 'text', required: true, helpText: 'State.', prefillFrom: 'profile.directors[0].state', defaultValue: '' },
        { id: 'present_pincode', label: 'PIN Code', type: 'text', required: true, helpText: '6-digit PIN code.', prefillFrom: 'profile.directors[0].pincode', defaultValue: '', validation: 'pin' },
        { id: 'present_country', label: 'Country', type: 'text', required: true, helpText: 'Country.', prefillFrom: 'profile.directors[0].country', defaultValue: 'India' }
      ]
    },
    {
      title: 'Residential Address (Permanent)',
      fields: [
        { id: 'permanent_same_as_present', label: 'Permanent address same as present?', type: 'radio', options: ['Yes', 'No'], required: true, helpText: 'If yes, permanent address fields will auto-fill.', prefillFrom: '', defaultValue: 'Yes' },
        { id: 'permanent_address_line_1', label: 'Address Line 1', type: 'text', required: false, helpText: 'Only if different from present.', prefillFrom: '', defaultValue: '' },
        { id: 'permanent_address_line_2', label: 'Address Line 2', type: 'text', required: false, helpText: 'Only if different.', prefillFrom: '', defaultValue: '' },
        { id: 'permanent_city', label: 'City / Town', type: 'text', required: false, helpText: 'Only if different.', prefillFrom: '', defaultValue: '' },
        { id: 'permanent_state', label: 'State', type: 'text', required: false, helpText: 'Only if different.', prefillFrom: '', defaultValue: '' },
        { id: 'permanent_pincode', label: 'PIN Code', type: 'text', required: false, helpText: 'Only if different.', prefillFrom: '', defaultValue: '', validation: 'pin' },
        { id: 'permanent_country', label: 'Country', type: 'text', required: false, helpText: 'Only if different.', prefillFrom: '', defaultValue: 'India' }
      ]
    },
    {
      title: 'Verification',
      fields: [
        { id: 'kyc_verification', label: 'I verify that the information provided is true and correct', type: 'checkbox', required: true, helpText: 'Mandatory verification.', prefillFrom: '', defaultValue: false },
        { id: 'kyc_place', label: 'Place', type: 'text', required: true, helpText: 'City.', prefillFrom: 'profile.city', defaultValue: '' },
        { id: 'kyc_date', label: 'Date', type: 'date', required: true, helpText: 'Date of filing.', prefillFrom: '', defaultValue: '' }
      ]
    }
  ],
  fees: { amount: 0, description: 'No fee if filed by September 30 deadline. Rs. 5,000 penalty for late filing (DIN deactivation and re-activation fee).' },
  timeline: 'Must be filed by September 30 every year. DIN gets deactivated on October 1 if not filed.',
  prerequisites: ['Active DIN', 'PAN card', 'Aadhaar card (for Indian nationals)', 'Passport (for foreign nationals)', 'DSC registered on MCA portal', 'Unique mobile number and email (not shared with other DIN holders)'],
  postSubmission: ['DIN remains active for the financial year', 'File again next year by September 30'],
  portalSteps: [
    'Log in to MCA portal at mca.gov.in',
    'If filing for the first time or details have changed: File DIR-3 KYC e-form',
    'If no details have changed from last year: Use DIR-3 KYC Web Service (simpler)',
    'Enter DIN to auto-populate existing details',
    'Update any changed information',
    'Verify mobile number via OTP',
    'Verify email via OTP',
    'Verify Aadhaar via OTP (for Indian nationals)',
    'Affix DSC',
    'Certify by a practicing professional (CA/CS/CMA) if using e-form',
    'Submit and note the SRN'
  ]
};

// ===========================
// 8. DSC Application Data Sheet
// ===========================
FORM_TEMPLATES['dsc-application'] = {
  id: 'dsc-application',
  name: 'DSC Application \u2014 Digital Signature Certificate Data Sheet',
  authority: 'Certifying Authority (e.g., eMudhra, Sify, nCode, CDAC)',
  portalUrl: 'https://www.mca.gov.in/MinistryV2/aboutdsc.html',
  description: 'Application form for obtaining a Class 3 Digital Signature Certificate (DSC). DSC is mandatory for directors to sign MCA e-forms, GST registration, Income Tax filing, and other government submissions.',
  sections: [
    {
      title: 'Applicant Details',
      fields: [
        { id: 'applicant_type', label: 'Applicant Type', type: 'select', options: ['Individual', 'Organisation'], required: true, helpText: 'Directors apply as Individual.', prefillFrom: '', defaultValue: 'Individual' },
        { id: 'first_name', label: 'First Name', type: 'text', required: true, helpText: 'Exactly as per PAN card.', prefillFrom: 'profile.directors[0].firstName', defaultValue: '' },
        { id: 'middle_name', label: 'Middle Name', type: 'text', required: false, helpText: 'As per PAN.', prefillFrom: 'profile.directors[0].middleName', defaultValue: '' },
        { id: 'last_name', label: 'Last Name / Surname', type: 'text', required: true, helpText: 'As per PAN.', prefillFrom: 'profile.directors[0].lastName', defaultValue: '' },
        { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true, helpText: 'Gender.', prefillFrom: 'profile.directors[0].gender', defaultValue: '' },
        { id: 'dob', label: 'Date of Birth', type: 'date', required: true, helpText: 'As per PAN / Aadhaar.', prefillFrom: 'profile.directors[0].dob', defaultValue: '' },
        { id: 'pan', label: 'PAN', type: 'text', required: true, helpText: 'PAN is mandatory for Indian nationals.', prefillFrom: 'profile.directors[0].pan', defaultValue: '', validation: 'pan' },
        { id: 'aadhaar', label: 'Aadhaar Number', type: 'text', required: true, helpText: 'For Aadhaar-based e-KYC (fastest method).', prefillFrom: 'profile.directors[0].aadhaar', defaultValue: '' },
        { id: 'mobile', label: 'Mobile Number', type: 'text', required: true, helpText: 'Mobile linked to Aadhaar for OTP verification.', prefillFrom: 'profile.directors[0].mobile', defaultValue: '', validation: 'phone' },
        { id: 'email', label: 'Email Address', type: 'text', required: true, helpText: 'Email for DSC delivery and communications.', prefillFrom: 'profile.directors[0].email', defaultValue: '', validation: 'email' },
        { id: 'address', label: 'Address', type: 'textarea', required: true, helpText: 'Full address as per identity proof.', prefillFrom: 'profile.directors[0].addressLine1', defaultValue: '' },
        { id: 'city', label: 'City', type: 'text', required: true, helpText: 'City.', prefillFrom: 'profile.directors[0].city', defaultValue: '' },
        { id: 'state', label: 'State', type: 'text', required: true, helpText: 'State.', prefillFrom: 'profile.directors[0].state', defaultValue: '' },
        { id: 'pincode', label: 'PIN Code', type: 'text', required: true, helpText: 'PIN code.', prefillFrom: 'profile.directors[0].pincode', defaultValue: '', validation: 'pin' }
      ]
    },
    {
      title: 'DSC Specifications',
      fields: [
        { id: 'dsc_class', label: 'DSC Class', type: 'select', options: ['Class 3 (Signing)', 'Class 3 (Signing + Encryption)'], required: true, helpText: 'Class 3 Signing is required for MCA and GST filings.', prefillFrom: '', defaultValue: 'Class 3 (Signing)' },
        { id: 'dsc_validity', label: 'Validity Period', type: 'select', options: ['1 Year', '2 Years', '3 Years'], required: true, helpText: 'Duration of the DSC. 2 years recommended for cost efficiency.', prefillFrom: '', defaultValue: '2 Years' },
        { id: 'dsc_type', label: 'DSC Token Type', type: 'select', options: ['USB Token', 'Cloud-based (paperless)'], required: true, helpText: 'USB token is traditional; cloud DSC allows signing from any device.', prefillFrom: '', defaultValue: 'USB Token' },
        { id: 'kyc_method', label: 'KYC Verification Method', type: 'select', options: ['Aadhaar e-KYC (OTP-based)', 'In-person verification', 'Video verification'], required: true, helpText: 'Aadhaar e-KYC is the fastest method (issued within hours).', prefillFrom: '', defaultValue: 'Aadhaar e-KYC (OTP-based)' }
      ]
    }
  ],
  fees: { amount: 1500, description: 'Approximately Rs. 800 - 2,500 depending on validity period, class, and certifying authority. Prices vary by provider.' },
  timeline: '1-3 working days (same day with Aadhaar e-KYC)',
  prerequisites: ['PAN card', 'Aadhaar card (for e-KYC)', 'Passport-size photograph', 'Mobile number linked to Aadhaar', 'Email address'],
  postSubmission: ['Register DSC on MCA portal under "Associate DSC"', 'Test DSC by signing a test document', 'Keep USB token safe (if physical)', 'Renew before expiry'],
  portalSteps: [
    'Choose a certifying authority: eMudhra (emudhra.com), Sify (safescrypt.com), nCode (ncodesolutions.com), CDAC',
    'Go to the certifying authority website',
    'Select Class 3 Signing Certificate',
    'Fill in the application form with personal details',
    'Choose KYC method (Aadhaar e-KYC recommended for speed)',
    'Complete OTP verification',
    'Make payment online',
    'Receive DSC on USB token or cloud token',
    'Register DSC on MCA portal: Login > My Profile > Associate DSC'
  ]
};

// ===========================
// 9. GST REG-01 — New Registration
// ===========================
FORM_TEMPLATES['gst-reg-01'] = {
  id: 'gst-reg-01',
  name: 'GST REG-01 \u2014 Application for New GST Registration',
  authority: 'Goods and Services Tax Network (GSTN)',
  portalUrl: 'https://www.gst.gov.in/',
  description: 'Application for registration under the Central Goods and Services Tax Act, 2017, and the State/Union Territory GST Act. Required for businesses with annual turnover exceeding Rs. 40 lakhs (goods) or Rs. 20 lakhs (services), or for voluntary registration. Multi-part application covering business details, promoter/partner details, authorized signatory, place of business, goods/services, bank accounts, and verification.',
  sections: [
    {
      title: 'Part A \u2014 Preliminary Information',
      fields: [
        { id: 'legal_name_pan', label: 'Legal Name of Business (as per PAN)', type: 'text', required: true, helpText: 'Legal name exactly as it appears on the PAN card of the business / company.', prefillFrom: 'profile.businessName', defaultValue: '' },
        { id: 'pan_number', label: 'PAN of the Business', type: 'text', required: true, helpText: 'PAN of the company / firm / individual.', prefillFrom: 'profile.pan', defaultValue: '', validation: 'pan' },
        { id: 'email', label: 'Email Address', type: 'text', required: true, helpText: 'Primary email for GST communications. OTP will be sent here.', prefillFrom: 'profile.email', defaultValue: '', validation: 'email' },
        { id: 'mobile', label: 'Mobile Number', type: 'text', required: true, helpText: 'Primary mobile number. OTP will be sent here.', prefillFrom: 'profile.phone', defaultValue: '', validation: 'phone' },
        { id: 'state', label: 'State / Union Territory', type: 'select', options: ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'], required: true, helpText: 'State where principal place of business is located.', prefillFrom: 'profile.state', defaultValue: '' },
        { id: 'district', label: 'District', type: 'text', required: true, helpText: 'District of principal place of business.', prefillFrom: 'profile.district', defaultValue: '' }
      ]
    },
    {
      title: 'Part B \u2014 Business Details',
      fields: [
        { id: 'trade_name', label: 'Trade Name (if different from legal name)', type: 'text', required: false, helpText: 'Brand name or trade name under which business is conducted.', prefillFrom: 'profile.tradeName', defaultValue: '' },
        { id: 'constitution_of_business', label: 'Constitution of Business', type: 'select', options: ['Private Limited Company', 'Public Limited Company', 'One Person Company', 'Partnership Firm', 'Limited Liability Partnership', 'Proprietorship', 'Hindu Undivided Family', 'Society / Trust / Club', 'Government Department', 'Public Sector Undertaking', 'Foreign Company', 'Unlimited Company', 'Others'], required: true, helpText: 'Select the legal constitution of the business.', prefillFrom: '', defaultValue: 'Private Limited Company' },
        { id: 'date_of_commencement', label: 'Date of Commencement of Business', type: 'date', required: true, helpText: 'Date on which business operations started or will start.', prefillFrom: 'profile.commencementDate', defaultValue: '' },
        { id: 'date_of_liability', label: 'Date on which Liability to Register Arose', type: 'date', required: true, helpText: 'Date when annual turnover crossed the threshold or inter-state supply commenced.', prefillFrom: '', defaultValue: '' },
        { id: 'reason_for_registration', label: 'Reason for Registration', type: 'select', options: ['Crossing threshold limit', 'Inter-state supply', 'Liable under reverse charge', 'Casual taxable person', 'E-commerce operator', 'E-commerce through operator', 'Input Service Distributor', 'TDS/TCS deductor', 'Voluntary registration', 'Non-resident taxable person', 'Transfer of business', 'Death of proprietor', 'Merger / demerger / amalgamation'], required: true, helpText: 'Select the reason for seeking GST registration.', prefillFrom: '', defaultValue: 'Voluntary registration' },
        { id: 'existing_registration', label: 'Existing Registration under Earlier Law', type: 'text', required: false, helpText: 'VAT / CST / Service Tax / Excise registration number if any.', prefillFrom: '', defaultValue: '' },
        { id: 'cin', label: 'CIN (if company)', type: 'text', required: false, helpText: 'Corporate Identification Number.', prefillFrom: 'profile.cin', defaultValue: '', validation: 'cin' },
        { id: 'date_of_incorporation', label: 'Date of Incorporation / Registration', type: 'date', required: true, helpText: 'Date as per Certificate of Incorporation.', prefillFrom: 'profile.incorporationDate', defaultValue: '' },
        { id: 'arn_spice', label: 'ARN / SRN from SPICe+ (if applicable)', type: 'text', required: false, helpText: 'If GST was applied through AGILE-PRO-S, enter the ARN.', prefillFrom: '', defaultValue: '' }
      ]
    },
    {
      title: 'Promoter / Partner / Director Details',
      fields: [
        { id: 'promoter1_name', label: 'Full Name of Promoter / Director 1', type: 'text', required: true, helpText: 'As per PAN.', prefillFrom: 'profile.directors[0].firstName', defaultValue: '' },
        { id: 'promoter1_father_name', label: "Father's Name", type: 'text', required: true, helpText: "Father's full name.", prefillFrom: 'profile.directors[0].fatherName', defaultValue: '' },
        { id: 'promoter1_dob', label: 'Date of Birth', type: 'date', required: true, helpText: 'As per PAN.', prefillFrom: 'profile.directors[0].dob', defaultValue: '' },
        { id: 'promoter1_pan', label: 'PAN', type: 'text', required: true, helpText: 'Individual PAN of the promoter/director.', prefillFrom: 'profile.directors[0].pan', defaultValue: '', validation: 'pan' },
        { id: 'promoter1_aadhaar', label: 'Aadhaar Number', type: 'text', required: true, helpText: 'Aadhaar for e-KYC verification.', prefillFrom: 'profile.directors[0].aadhaar', defaultValue: '' },
        { id: 'promoter1_din', label: 'DIN (if director)', type: 'text', required: false, helpText: 'DIN if the person is a director of a company.', prefillFrom: 'profile.directors[0].din', defaultValue: '', validation: 'din' },
        { id: 'promoter1_mobile', label: 'Mobile Number', type: 'text', required: true, helpText: 'Mobile number.', prefillFrom: 'profile.directors[0].mobile', defaultValue: '', validation: 'phone' },
        { id: 'promoter1_email', label: 'Email', type: 'text', required: true, helpText: 'Email.', prefillFrom: 'profile.directors[0].email', defaultValue: '', validation: 'email' },
        { id: 'promoter1_designation', label: 'Designation / Status', type: 'select', options: ['Director', 'Managing Director', 'Partner', 'Karta', 'Proprietor', 'Trustee', 'CEO', 'Others'], required: true, helpText: 'Designation in the business.', prefillFrom: 'profile.directors[0].designation', defaultValue: 'Director' },
        { id: 'promoter1_address', label: 'Residential Address', type: 'textarea', required: true, helpText: 'Full residential address.', prefillFrom: 'profile.directors[0].addressLine1', defaultValue: '' },
        { id: 'promoter1_photo', label: 'Photograph (passport size)', type: 'text', required: true, helpText: 'Upload passport-size photograph. JPEG, max 100 KB.', prefillFrom: '', defaultValue: '[Upload required]' },
        { id: 'promoter2_name', label: 'Full Name of Promoter / Director 2 (if applicable)', type: 'text', required: false, helpText: 'Second promoter/director details.', prefillFrom: 'profile.directors[1].firstName', defaultValue: '' },
        { id: 'promoter2_pan', label: 'PAN of Promoter 2', type: 'text', required: false, helpText: 'PAN of second promoter.', prefillFrom: 'profile.directors[1].pan', defaultValue: '', validation: 'pan' },
        { id: 'promoter2_aadhaar', label: 'Aadhaar of Promoter 2', type: 'text', required: false, helpText: 'Aadhaar of second promoter.', prefillFrom: 'profile.directors[1].aadhaar', defaultValue: '' },
        { id: 'promoter2_din', label: 'DIN of Promoter 2', type: 'text', required: false, helpText: 'DIN if applicable.', prefillFrom: 'profile.directors[1].din', defaultValue: '', validation: 'din' }
      ]
    },
    {
      title: 'Authorized Signatory',
      fields: [
        { id: 'auth_signatory_name', label: 'Name of Authorized Signatory', type: 'text', required: true, helpText: 'Person authorized to sign GST returns and documents.', prefillFrom: 'profile.directors[0].firstName', defaultValue: '' },
        { id: 'auth_signatory_pan', label: 'PAN of Authorized Signatory', type: 'text', required: true, helpText: 'PAN of the authorized signatory.', prefillFrom: 'profile.directors[0].pan', defaultValue: '', validation: 'pan' },
        { id: 'auth_signatory_aadhaar', label: 'Aadhaar of Authorized Signatory', type: 'text', required: true, helpText: 'Aadhaar for e-KYC.', prefillFrom: 'profile.directors[0].aadhaar', defaultValue: '' },
        { id: 'auth_signatory_designation', label: 'Designation', type: 'select', options: ['Director', 'Managing Director', 'Partner', 'Proprietor', 'Authorized Representative', 'CEO', 'CFO', 'Company Secretary', 'Others'], required: true, helpText: 'Designation of the signatory.', prefillFrom: '', defaultValue: 'Director' },
        { id: 'auth_signatory_mobile', label: 'Mobile Number', type: 'text', required: true, helpText: 'Mobile number for OTP.', prefillFrom: 'profile.directors[0].mobile', defaultValue: '', validation: 'phone' },
        { id: 'auth_signatory_email', label: 'Email Address', type: 'text', required: true, helpText: 'Email for GST communications.', prefillFrom: 'profile.directors[0].email', defaultValue: '', validation: 'email' },
        { id: 'auth_signatory_dsc', label: 'Whether DSC is available', type: 'radio', options: ['Yes', 'No'], required: true, helpText: 'DSC is mandatory for companies and LLPs. Others can use Aadhaar-based e-sign.', prefillFrom: '', defaultValue: 'Yes' }
      ]
    },
    {
      title: 'Principal Place of Business',
      fields: [
        { id: 'ppob_address_line_1', label: 'Address Line 1 (Building / Flat No.)', type: 'text', required: true, helpText: 'Building name, flat/door number.', prefillFrom: 'profile.addressLine1', defaultValue: '' },
        { id: 'ppob_address_line_2', label: 'Address Line 2 (Road / Street)', type: 'text', required: false, helpText: 'Road, street, lane.', prefillFrom: 'profile.addressLine2', defaultValue: '' },
        { id: 'ppob_city', label: 'City / Town / Village', type: 'text', required: true, helpText: 'City.', prefillFrom: 'profile.city', defaultValue: '' },
        { id: 'ppob_district', label: 'District', type: 'text', required: true, helpText: 'District.', prefillFrom: 'profile.district', defaultValue: '' },
        { id: 'ppob_state', label: 'State', type: 'text', required: true, helpText: 'State.', prefillFrom: 'profile.state', defaultValue: '' },
        { id: 'ppob_pincode', label: 'PIN Code', type: 'text', required: true, helpText: '6-digit PIN code.', prefillFrom: 'profile.pincode', defaultValue: '', validation: 'pin' },
        { id: 'ppob_nature', label: 'Nature of Possession of Premises', type: 'select', options: ['Own', 'Rented', 'Leased', 'Consent', 'Shared', 'Others'], required: true, helpText: 'Ownership status of the business premises.', prefillFrom: '', defaultValue: 'Rented' },
        { id: 'ppob_nature_of_activity', label: 'Nature of Business Activity at this Premises', type: 'select', options: ['Office / Sale Office', 'Factory / Manufacturing', 'Warehouse / Depot', 'Bonded Warehouse', 'Service Provision', 'Works Contract', 'Retail / Wholesale', 'Leasing Business', 'EOU / STP / EHTP', 'SEZ', 'Others'], required: true, helpText: 'Main activity at this premises.', prefillFrom: '', defaultValue: 'Office / Sale Office' },
        { id: 'ppob_electricity_bill', label: 'Electricity Bill / Property Tax Receipt', type: 'text', required: true, helpText: 'Upload proof of principal place. Utility bill, property tax receipt, or rent agreement.', prefillFrom: '', defaultValue: '[Upload required]' },
        { id: 'ppob_rent_agreement', label: 'Rent / Lease Agreement (if applicable)', type: 'text', required: false, helpText: 'Upload if premises is rented or leased.', prefillFrom: '', defaultValue: '' },
        { id: 'ppob_noc', label: 'NOC from Owner (if rented)', type: 'text', required: false, helpText: 'No Objection Certificate from the property owner.', prefillFrom: '', defaultValue: '' }
      ]
    },
    {
      title: 'Additional Place of Business (if any)',
      fields: [
        { id: 'additional_place', label: 'Do you have additional places of business?', type: 'radio', options: ['Yes', 'No'], required: true, helpText: 'If yes, provide details for each additional place.', prefillFrom: '', defaultValue: 'No' },
        { id: 'additional_address', label: 'Address of Additional Place of Business', type: 'textarea', required: false, helpText: 'Full address if applicable.', prefillFrom: '', defaultValue: '' },
        { id: 'additional_state', label: 'State', type: 'text', required: false, helpText: 'State of additional place.', prefillFrom: '', defaultValue: '' },
        { id: 'additional_nature', label: 'Nature of Activity at Additional Place', type: 'text', required: false, helpText: 'Warehouse, branch office, godown, etc.', prefillFrom: '', defaultValue: '' }
      ]
    },
    {
      title: 'Goods and Services Details',
      fields: [
        { id: 'hsn_sac_1', label: 'HSN / SAC Code 1 (Primary)', type: 'text', required: true, helpText: 'HSN code for goods or SAC code for services. At least one is mandatory.', prefillFrom: 'profile.hsnCode', defaultValue: '' },
        { id: 'hsn_sac_1_description', label: 'Description of Goods / Services 1', type: 'text', required: true, helpText: 'Description matching the HSN/SAC code.', prefillFrom: 'profile.businessActivity', defaultValue: '' },
        { id: 'hsn_sac_2', label: 'HSN / SAC Code 2', type: 'text', required: false, helpText: 'Secondary HSN/SAC code.', prefillFrom: '', defaultValue: '' },
        { id: 'hsn_sac_2_description', label: 'Description of Goods / Services 2', type: 'text', required: false, helpText: 'Description.', prefillFrom: '', defaultValue: '' },
        { id: 'hsn_sac_3', label: 'HSN / SAC Code 3', type: 'text', required: false, helpText: 'Tertiary HSN/SAC code.', prefillFrom: '', defaultValue: '' },
        { id: 'hsn_sac_3_description', label: 'Description of Goods / Services 3', type: 'text', required: false, helpText: 'Description.', prefillFrom: '', defaultValue: '' },
        { id: 'hsn_sac_4', label: 'HSN / SAC Code 4', type: 'text', required: false, helpText: 'Additional HSN/SAC code.', prefillFrom: '', defaultValue: '' },
        { id: 'hsn_sac_4_description', label: 'Description of Goods / Services 4', type: 'text', required: false, helpText: 'Description.', prefillFrom: '', defaultValue: '' },
        { id: 'hsn_sac_5', label: 'HSN / SAC Code 5', type: 'text', required: false, helpText: 'Additional HSN/SAC code.', prefillFrom: '', defaultValue: '' },
        { id: 'hsn_sac_5_description', label: 'Description of Goods / Services 5', type: 'text', required: false, helpText: 'Description.', prefillFrom: '', defaultValue: '' }
      ]
    },
    {
      title: 'Bank Account Details',
      fields: [
        { id: 'bank_account_number', label: 'Bank Account Number', type: 'text', required: false, helpText: 'Company / business bank account. Can be added within 45 days of registration.', prefillFrom: 'profile.bankAccountNumber', defaultValue: '' },
        { id: 'bank_ifsc', label: 'IFSC Code', type: 'text', required: false, helpText: 'IFSC of the bank branch.', prefillFrom: 'profile.bankIFSC', defaultValue: '' },
        { id: 'bank_name', label: 'Bank Name', type: 'text', required: false, helpText: 'Name of the bank.', prefillFrom: 'profile.bankName', defaultValue: '' },
        { id: 'bank_branch', label: 'Branch Name', type: 'text', required: false, helpText: 'Branch.', prefillFrom: 'profile.bankBranch', defaultValue: '' },
        { id: 'account_type', label: 'Type of Account', type: 'select', options: ['Current Account', 'Savings Account', 'Cash Credit Account', 'Overdraft Account'], required: false, helpText: 'Business accounts are typically Current Account.', prefillFrom: '', defaultValue: 'Current Account' }
      ]
    },
    {
      title: 'State-Specific Details',
      fields: [
        { id: 'state_jurisdiction', label: 'State Jurisdiction (Ward / Circle)', type: 'text', required: false, helpText: 'State tax jurisdiction. Auto-assigned based on address.', prefillFrom: '', defaultValue: '' },
        { id: 'central_jurisdiction', label: 'Central Jurisdiction (Commissionerate / Division / Range)', type: 'text', required: false, helpText: 'Central tax jurisdiction. Auto-assigned.', prefillFrom: '', defaultValue: '' }
      ]
    },
    {
      title: 'Aadhaar Authentication',
      fields: [
        { id: 'aadhaar_auth_opted', label: 'Whether opted for Aadhaar authentication', type: 'radio', options: ['Yes', 'No'], required: true, helpText: 'Aadhaar authentication expedites the registration process. Strongly recommended.', prefillFrom: '', defaultValue: 'Yes' },
        { id: 'aadhaar_number_auth', label: 'Aadhaar Number for Authentication', type: 'text', required: false, helpText: 'Aadhaar of the promoter / authorized signatory.', prefillFrom: 'profile.directors[0].aadhaar', defaultValue: '' }
      ]
    },
    {
      title: 'Verification and Declaration',
      fields: [
        { id: 'verification_name', label: 'Name of Authorized Signatory', type: 'text', required: true, helpText: 'Person verifying and signing the application.', prefillFrom: 'profile.directors[0].firstName', defaultValue: '' },
        { id: 'verification_designation', label: 'Designation', type: 'text', required: true, helpText: 'Designation.', prefillFrom: '', defaultValue: 'Director' },
        { id: 'verification_place', label: 'Place', type: 'text', required: true, helpText: 'Place of signing.', prefillFrom: 'profile.city', defaultValue: '' },
        { id: 'verification_date', label: 'Date', type: 'date', required: true, helpText: 'Date of signing.', prefillFrom: '', defaultValue: '' },
        { id: 'verification_declaration', label: 'I hereby solemnly affirm that the information given herein above is true and correct to the best of my knowledge and belief', type: 'checkbox', required: true, helpText: 'Mandatory declaration.', prefillFrom: '', defaultValue: false }
      ]
    }
  ],
  fees: { amount: 0, description: 'No fee for GST registration. Free of charge.' },
  timeline: '3-7 working days. May take up to 30 days if notice is issued for clarification.',
  prerequisites: ['PAN of the business entity', 'PAN and Aadhaar of all promoters / directors', 'Proof of principal place of business (electricity bill, rent agreement, property tax receipt)', 'NOC from property owner (if rented)', 'Photographs of promoters (passport size, JPEG, max 100 KB)', 'Bank account details (can be updated within 45 days)', 'Certificate of Incorporation (for companies)', 'DSC of authorized signatory (mandatory for companies and LLPs)', 'Board resolution or authorization letter'],
  postSubmission: ['ARN (Application Reference Number) is generated immediately', 'Track status on GST portal using ARN', 'Respond to any notices within the given timeline', 'GSTIN is generated upon approval (15-digit number)', 'Download GST Registration Certificate (REG-06) from portal', 'Start filing GST returns from the effective date of registration', 'Update bank account details within 45 days if not provided initially'],
  portalSteps: [
    'Go to gst.gov.in',
    'Click on "Services" > "Registration" > "New Registration"',
    'Select "New Registration" (or "Application for Registration by TDS/TCS" if applicable)',
    'Fill Part A: PAN, mobile number, email address',
    'Verify mobile and email via OTP',
    'Receive TRN (Temporary Reference Number)',
    'Log in with TRN and fill Part B',
    'Fill business details, promoter details, authorized signatory',
    'Enter principal place of business and upload address proof',
    'Enter goods / services HSN / SAC codes',
    'Enter bank details (optional at this stage)',
    'Complete Aadhaar authentication (if opted)',
    'Upload all required documents',
    'Sign using DSC (companies/LLPs) or EVC / Aadhaar e-sign',
    'Submit application and note the ARN',
    'Check status: Services > Registration > Track Application Status'
  ]
};

// ===========================
// 10. GST REG-06 — Registration Certificate
// ===========================
FORM_TEMPLATES['gst-reg-06'] = {
  id: 'gst-reg-06',
  name: 'GST REG-06 \u2014 Registration Certificate',
  authority: 'Goods and Services Tax Network (GSTN)',
  portalUrl: 'https://www.gst.gov.in/',
  description: 'GST Registration Certificate issued by the tax authority upon approval of GST REG-01. This is a system-generated certificate that can be downloaded from the GST portal. The certificate contains the GSTIN, legal name, trade name, address, and other registration details.',
  sections: [
    {
      title: 'Certificate Details (Auto-generated)',
      fields: [
        { id: 'gstin', label: 'GSTIN (15-digit)', type: 'text', required: true, helpText: 'The 15-digit GST Identification Number allotted upon registration.', prefillFrom: 'profile.gstin', defaultValue: '', validation: 'gstin' },
        { id: 'legal_name', label: 'Legal Name', type: 'text', required: true, helpText: 'As per PAN.', prefillFrom: 'profile.businessName', defaultValue: '' },
        { id: 'trade_name', label: 'Trade Name', type: 'text', required: false, helpText: 'Trade name if different from legal name.', prefillFrom: 'profile.tradeName', defaultValue: '' },
        { id: 'constitution', label: 'Constitution of Business', type: 'text', required: true, helpText: 'As per registration application.', prefillFrom: '', defaultValue: 'Private Limited Company' },
        { id: 'address', label: 'Principal Place of Business', type: 'textarea', required: true, helpText: 'Registered business address.', prefillFrom: 'profile.addressLine1', defaultValue: '' },
        { id: 'date_of_liability', label: 'Date of Liability', type: 'date', required: true, helpText: 'Date from which GST liability arises.', prefillFrom: '', defaultValue: '' },
        { id: 'effective_date', label: 'Effective Date of Registration', type: 'date', required: true, helpText: 'Date from which the registration is effective.', prefillFrom: '', defaultValue: '' },
        { id: 'type_of_registration', label: 'Type of Registration', type: 'text', required: true, helpText: 'Regular / Composition / ISD / TDS / TCS etc.', prefillFrom: '', defaultValue: 'Regular' },
        { id: 'validity_period', label: 'Period of Validity (for casual / NRTP)', type: 'text', required: false, helpText: 'Applicable only for casual or non-resident taxable persons.', prefillFrom: '', defaultValue: 'Not Applicable' },
        { id: 'approving_authority', label: 'Name of Approving Authority', type: 'text', required: false, helpText: 'The tax official who approved the registration.', prefillFrom: '', defaultValue: '' },
        { id: 'issue_date', label: 'Date of Issue of Certificate', type: 'date', required: true, helpText: 'Date when the certificate was generated.', prefillFrom: '', defaultValue: '' }
      ]
    }
  ],
  fees: { amount: 0, description: 'No fee. Downloaded from GST portal after registration approval.' },
  timeline: 'Available immediately after GST registration is approved',
  prerequisites: ['Approved GST REG-01 application', 'GSTIN allotted'],
  postSubmission: ['Download and print the certificate', 'Display at the principal place of business', 'Keep a copy in company records'],
  portalSteps: [
    'Log in to gst.gov.in',
    'Navigate to Services > User Services > View / Download Certificates',
    'Select "Registration Certificate"',
    'Download the PDF'
  ]
};

// ===========================
// 11. FSSAI Form A — Basic Registration
// ===========================
FORM_TEMPLATES['fssai-form-a'] = {
  id: 'fssai-form-a',
  name: 'FSSAI Form A \u2014 Basic Registration Application',
  authority: 'Food Safety and Standards Authority of India (FSSAI)',
  portalUrl: 'https://foscos.fssai.gov.in/',
  description: 'Application for basic FSSAI registration under Section 31(1) of the Food Safety and Standards Act, 2006. Required for petty food businesses with annual turnover up to Rs. 12 lakhs. Covers manufacturers, processors, distributors, retailers, and food service operators below the threshold.',
  sections: [
    {
      title: 'Applicant Details',
      fields: [
        { id: 'name_of_applicant', label: 'Name of Food Business Operator (FBO)', type: 'text', required: true, helpText: 'Full name of the individual / company / firm operating the food business.', prefillFrom: 'profile.businessName', defaultValue: '' },
        { id: 'father_husband_name', label: "Father's / Husband's Name (for individuals)", type: 'text', required: false, helpText: "Required if FBO is an individual.", prefillFrom: 'profile.directors[0].fatherName', defaultValue: '' },
        { id: 'constitution', label: 'Constitution of Firm', type: 'select', options: ['Proprietorship', 'Partnership', 'Private Limited Company', 'Public Limited Company', 'LLP', 'Co-operative Society', 'Trust', 'HUF', 'Others'], required: true, helpText: 'Legal constitution of the food business.', prefillFrom: '', defaultValue: 'Private Limited Company' },
        { id: 'photo_id_type', label: 'Photo ID of Applicant', type: 'select', options: ['Aadhaar Card', 'Voter ID', 'Passport', 'Driving Licence', 'PAN Card'], required: true, helpText: 'Select and upload photo identity.', prefillFrom: '', defaultValue: 'Aadhaar Card' },
        { id: 'photo_id_number', label: 'Photo ID Number', type: 'text', required: true, helpText: 'ID number of the selected photo ID.', prefillFrom: 'profile.directors[0].aadhaar', defaultValue: '' }
      ]
    },
    {
      title: 'Food Business Details',
      fields: [
        { id: 'kind_of_business', label: 'Kind of Business', type: 'select', options: ['Manufacturer / Processor', 'Storage / Warehouse', 'Distributor', 'Retailer', 'Transporter', 'Caterer / Food Service', 'Hawker / Street Vendor', 'Temporary Stall Holder', 'Dairy Unit', 'Meat Processing', 'Fish Processing', 'Others'], required: true, helpText: 'Primary type of food business activity.', prefillFrom: '', defaultValue: '' },
        { id: 'food_category', label: 'Category of Food Products', type: 'select', options: ['Dairy Products', 'Meat & Meat Products', 'Fish & Fish Products', 'Fruits & Vegetables', 'Cereal & Cereal Products', 'Bakery & Confectionery', 'Beverages (non-alcoholic)', 'Snacks & Ready-to-eat', 'Oils & Fats', 'Spices & Condiments', 'Sweets & Namkeen', 'Food Supplements', 'Organic Food', 'Others'], required: true, helpText: 'Primary category of food products manufactured or sold.', prefillFrom: '', defaultValue: '' },
        { id: 'list_of_products', label: 'List of Food Products (comma-separated)', type: 'textarea', required: true, helpText: 'Detailed list of food products.', prefillFrom: '', defaultValue: '' },
        { id: 'production_capacity', label: 'Installed Production Capacity (kg/litre per day)', type: 'text', required: false, helpText: 'For manufacturers. Production capacity per day.', prefillFrom: '', defaultValue: '' },
        { id: 'annual_turnover', label: 'Approximate Annual Turnover (Rs.)', type: 'number', required: true, helpText: 'Must be up to Rs. 12 lakhs for basic registration.', prefillFrom: 'profile.annualTurnover', defaultValue: '' }
      ]
    },
    {
      title: 'Premises Details',
      fields: [
        { id: 'premises_address', label: 'Address of Food Business Premises', type: 'textarea', required: true, helpText: 'Complete address where food business is conducted.', prefillFrom: 'profile.addressLine1', defaultValue: '' },
        { id: 'premises_city', label: 'City / Town', type: 'text', required: true, helpText: 'City.', prefillFrom: 'profile.city', defaultValue: '' },
        { id: 'premises_state', label: 'State', type: 'text', required: true, helpText: 'State.', prefillFrom: 'profile.state', defaultValue: '' },
        { id: 'premises_pincode', label: 'PIN Code', type: 'text', required: true, helpText: 'PIN code.', prefillFrom: 'profile.pincode', defaultValue: '', validation: 'pin' },
        { id: 'premises_phone', label: 'Phone Number', type: 'text', required: true, helpText: 'Contact phone.', prefillFrom: 'profile.phone', defaultValue: '', validation: 'phone' },
        { id: 'premises_email', label: 'Email', type: 'text', required: true, helpText: 'Contact email.', prefillFrom: 'profile.email', defaultValue: '', validation: 'email' }
      ]
    },
    {
      title: 'Declaration',
      fields: [
        { id: 'declaration', label: 'I/We hereby declare that the information provided is true and correct', type: 'checkbox', required: true, helpText: 'Mandatory declaration.', prefillFrom: '', defaultValue: false },
        { id: 'declaration_place', label: 'Place', type: 'text', required: true, helpText: 'Place of signing.', prefillFrom: 'profile.city', defaultValue: '' },
        { id: 'declaration_date', label: 'Date', type: 'date', required: true, helpText: 'Date.', prefillFrom: '', defaultValue: '' }
      ]
    }
  ],
  fees: { amount: 100, description: 'Rs. 100 per year. Registration is valid for 1-5 years.' },
  timeline: '7-15 working days',
  prerequisites: ['Passport-size photograph of the FBO', 'Photo identity proof (Aadhaar / Voter ID / PAN / Passport)', 'Proof of business premises (utility bill / rent agreement / property tax receipt)'],
  postSubmission: ['Registration certificate is issued with a 14-digit registration number', 'Display the certificate at the premises', 'Renew before expiry', 'Upgrade to state/central licence if turnover exceeds Rs. 12 lakhs'],
  portalSteps: [
    'Go to foscos.fssai.gov.in',
    'Click "Apply for Registration / License" or "FoSCoS"',
    'Sign up / log in with your credentials',
    'Select "Registration" (for basic registration)',
    'Fill in Form A with applicant and business details',
    'Upload photograph and identity proof',
    'Pay the registration fee online',
    'Submit and note the application number',
    'Track status on the portal'
  ]
};

// ===========================
// 12. FSSAI Form B — State / Central License
// ===========================
FORM_TEMPLATES['fssai-form-b'] = {
  id: 'fssai-form-b',
  name: 'FSSAI Form B \u2014 State / Central License Application',
  authority: 'Food Safety and Standards Authority of India (FSSAI)',
  portalUrl: 'https://foscos.fssai.gov.in/',
  description: 'Application for FSSAI state licence (annual turnover Rs. 12 lakhs to Rs. 20 crores) or central licence (turnover above Rs. 20 crores, or units operating in multiple states, or importers/exporters). Under Section 31(2) of the Food Safety and Standards Act, 2006.',
  sections: [
    {
      title: 'Type of Licence',
      fields: [
        { id: 'licence_type', label: 'Type of Licence', type: 'select', options: ['State Licence', 'Central Licence'], required: true, helpText: 'State: turnover Rs. 12L-20Cr. Central: turnover > Rs. 20Cr or multi-state or importer/exporter.', prefillFrom: '', defaultValue: 'State Licence' },
        { id: 'new_or_renewal', label: 'New Application or Renewal', type: 'select', options: ['New Application', 'Renewal'], required: true, helpText: 'Select New for first-time licence.', prefillFrom: '', defaultValue: 'New Application' }
      ]
    },
    {
      title: 'Applicant / Company Details',
      fields: [
        { id: 'company_name', label: 'Name of Food Business Operator', type: 'text', required: true, helpText: 'Full legal name.', prefillFrom: 'profile.businessName', defaultValue: '' },
        { id: 'constitution', label: 'Constitution', type: 'select', options: ['Proprietorship', 'Partnership', 'Private Limited Company', 'Public Limited Company', 'LLP', 'Co-operative Society', 'Trust', 'Government', 'Others'], required: true, helpText: 'Legal constitution.', prefillFrom: '', defaultValue: 'Private Limited Company' },
        { id: 'date_of_incorporation', label: 'Date of Incorporation / Establishment', type: 'date', required: true, helpText: 'Date of incorporation or business start.', prefillFrom: 'profile.incorporationDate', defaultValue: '' },
        { id: 'pan', label: 'PAN of the Business', type: 'text', required: true, helpText: 'Business PAN.', prefillFrom: 'profile.pan', defaultValue: '', validation: 'pan' },
        { id: 'cin', label: 'CIN (if company)', type: 'text', required: false, helpText: 'CIN.', prefillFrom: 'profile.cin', defaultValue: '', validation: 'cin' },
        { id: 'gstin', label: 'GSTIN', type: 'text', required: false, helpText: 'GST number if registered.', prefillFrom: 'profile.gstin', defaultValue: '', validation: 'gstin' },
        { id: 'contact_person_name', label: 'Name of Contact Person / Authorized Signatory', type: 'text', required: true, helpText: 'Authorized person for FSSAI communications.', prefillFrom: 'profile.directors[0].firstName', defaultValue: '' },
        { id: 'contact_person_designation', label: 'Designation', type: 'text', required: true, helpText: 'Designation of contact person.', prefillFrom: '', defaultValue: 'Director' },
        { id: 'contact_email', label: 'Email', type: 'text', required: true, helpText: 'Email for FSSAI communications.', prefillFrom: 'profile.email', defaultValue: '', validation: 'email' },
        { id: 'contact_phone', label: 'Phone / Mobile', type: 'text', required: true, helpText: 'Phone number.', prefillFrom: 'profile.phone', defaultValue: '', validation: 'phone' }
      ]
    },
    {
      title: 'Food Business Activity Details',
      fields: [
        { id: 'kind_of_business', label: 'Kind of Business (Select all that apply)', type: 'select', options: ['Manufacturer', 'Re-packer', 'Re-labeller', 'Importer', 'Exporter', 'Storage / Warehouse / Cold Storage', 'Wholesaler', 'Distributor', 'Retailer / Marketer', 'Transporter', 'Caterer / Hotel / Restaurant', 'E-commerce Food Business', 'Food Vending Agency', 'Health Supplements / Nutraceuticals', 'Others'], required: true, helpText: 'Primary food business activity.', prefillFrom: '', defaultValue: '' },
        { id: 'food_categories', label: 'Food Category / Categories', type: 'textarea', required: true, helpText: 'List all food categories as per FSSAI product category list.', prefillFrom: '', defaultValue: '' },
        { id: 'list_of_products', label: 'List of Food Products to be Manufactured / Handled', type: 'textarea', required: true, helpText: 'Detailed list of products.', prefillFrom: '', defaultValue: '' },
        { id: 'production_capacity', label: 'Installed Production Capacity (MT/day or litres/day)', type: 'text', required: false, helpText: 'For manufacturers.', prefillFrom: '', defaultValue: '' },
        { id: 'annual_turnover', label: 'Approximate Annual Turnover (Rs.)', type: 'number', required: true, helpText: 'Annual turnover of the food business.', prefillFrom: 'profile.annualTurnover', defaultValue: '' },
        { id: 'number_of_employees', label: 'Number of Food Handlers / Workers', type: 'number', required: true, helpText: 'Number of employees handling food.', prefillFrom: '', defaultValue: '' }
      ]
    },
    {
      title: 'Premises Details',
      fields: [
        { id: 'premises_address', label: 'Address of Premises', type: 'textarea', required: true, helpText: 'Complete address of the food business premises.', prefillFrom: 'profile.addressLine1', defaultValue: '' },
        { id: 'premises_city', label: 'City / Town', type: 'text', required: true, helpText: 'City.', prefillFrom: 'profile.city', defaultValue: '' },
        { id: 'premises_state', label: 'State', type: 'text', required: true, helpText: 'State.', prefillFrom: 'profile.state', defaultValue: '' },
        { id: 'premises_pincode', label: 'PIN Code', type: 'text', required: true, helpText: 'PIN code.', prefillFrom: 'profile.pincode', defaultValue: '', validation: 'pin' },
        { id: 'premises_area', label: 'Total Area of Premises (sq. ft.)', type: 'number', required: true, helpText: 'Total built-up area.', prefillFrom: '', defaultValue: '' },
        { id: 'processing_area', label: 'Processing / Manufacturing Area (sq. ft.)', type: 'number', required: false, helpText: 'Area used for food processing.', prefillFrom: '', defaultValue: '' },
        { id: 'storage_area', label: 'Storage Area (sq. ft.)', type: 'number', required: false, helpText: 'Area for storage.', prefillFrom: '', defaultValue: '' },
        { id: 'water_source', label: 'Source of Water', type: 'select', options: ['Municipal Supply', 'Borewell', 'Packaged Water', 'Tanker Supply', 'Others'], required: true, helpText: 'Primary water source for the food business.', prefillFrom: '', defaultValue: 'Municipal Supply' },
        { id: 'waste_disposal', label: 'Waste Disposal Method', type: 'select', options: ['Municipal Collection', 'Private Contractor', 'STP / ETP', 'Biogas Plant', 'Others'], required: true, helpText: 'Method of waste disposal.', prefillFrom: '', defaultValue: 'Municipal Collection' }
      ]
    },
    {
      title: 'Food Safety Management',
      fields: [
        { id: 'food_safety_plan', label: 'Whether Food Safety Management System (FSMS) is in place', type: 'radio', options: ['Yes', 'No', 'In Progress'], required: true, helpText: 'FSSAI encourages FSMS for all licensed food businesses. HACCP/ISO 22000 is recommended for central licence.', prefillFrom: '', defaultValue: 'In Progress' },
        { id: 'fsms_certification', label: 'FSMS / HACCP / ISO 22000 Certificate Number (if any)', type: 'text', required: false, helpText: 'Certificate number if certified.', prefillFrom: '', defaultValue: '' },
        { id: 'testing_lab', label: 'Name of Testing Laboratory Used', type: 'text', required: false, helpText: 'NABL accredited lab used for food testing.', prefillFrom: '', defaultValue: '' },
        { id: 'food_safety_supervisor', label: 'Name of Food Safety Supervisor', type: 'text', required: false, helpText: 'Trained person for food safety supervision.', prefillFrom: '', defaultValue: '' },
        { id: 'fostac_trained', label: 'Whether FoSTaC trained food safety supervisor is available', type: 'radio', options: ['Yes', 'No'], required: true, helpText: 'FoSTaC (Food Safety Training and Certification) trained supervisor is recommended.', prefillFrom: '', defaultValue: 'No' }
      ]
    },
    {
      title: 'Declaration and Undertaking',
      fields: [
        { id: 'declaration', label: 'I/We declare that the information provided is true and correct', type: 'checkbox', required: true, helpText: 'Mandatory.', prefillFrom: '', defaultValue: false },
        { id: 'undertaking_compliance', label: 'I/We undertake to comply with all provisions of the FSS Act, Rules and Regulations', type: 'checkbox', required: true, helpText: 'Mandatory.', prefillFrom: '', defaultValue: false },
        { id: 'declaration_place', label: 'Place', type: 'text', required: true, helpText: 'Place.', prefillFrom: 'profile.city', defaultValue: '' },
        { id: 'declaration_date', label: 'Date', type: 'date', required: true, helpText: 'Date.', prefillFrom: '', defaultValue: '' }
      ]
    }
  ],
  fees: { amount: 5000, description: 'State Licence: Rs. 2,000 - 5,000 per year. Central Licence: Rs. 7,500 per year. Licence is valid for 1-5 years. Fees vary by state.' },
  timeline: '30-60 working days. Inspection may be conducted.',
  prerequisites: ['Form B application', 'Passport-size photograph of FBO', 'Photo ID proof', 'Proof of premises (rent agreement / ownership document)', 'Partnership deed / MOA / AOA (as applicable)', 'List of food products with brand names', 'Layout plan of the processing unit (blueprint)', 'List of equipment and machinery', 'Water test report from recognized lab', 'Food safety management plan / HACCP plan', 'NOC from local municipal authority (if required)', 'Import-Export Code (for importers/exporters)', 'Analysis report of food products from NABL accredited lab', 'Certificate of FoSTaC training (if available)'],
  postSubmission: ['Licence number is issued (14-digit)', 'Display licence at the premises', 'Comply with labelling requirements on all food products', 'Maintain records of food safety', 'Renew before expiry', 'Annual return filing may be required'],
  portalSteps: [
    'Go to foscos.fssai.gov.in',
    'Sign up / log in with credentials',
    'Select "Apply for License" (State or Central)',
    'Fill in Form B with all details',
    'Upload required documents',
    'Pay the licence fee online',
    'Submit and note the application number',
    'Inspection may be scheduled by the Designated Officer',
    'Track status on the portal',
    'Download licence certificate once approved'
  ]
};

// ===========================
// 13. EPFO Registration Form
// ===========================
FORM_TEMPLATES['epfo-registration'] = {
  id: 'epfo-registration',
  name: 'EPFO Registration \u2014 Employer Registration for Provident Fund',
  authority: 'Employees\u2019 Provident Fund Organisation (EPFO)',
  portalUrl: 'https://unifiedportal-emp.epfindia.gov.in/',
  description: 'Registration of an establishment under the Employees\u2019 Provident Funds and Miscellaneous Provisions Act, 1952. Mandatory for establishments employing 20 or more persons (can register voluntarily with fewer). Through AGILE-PRO-S if filed with SPICe+, or separately on the EPFO Unified Portal.',
  sections: [
    {
      title: 'Establishment Details',
      fields: [
        { id: 'establishment_name', label: 'Name of Establishment', type: 'text', required: true, helpText: 'Legal name of the company / firm.', prefillFrom: 'profile.businessName', defaultValue: '' },
        { id: 'establishment_type', label: 'Type of Establishment', type: 'select', options: ['Factory', 'Shop', 'Establishment', 'Motor Transport', 'Newspaper', 'Plantation', 'Mine', 'Contractor', 'Others'], required: true, helpText: 'Category of establishment.', prefillFrom: '', defaultValue: 'Establishment' },
        { id: 'constitution', label: 'Constitution', type: 'select', options: ['Private Limited Company', 'Public Limited Company', 'Partnership Firm', 'LLP', 'Proprietorship', 'Society', 'Trust', 'Co-operative', 'Government', 'Others'], required: true, helpText: 'Legal constitution.', prefillFrom: '', defaultValue: 'Private Limited Company' },
        { id: 'cin', label: 'CIN (if company)', type: 'text', required: false, helpText: 'Corporate Identification Number.', prefillFrom: 'profile.cin', defaultValue: '', validation: 'cin' },
        { id: 'pan', label: 'PAN of Establishment', type: 'text', required: true, helpText: 'Business PAN.', prefillFrom: 'profile.pan', defaultValue: '', validation: 'pan' },
        { id: 'tan', label: 'TAN of Establishment', type: 'text', required: true, helpText: 'Tax Deduction Account Number.', prefillFrom: 'profile.tan', defaultValue: '' },
        { id: 'gstin', label: 'GSTIN (if registered)', type: 'text', required: false, helpText: 'GST number.', prefillFrom: 'profile.gstin', defaultValue: '', validation: 'gstin' },
        { id: 'date_of_setup', label: 'Date of Setup / Incorporation', type: 'date', required: true, helpText: 'Date when establishment was set up.', prefillFrom: 'profile.incorporationDate', defaultValue: '' },
        { id: 'date_of_epf_applicability', label: 'Date on which EPF Became Applicable (20+ employees)', type: 'date', required: true, helpText: 'Date when employee count reached 20 or date of voluntary coverage.', prefillFrom: '', defaultValue: '' },
        { id: 'nature_of_business', label: 'Nature of Business / Industry', type: 'text', required: true, helpText: 'Detailed nature of business.', prefillFrom: 'profile.businessActivity', defaultValue: '' },
        { id: 'nic_code', label: 'NIC Code', type: 'text', required: true, helpText: 'NIC Code for the business.', prefillFrom: 'profile.nicCode', defaultValue: '' }
      ]
    },
    {
      title: 'Address Details',
      fields: [
        { id: 'address_line_1', label: 'Address Line 1', type: 'text', required: true, helpText: 'Building / flat / door.', prefillFrom: 'profile.addressLine1', defaultValue: '' },
        { id: 'address_line_2', label: 'Address Line 2', type: 'text', required: false, helpText: 'Road / street.', prefillFrom: 'profile.addressLine2', defaultValue: '' },
        { id: 'city', label: 'City', type: 'text', required: true, helpText: 'City.', prefillFrom: 'profile.city', defaultValue: '' },
        { id: 'state', label: 'State', type: 'text', required: true, helpText: 'State.', prefillFrom: 'profile.state', defaultValue: '' },
        { id: 'pincode', label: 'PIN Code', type: 'text', required: true, helpText: 'PIN code.', prefillFrom: 'profile.pincode', defaultValue: '', validation: 'pin' },
        { id: 'phone', label: 'Phone Number', type: 'text', required: true, helpText: 'Phone.', prefillFrom: 'profile.phone', defaultValue: '', validation: 'phone' },
        { id: 'email', label: 'Email', type: 'text', required: true, helpText: 'Email.', prefillFrom: 'profile.email', defaultValue: '', validation: 'email' }
      ]
    },
    {
      title: 'Employer / Authorized Person Details',
      fields: [
        { id: 'employer_name', label: 'Name of Employer / Authorized Person', type: 'text', required: true, helpText: 'Director or partner or proprietor.', prefillFrom: 'profile.directors[0].firstName', defaultValue: '' },
        { id: 'employer_designation', label: 'Designation', type: 'text', required: true, helpText: 'Designation.', prefillFrom: '', defaultValue: 'Director' },
        { id: 'employer_pan', label: 'PAN of Employer', type: 'text', required: true, helpText: 'Individual PAN.', prefillFrom: 'profile.directors[0].pan', defaultValue: '', validation: 'pan' },
        { id: 'employer_aadhaar', label: 'Aadhaar of Employer', type: 'text', required: true, helpText: 'Aadhaar for verification.', prefillFrom: 'profile.directors[0].aadhaar', defaultValue: '' },
        { id: 'employer_mobile', label: 'Mobile Number', type: 'text', required: true, helpText: 'Mobile.', prefillFrom: 'profile.directors[0].mobile', defaultValue: '', validation: 'phone' },
        { id: 'employer_email', label: 'Email', type: 'text', required: true, helpText: 'Email.', prefillFrom: 'profile.directors[0].email', defaultValue: '', validation: 'email' }
      ]
    },
    {
      title: 'Employee and Wage Details',
      fields: [
        { id: 'total_employees', label: 'Total Number of Employees', type: 'number', required: true, helpText: 'Total employees at the time of registration.', prefillFrom: 'profile.employeeCount', defaultValue: '' },
        { id: 'male_employees', label: 'Male Employees', type: 'number', required: true, helpText: 'Number of male employees.', prefillFrom: '', defaultValue: '' },
        { id: 'female_employees', label: 'Female Employees', type: 'number', required: true, helpText: 'Number of female employees.', prefillFrom: '', defaultValue: '' },
        { id: 'employees_below_15k', label: 'Employees Earning Basic Wages up to Rs. 15,000/month', type: 'number', required: true, helpText: 'EPF contribution is mandatory for employees earning up to Rs. 15,000 basic. Others can opt in voluntarily.', prefillFrom: '', defaultValue: '' },
        { id: 'total_monthly_wages', label: 'Total Monthly Wages Disbursed (Rs.)', type: 'number', required: true, helpText: 'Total monthly wages bill.', prefillFrom: '', defaultValue: '' },
        { id: 'contribution_rate', label: 'Rate of Contribution (%)', type: 'text', required: true, helpText: '12% employee + 12% employer (of which 8.33% goes to EPS and 3.67% to EPF). Standard rate is 12%.', prefillFrom: '', defaultValue: '12%' },
        { id: 'wage_month_start', label: 'Month from which PF Contribution Starts', type: 'text', required: true, helpText: 'Month and year from which contributions begin.', prefillFrom: '', defaultValue: '' }
      ]
    },
    {
      title: 'Bank Details',
      fields: [
        { id: 'bank_name', label: 'Bank Name', type: 'text', required: true, helpText: 'Bank for PF remittance.', prefillFrom: 'profile.bankName', defaultValue: '' },
        { id: 'bank_account', label: 'Bank Account Number', type: 'text', required: true, helpText: 'Business bank account.', prefillFrom: 'profile.bankAccountNumber', defaultValue: '' },
        { id: 'bank_ifsc', label: 'IFSC Code', type: 'text', required: true, helpText: 'IFSC.', prefillFrom: 'profile.bankIFSC', defaultValue: '' },
        { id: 'bank_branch', label: 'Branch', type: 'text', required: true, helpText: 'Branch name.', prefillFrom: 'profile.bankBranch', defaultValue: '' }
      ]
    }
  ],
  fees: { amount: 0, description: 'No registration fee. Monthly contributions begin from the applicable month.' },
  timeline: '2-5 working days. Establishment code is allotted upon registration.',
  prerequisites: ['PAN and TAN of the establishment', 'CIN (if company)', 'Bank account details', 'Employee details (Aadhaar, PAN, bank details of each employee)', 'DSC of authorized signatory', 'Address proof of the establishment'],
  postSubmission: ['Establishment code allotted (e.g., KABLR0012345000)', 'Register on the EPFO Unified Portal for employer', 'Add all employee details on the portal', 'Remit monthly contributions by 15th of every month', 'File monthly Electronic Challan-cum-Return (ECR)', 'Generate UAN (Universal Account Number) for each employee'],
  portalSteps: [
    'If filing through SPICe+ AGILE-PRO-S: EPFO registration is linked automatically',
    'For separate registration: Go to unifiedportal-emp.epfindia.gov.in',
    'Click on "Establishment Registration"',
    'Fill in establishment details, employer details, employee details',
    'Upload DSC',
    'Submit and note the registration reference',
    'Once allotted, log in to the Unified Portal to manage contributions',
    'Download the establishment code allotment letter'
  ]
};

// ===========================
// 14. ESIC Registration Form
// ===========================
FORM_TEMPLATES['esic-registration'] = {
  id: 'esic-registration',
  name: 'ESIC Registration \u2014 Employer Registration for ESI',
  authority: 'Employees\u2019 State Insurance Corporation (ESIC)',
  portalUrl: 'https://www.esic.gov.in/',
  description: 'Registration under the Employees\u2019 State Insurance Act, 1948. Mandatory for establishments with 10 or more employees (20 in some states) where employees earn up to Rs. 21,000/month (Rs. 25,000 for persons with disability).',
  sections: [
    {
      title: 'Establishment Details',
      fields: [
        { id: 'establishment_name', label: 'Name of Establishment', type: 'text', required: true, helpText: 'Legal name.', prefillFrom: 'profile.businessName', defaultValue: '' },
        { id: 'establishment_type', label: 'Type of Establishment', type: 'select', options: ['Factory', 'Shop', 'Hotel / Restaurant', 'Cinema / Theatre', 'Transport', 'Newspaper', 'Educational Institution', 'Medical Institution', 'IT / BPO', 'Others'], required: true, helpText: 'Type of establishment.', prefillFrom: '', defaultValue: 'Shop' },
        { id: 'constitution', label: 'Constitution', type: 'select', options: ['Private Limited Company', 'Public Limited Company', 'Partnership', 'LLP', 'Proprietorship', 'Society', 'Trust', 'Government', 'Others'], required: true, helpText: 'Legal constitution.', prefillFrom: '', defaultValue: 'Private Limited Company' },
        { id: 'pan', label: 'PAN', type: 'text', required: true, helpText: 'Business PAN.', prefillFrom: 'profile.pan', defaultValue: '', validation: 'pan' },
        { id: 'cin', label: 'CIN (if company)', type: 'text', required: false, helpText: 'CIN.', prefillFrom: 'profile.cin', defaultValue: '', validation: 'cin' },
        { id: 'date_of_setup', label: 'Date of Setup', type: 'date', required: true, helpText: 'Date of incorporation / setup.', prefillFrom: 'profile.incorporationDate', defaultValue: '' },
        { id: 'date_of_esic_coverage', label: 'Date from which ESIC Coverage is Applicable', type: 'date', required: true, helpText: 'Date when employee count reached the threshold.', prefillFrom: '', defaultValue: '' },
        { id: 'nature_of_business', label: 'Nature of Business', type: 'text', required: true, helpText: 'Business activity.', prefillFrom: 'profile.businessActivity', defaultValue: '' }
      ]
    },
    {
      title: 'Address',
      fields: [
        { id: 'address', label: 'Address of Establishment', type: 'textarea', required: true, helpText: 'Full address.', prefillFrom: 'profile.addressLine1', defaultValue: '' },
        { id: 'city', label: 'City', type: 'text', required: true, helpText: 'City.', prefillFrom: 'profile.city', defaultValue: '' },
        { id: 'state', label: 'State', type: 'text', required: true, helpText: 'State.', prefillFrom: 'profile.state', defaultValue: '' },
        { id: 'pincode', label: 'PIN Code', type: 'text', required: true, helpText: 'PIN code.', prefillFrom: 'profile.pincode', defaultValue: '', validation: 'pin' },
        { id: 'phone', label: 'Phone', type: 'text', required: true, helpText: 'Phone.', prefillFrom: 'profile.phone', defaultValue: '', validation: 'phone' },
        { id: 'email', label: 'Email', type: 'text', required: true, helpText: 'Email.', prefillFrom: 'profile.email', defaultValue: '', validation: 'email' }
      ]
    },
    {
      title: 'Employer Details',
      fields: [
        { id: 'employer_name', label: 'Name of Employer / Authorized Person', type: 'text', required: true, helpText: 'Director / partner / proprietor.', prefillFrom: 'profile.directors[0].firstName', defaultValue: '' },
        { id: 'employer_designation', label: 'Designation', type: 'text', required: true, helpText: 'Designation.', prefillFrom: '', defaultValue: 'Director' },
        { id: 'employer_pan', label: 'PAN', type: 'text', required: true, helpText: 'Individual PAN.', prefillFrom: 'profile.directors[0].pan', defaultValue: '', validation: 'pan' },
        { id: 'employer_aadhaar', label: 'Aadhaar', type: 'text', required: true, helpText: 'Aadhaar.', prefillFrom: 'profile.directors[0].aadhaar', defaultValue: '' },
        { id: 'employer_mobile', label: 'Mobile', type: 'text', required: true, helpText: 'Mobile.', prefillFrom: 'profile.directors[0].mobile', defaultValue: '', validation: 'phone' },
        { id: 'employer_email', label: 'Email', type: 'text', required: true, helpText: 'Email.', prefillFrom: 'profile.directors[0].email', defaultValue: '', validation: 'email' }
      ]
    },
    {
      title: 'Employee Details',
      fields: [
        { id: 'total_employees', label: 'Total Employees', type: 'number', required: true, helpText: 'Total employees at the establishment.', prefillFrom: 'profile.employeeCount', defaultValue: '' },
        { id: 'employees_covered', label: 'Employees Covered under ESIC (earning up to Rs. 21,000/month)', type: 'number', required: true, helpText: 'Employees whose gross monthly wages are up to Rs. 21,000.', prefillFrom: '', defaultValue: '' },
        { id: 'total_monthly_wages', label: 'Total Monthly Wages of Covered Employees (Rs.)', type: 'number', required: true, helpText: 'Gross monthly wages of all covered employees.', prefillFrom: '', defaultValue: '' },
        { id: 'contribution_period_start', label: 'Contribution Period Start', type: 'date', required: true, helpText: 'Month from which contributions start.', prefillFrom: '', defaultValue: '' }
      ]
    },
    {
      title: 'Bank Details',
      fields: [
        { id: 'bank_name', label: 'Bank Name', type: 'text', required: true, helpText: 'Bank for ESI challan payment.', prefillFrom: 'profile.bankName', defaultValue: '' },
        { id: 'bank_account', label: 'Account Number', type: 'text', required: true, helpText: 'Business bank account.', prefillFrom: 'profile.bankAccountNumber', defaultValue: '' },
        { id: 'bank_ifsc', label: 'IFSC Code', type: 'text', required: true, helpText: 'IFSC.', prefillFrom: 'profile.bankIFSC', defaultValue: '' }
      ]
    }
  ],
  fees: { amount: 0, description: 'No registration fee. Monthly contribution: Employer 3.25% + Employee 0.75% of gross wages.' },
  timeline: '2-5 working days. ESIC code allotted upon registration.',
  prerequisites: ['PAN of the establishment', 'Bank account details', 'Employee details (name, Aadhaar, bank account, photo, family details)', 'Address proof', 'Registration certificate / CIN'],
  postSubmission: ['ESIC code allotted (17-digit)', 'Register employees on ESIC portal and generate IP (Insured Person) numbers', 'Remit contributions monthly by 15th of the following month', 'File monthly contribution details online', 'Employees can access ESIC benefits (medical, disability, maternity) through nearest ESI hospital/dispensary'],
  portalSteps: [
    'If filing through SPICe+ AGILE-PRO-S: ESIC registration is automatic',
    'For separate registration: Go to esic.gov.in',
    'Click "Employer Login" > "Sign Up"',
    'Fill in establishment and employer details',
    'Upload required documents',
    'Submit and receive ESIC employer code',
    'Add employee details and generate IP numbers',
    'Start monthly contribution payments'
  ]
};

// ===========================
// 15. Shops & Establishments Registration
// ===========================
FORM_TEMPLATES['shops-establishment'] = {
  id: 'shops-establishment',
  name: 'Shops & Establishments Act \u2014 Registration',
  authority: 'State Labour Department / Municipal Authority',
  portalUrl: 'https://www.mca.gov.in/',
  description: 'Registration under the state-specific Shops and Establishments Act. Mandatory for all commercial establishments, shops, hotels, restaurants, places of entertainment, and other business premises. Each state has its own Act and portal. Registration must be obtained within 30 days of commencement of business.',
  sections: [
    {
      title: 'Establishment Details',
      fields: [
        { id: 'establishment_name', label: 'Name of Establishment', type: 'text', required: true, helpText: 'Legal name.', prefillFrom: 'profile.businessName', defaultValue: '' },
        { id: 'nature_of_business', label: 'Nature of Business', type: 'text', required: true, helpText: 'Activity / trade.', prefillFrom: 'profile.businessActivity', defaultValue: '' },
        { id: 'category', label: 'Category', type: 'select', options: ['Shop', 'Commercial Establishment', 'Hotel / Restaurant', 'Theatre / Cinema', 'Residential Hotel', 'Others'], required: true, helpText: 'Category under the Shops Act.', prefillFrom: '', defaultValue: 'Commercial Establishment' },
        { id: 'date_of_commencement', label: 'Date of Commencement of Business', type: 'date', required: true, helpText: 'When business operations started. Must register within 30 days.', prefillFrom: 'profile.commencementDate', defaultValue: '' },
        { id: 'pan', label: 'PAN of Establishment', type: 'text', required: true, helpText: 'Business PAN.', prefillFrom: 'profile.pan', defaultValue: '', validation: 'pan' }
      ]
    },
    {
      title: 'Address',
      fields: [
        { id: 'address', label: 'Full Address of Establishment', type: 'textarea', required: true, helpText: 'Address where business is conducted.', prefillFrom: 'profile.addressLine1', defaultValue: '' },
        { id: 'city', label: 'City / Town', type: 'text', required: true, helpText: 'City.', prefillFrom: 'profile.city', defaultValue: '' },
        { id: 'state', label: 'State', type: 'text', required: true, helpText: 'State.', prefillFrom: 'profile.state', defaultValue: '' },
        { id: 'pincode', label: 'PIN Code', type: 'text', required: true, helpText: 'PIN code.', prefillFrom: 'profile.pincode', defaultValue: '', validation: 'pin' },
        { id: 'phone', label: 'Phone', type: 'text', required: true, helpText: 'Phone.', prefillFrom: 'profile.phone', defaultValue: '', validation: 'phone' },
        { id: 'email', label: 'Email', type: 'text', required: true, helpText: 'Email.', prefillFrom: 'profile.email', defaultValue: '', validation: 'email' }
      ]
    },
    {
      title: 'Employer / Occupier Details',
      fields: [
        { id: 'employer_name', label: 'Name of Employer / Occupier', type: 'text', required: true, helpText: 'Director / partner / proprietor.', prefillFrom: 'profile.directors[0].firstName', defaultValue: '' },
        { id: 'employer_father_name', label: "Father's / Husband's Name", type: 'text', required: true, helpText: "Father's or husband's name.", prefillFrom: 'profile.directors[0].fatherName', defaultValue: '' },
        { id: 'employer_address', label: 'Residential Address', type: 'textarea', required: true, helpText: 'Home address.', prefillFrom: 'profile.directors[0].addressLine1', defaultValue: '' },
        { id: 'employer_aadhaar', label: 'Aadhaar Number', type: 'text', required: true, helpText: 'Aadhaar.', prefillFrom: 'profile.directors[0].aadhaar', defaultValue: '' }
      ]
    },
    {
      title: 'Employee and Working Hours Details',
      fields: [
        { id: 'total_employees', label: 'Total Number of Employees', type: 'number', required: true, helpText: 'Including employer.', prefillFrom: 'profile.employeeCount', defaultValue: '' },
        { id: 'male_employees', label: 'Male Employees', type: 'number', required: true, helpText: 'Male employees.', prefillFrom: '', defaultValue: '' },
        { id: 'female_employees', label: 'Female Employees', type: 'number', required: true, helpText: 'Female employees.', prefillFrom: '', defaultValue: '' },
        { id: 'opening_time', label: 'Opening Time', type: 'text', required: true, helpText: 'Daily opening time of the establishment.', prefillFrom: '', defaultValue: '9:00 AM' },
        { id: 'closing_time', label: 'Closing Time', type: 'text', required: true, helpText: 'Daily closing time.', prefillFrom: '', defaultValue: '6:00 PM' },
        { id: 'weekly_holiday', label: 'Weekly Holiday', type: 'select', options: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], required: true, helpText: 'Declared weekly holiday.', prefillFrom: '', defaultValue: 'Sunday' },
        { id: 'daily_working_hours', label: 'Daily Working Hours', type: 'number', required: true, helpText: 'Cannot exceed 9 hours per day (varies by state).', prefillFrom: '', defaultValue: '9' },
        { id: 'weekly_working_hours', label: 'Weekly Working Hours', type: 'number', required: true, helpText: 'Cannot exceed 48 hours per week (varies by state).', prefillFrom: '', defaultValue: '48' }
      ]
    }
  ],
  fees: { amount: 500, description: 'Varies by state and number of employees. Typically Rs. 200 - 5,000. Annual renewal fees apply.' },
  timeline: '7-15 working days. Varies by state.',
  prerequisites: ['PAN of establishment', 'Address proof', 'Photo ID of employer', 'Employee list', 'Rent agreement / property document'],
  postSubmission: ['Display registration certificate at the establishment', 'Renew annually before expiry', 'Maintain registers: employee register, leave register, wages register', 'Comply with working hour regulations', 'Provide weekly holiday and earned leave as per Act'],
  portalSteps: [
    'Portal varies by state:',
    '  Karnataka: seva.karnataka.gov.in',
    '  Maharashtra: shop.mahaonline.gov.in',
    '  Delhi: labour.delhi.gov.in',
    '  Tamil Nadu: tnlabour.tn.gov.in',
    '  Telangana: labour.telangana.gov.in',
    'Register on the state portal',
    'Fill in establishment details and employee details',
    'Upload required documents',
    'Pay the fee online',
    'Submit and receive registration number',
    'Download and display certificate'
  ]
};

// ===========================
// 16. Udyam Registration
// ===========================
FORM_TEMPLATES['udyam-registration'] = {
  id: 'udyam-registration',
  name: 'Udyam Registration \u2014 MSME Registration',
  authority: 'Ministry of Micro, Small and Medium Enterprises',
  portalUrl: 'https://udyamregistration.gov.in/',
  description: 'Registration of Micro, Small and Medium Enterprises under the MSMED Act, 2006. Based on self-declaration. Free, paperless, and fully online. Classification: Micro (investment up to Rs. 1 Cr, turnover up to Rs. 5 Cr), Small (investment up to Rs. 10 Cr, turnover up to Rs. 50 Cr), Medium (investment up to Rs. 50 Cr, turnover up to Rs. 250 Cr).',
  sections: [
    {
      title: 'Enterprise Details',
      fields: [
        { id: 'aadhaar_number', label: 'Aadhaar Number of Proprietor / Managing Director / Partner', type: 'text', required: true, helpText: 'Aadhaar of the person registering. Aadhaar verification via OTP is mandatory.', prefillFrom: 'profile.directors[0].aadhaar', defaultValue: '' },
        { id: 'name_of_entrepreneur', label: 'Name of Entrepreneur', type: 'text', required: true, helpText: 'Name as per Aadhaar.', prefillFrom: 'profile.directors[0].firstName', defaultValue: '' },
        { id: 'social_category', label: 'Social Category', type: 'select', options: ['General', 'SC', 'ST', 'OBC'], required: true, helpText: 'Social category of the entrepreneur.', prefillFrom: '', defaultValue: 'General' },
        { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Others'], required: true, helpText: 'Gender of the entrepreneur.', prefillFrom: 'profile.directors[0].gender', defaultValue: '' },
        { id: 'physically_handicapped', label: 'Physically Handicapped', type: 'radio', options: ['Yes', 'No'], required: true, helpText: 'Whether the entrepreneur is physically handicapped.', prefillFrom: '', defaultValue: 'No' },
        { id: 'enterprise_name', label: 'Name of Enterprise', type: 'text', required: true, helpText: 'Legal / trade name.', prefillFrom: 'profile.businessName', defaultValue: '' },
        { id: 'enterprise_type', label: 'Type of Organisation', type: 'select', options: ['Proprietary', 'Partnership', 'Hindu Undivided Family', 'Co-operative Society', 'Private Limited Company', 'Public Limited Company', 'Limited Liability Partnership', 'Self Help Group', 'Others'], required: true, helpText: 'Legal form of the enterprise.', prefillFrom: '', defaultValue: 'Private Limited Company' },
        { id: 'pan', label: 'PAN of Enterprise', type: 'text', required: true, helpText: 'PAN of the business entity.', prefillFrom: 'profile.pan', defaultValue: '', validation: 'pan' },
        { id: 'gstin', label: 'GSTIN (if registered)', type: 'text', required: false, helpText: 'GST number. If not registered, select exempt.', prefillFrom: 'profile.gstin', defaultValue: '', validation: 'gstin' },
        { id: 'date_of_commencement', label: 'Date of Commencement of Business', type: 'date', required: true, helpText: 'Date operations started.', prefillFrom: 'profile.commencementDate', defaultValue: '' },
        { id: 'date_of_incorporation', label: 'Date of Incorporation (if company / LLP)', type: 'date', required: false, helpText: 'As per Certificate of Incorporation.', prefillFrom: 'profile.incorporationDate', defaultValue: '' }
      ]
    },
    {
      title: 'Business Activity',
      fields: [
        { id: 'major_activity', label: 'Major Activity', type: 'select', options: ['Manufacturing', 'Services'], required: true, helpText: 'Whether the enterprise is primarily in manufacturing or services.', prefillFrom: '', defaultValue: '' },
        { id: 'nic_2_digit', label: 'NIC 2-digit Code', type: 'text', required: true, helpText: '2-digit NIC code for the primary activity.', prefillFrom: '', defaultValue: '' },
        { id: 'nic_4_digit', label: 'NIC 4-digit Code', type: 'text', required: true, helpText: '4-digit NIC code.', prefillFrom: '', defaultValue: '' },
        { id: 'nic_5_digit', label: 'NIC 5-digit Code', type: 'text', required: true, helpText: '5-digit NIC code (most specific).', prefillFrom: 'profile.nicCode', defaultValue: '' },
        { id: 'activity_description', label: 'Description of Activity', type: 'textarea', required: true, helpText: 'Detailed description of business activity.', prefillFrom: 'profile.businessActivity', defaultValue: '' }
      ]
    },
    {
      title: 'Address of Plant / Unit',
      fields: [
        { id: 'flat_building', label: 'Flat / Building / Village', type: 'text', required: true, helpText: 'Address.', prefillFrom: 'profile.addressLine1', defaultValue: '' },
        { id: 'road_street', label: 'Road / Street / Lane', type: 'text', required: false, helpText: 'Road.', prefillFrom: 'profile.addressLine2', defaultValue: '' },
        { id: 'city', label: 'City / Town', type: 'text', required: true, helpText: 'City.', prefillFrom: 'profile.city', defaultValue: '' },
        { id: 'district', label: 'District', type: 'text', required: true, helpText: 'District.', prefillFrom: 'profile.district', defaultValue: '' },
        { id: 'state', label: 'State', type: 'text', required: true, helpText: 'State.', prefillFrom: 'profile.state', defaultValue: '' },
        { id: 'pincode', label: 'PIN Code', type: 'text', required: true, helpText: 'PIN.', prefillFrom: 'profile.pincode', defaultValue: '', validation: 'pin' },
        { id: 'mobile', label: 'Mobile', type: 'text', required: true, helpText: 'Mobile.', prefillFrom: 'profile.phone', defaultValue: '', validation: 'phone' },
        { id: 'email', label: 'Email', type: 'text', required: true, helpText: 'Email.', prefillFrom: 'profile.email', defaultValue: '', validation: 'email' }
      ]
    },
    {
      title: 'Financial Details',
      fields: [
        { id: 'investment_plant_machinery', label: 'Investment in Plant & Machinery / Equipment (Rs.)', type: 'number', required: true, helpText: 'Total investment excluding land and building. Micro: up to Rs. 1 Cr, Small: up to Rs. 10 Cr, Medium: up to Rs. 50 Cr.', prefillFrom: '', defaultValue: '' },
        { id: 'annual_turnover', label: 'Annual Turnover (Rs.)', type: 'number', required: true, helpText: 'As per last ITR. Micro: up to Rs. 5 Cr, Small: up to Rs. 50 Cr, Medium: up to Rs. 250 Cr.', prefillFrom: 'profile.annualTurnover', defaultValue: '' },
        { id: 'export_turnover', label: 'Export Turnover (Rs.) (excluded from calculation)', type: 'number', required: false, helpText: 'Export turnover is excluded from the turnover calculation for classification.', prefillFrom: '', defaultValue: '0' },
        { id: 'itr_details', label: 'ITR Acknowledgment Number (if available)', type: 'text', required: false, helpText: 'ITR number for verification of turnover.', prefillFrom: '', defaultValue: '' }
      ]
    },
    {
      title: 'Employment Details',
      fields: [
        { id: 'total_employees', label: 'Number of Persons Employed', type: 'number', required: true, helpText: 'Total persons employed.', prefillFrom: 'profile.employeeCount', defaultValue: '' },
        { id: 'di_number', label: 'District Industries Centre (DIC) Number (if any)', type: 'text', required: false, helpText: 'Previous DIC / EM-II / UAM number.', prefillFrom: '', defaultValue: '' }
      ]
    },
    {
      title: 'Bank Details',
      fields: [
        { id: 'bank_account', label: 'Bank Account Number', type: 'text', required: true, helpText: 'Business bank account.', prefillFrom: 'profile.bankAccountNumber', defaultValue: '' },
        { id: 'bank_ifsc', label: 'IFSC Code', type: 'text', required: true, helpText: 'IFSC.', prefillFrom: 'profile.bankIFSC', defaultValue: '' }
      ]
    }
  ],
  fees: { amount: 0, description: 'Completely free. No fee for Udyam Registration.' },
  timeline: 'Instant. Udyam Registration Number (URN) is generated immediately upon submission.',
  prerequisites: ['Aadhaar number of the proprietor / managing director / partner', 'PAN and GSTIN of the enterprise', 'Bank account details', 'Investment and turnover details', 'NIC code for the business activity'],
  postSubmission: ['Udyam Registration Number (URN) is issued immediately (e.g., UDYAM-KA-01-0012345)', 'Udyam Registration Certificate can be downloaded and printed', 'Benefits: Priority sector lending, credit guarantee scheme, subsidies, government tenders, lower interest rates', 'Update details annually on the portal', 'E-verify the certificate using the URN on the portal'],
  portalSteps: [
    'Go to udyamregistration.gov.in',
    'Click "For New Entrepreneurs who are not Registered yet as MSME" or "For those already having UAM"',
    'Enter Aadhaar number and name',
    'Verify via OTP on mobile linked to Aadhaar',
    'Enter PAN and validate (PAN details are auto-fetched from CBDT)',
    'Fill in enterprise details, address, NIC code, investment, turnover',
    'GSTIN details are auto-fetched if linked to PAN',
    'Bank details are auto-fetched from CBDT database',
    'Verify all details and submit',
    'Udyam Registration Certificate is generated immediately',
    'Download and print the certificate'
  ]
};

// ===========================
// 17. Professional Tax Registration (Karnataka / Maharashtra)
// ===========================
FORM_TEMPLATES['professional-tax'] = {
  id: 'professional-tax',
  name: 'Professional Tax Registration \u2014 Employer Registration',
  authority: 'State Commercial Tax / Municipal Authority',
  portalUrl: 'https://pt.kar.nic.in/',
  description: 'Registration for Professional Tax (PT) as an employer. Professional Tax is a state-level tax levied on salaried individuals and employers. The employer must register, deduct PT from employee salaries, and remit to the state government. Maximum PT is Rs. 2,500 per year per employee. Rates and exemptions vary by state.',
  sections: [
    {
      title: 'Employer Details',
      fields: [
        { id: 'employer_name', label: 'Name of Employer / Establishment', type: 'text', required: true, helpText: 'Legal name.', prefillFrom: 'profile.businessName', defaultValue: '' },
        { id: 'constitution', label: 'Constitution', type: 'select', options: ['Private Limited Company', 'Public Limited Company', 'Partnership', 'LLP', 'Proprietorship', 'HUF', 'Others'], required: true, helpText: 'Legal constitution.', prefillFrom: '', defaultValue: 'Private Limited Company' },
        { id: 'pan', label: 'PAN', type: 'text', required: true, helpText: 'Business PAN.', prefillFrom: 'profile.pan', defaultValue: '', validation: 'pan' },
        { id: 'gstin', label: 'GSTIN (if registered)', type: 'text', required: false, helpText: 'GST number.', prefillFrom: 'profile.gstin', defaultValue: '', validation: 'gstin' },
        { id: 'date_of_liability', label: 'Date from which PT Liability Arises', type: 'date', required: true, helpText: 'Usually from the month the first employee is hired.', prefillFrom: '', defaultValue: '' },
        { id: 'nature_of_business', label: 'Nature of Business', type: 'text', required: true, helpText: 'Business activity.', prefillFrom: 'profile.businessActivity', defaultValue: '' }
      ]
    },
    {
      title: 'Address',
      fields: [
        { id: 'address', label: 'Address of Establishment', type: 'textarea', required: true, helpText: 'Full address.', prefillFrom: 'profile.addressLine1', defaultValue: '' },
        { id: 'city', label: 'City', type: 'text', required: true, helpText: 'City.', prefillFrom: 'profile.city', defaultValue: '' },
        { id: 'state', label: 'State', type: 'select', options: ['Karnataka', 'Maharashtra', 'West Bengal', 'Andhra Pradesh', 'Telangana', 'Tamil Nadu', 'Gujarat', 'Madhya Pradesh', 'Kerala', 'Assam', 'Meghalaya', 'Odisha', 'Tripura', 'Jharkhand', 'Bihar', 'Chhattisgarh', 'Manipur', 'Mizoram', 'Nagaland', 'Sikkim', 'Puducherry'], required: true, helpText: 'State where PT registration is needed. Not all states levy PT.', prefillFrom: 'profile.state', defaultValue: '' },
        { id: 'pincode', label: 'PIN Code', type: 'text', required: true, helpText: 'PIN code.', prefillFrom: 'profile.pincode', defaultValue: '', validation: 'pin' }
      ]
    },
    {
      title: 'Responsible Person',
      fields: [
        { id: 'responsible_person_name', label: 'Name of Responsible Person', type: 'text', required: true, helpText: 'Director / partner / proprietor responsible for PT compliance.', prefillFrom: 'profile.directors[0].firstName', defaultValue: '' },
        { id: 'responsible_person_designation', label: 'Designation', type: 'text', required: true, helpText: 'Designation.', prefillFrom: '', defaultValue: 'Director' },
        { id: 'responsible_person_pan', label: 'PAN', type: 'text', required: true, helpText: 'Individual PAN.', prefillFrom: 'profile.directors[0].pan', defaultValue: '', validation: 'pan' },
        { id: 'responsible_person_mobile', label: 'Mobile', type: 'text', required: true, helpText: 'Mobile.', prefillFrom: 'profile.directors[0].mobile', defaultValue: '', validation: 'phone' },
        { id: 'responsible_person_email', label: 'Email', type: 'text', required: true, helpText: 'Email.', prefillFrom: 'profile.directors[0].email', defaultValue: '', validation: 'email' }
      ]
    },
    {
      title: 'Employee Details',
      fields: [
        { id: 'total_employees', label: 'Total Number of Employees', type: 'number', required: true, helpText: 'Total employees.', prefillFrom: 'profile.employeeCount', defaultValue: '' },
        { id: 'employees_liable', label: 'Employees Liable to Pay PT', type: 'number', required: true, helpText: 'Employees whose salary exceeds the PT threshold (varies by state, typically Rs. 15,000-25,000/month).', prefillFrom: '', defaultValue: '' },
        { id: 'monthly_pt_deduction', label: 'Estimated Monthly PT Deduction (Rs.)', type: 'number', required: true, helpText: 'Total PT deduction per month from all liable employees.', prefillFrom: '', defaultValue: '' }
      ]
    }
  ],
  fees: { amount: 2500, description: 'Registration fee varies by state. Karnataka: Rs. 2,500 for the employer. Maharashtra: No registration fee. Annual renewal may apply.' },
  timeline: '7-15 working days',
  prerequisites: ['PAN of the establishment', 'Address proof', 'Employee details and salary structure', 'Certificate of Incorporation (if company)'],
  postSubmission: ['PT Registration Number (PTRC) is allotted', 'Deduct PT from employee salaries monthly', 'Remit PT to the state government monthly (by the last day of the month)', 'File annual PT return', 'Display registration certificate'],
  portalSteps: [
    'Karnataka: pt.kar.nic.in',
    'Maharashtra: mahagst.gov.in (PT is integrated with GST portal)',
    'Register on the respective state portal',
    'Fill in employer and employee details',
    'Upload PAN, address proof, incorporation certificate',
    'Pay registration fee (if applicable)',
    'Submit and receive PTRC number',
    'Start monthly deduction and remittance'
  ]
};

// ===========================
// 18. Municipal Trade License
// ===========================
FORM_TEMPLATES['trade-license'] = {
  id: 'trade-license',
  name: 'Trade License \u2014 Municipal Trade License Application',
  authority: 'Municipal Corporation / Municipal Council / Panchayat',
  portalUrl: 'https://www.mca.gov.in/',
  description: 'Application for a trade licence from the local municipal body. Required for operating any trade, business, or profession within the municipal limits. Issued under the respective state Municipal Corporation Act. Must be obtained before commencing business. Annual renewal required.',
  sections: [
    {
      title: 'Applicant Details',
      fields: [
        { id: 'applicant_name', label: 'Name of Applicant / Business Owner', type: 'text', required: true, helpText: 'Individual / company name.', prefillFrom: 'profile.businessName', defaultValue: '' },
        { id: 'applicant_type', label: 'Type of Applicant', type: 'select', options: ['Individual / Proprietor', 'Partnership Firm', 'Private Limited Company', 'Public Limited Company', 'LLP', 'Society / Trust', 'Others'], required: true, helpText: 'Constitution of the applicant.', prefillFrom: '', defaultValue: 'Private Limited Company' },
        { id: 'pan', label: 'PAN', type: 'text', required: true, helpText: 'Business PAN.', prefillFrom: 'profile.pan', defaultValue: '', validation: 'pan' },
        { id: 'aadhaar', label: 'Aadhaar of Applicant / Authorized Person', type: 'text', required: true, helpText: 'Aadhaar.', prefillFrom: 'profile.directors[0].aadhaar', defaultValue: '' },
        { id: 'mobile', label: 'Mobile Number', type: 'text', required: true, helpText: 'Mobile.', prefillFrom: 'profile.phone', defaultValue: '', validation: 'phone' },
        { id: 'email', label: 'Email', type: 'text', required: true, helpText: 'Email.', prefillFrom: 'profile.email', defaultValue: '', validation: 'email' }
      ]
    },
    {
      title: 'Business / Trade Details',
      fields: [
        { id: 'trade_name', label: 'Name of Trade / Business', type: 'text', required: true, helpText: 'Business name as displayed at the establishment.', prefillFrom: 'profile.businessName', defaultValue: '' },
        { id: 'nature_of_trade', label: 'Nature of Trade / Business', type: 'text', required: true, helpText: 'Detailed description of the trade or business activity.', prefillFrom: 'profile.businessActivity', defaultValue: '' },
        { id: 'trade_category', label: 'Trade Category', type: 'select', options: ['General Trade', 'Food / Eatables', 'Wholesale', 'Manufacturing', 'Service / Professional', 'Medical / Pharmacy', 'IT / Software', 'Educational', 'Entertainment', 'Automobile / Garage', 'Hazardous / Inflammable', 'Storage / Godown', 'Others'], required: true, helpText: 'Category determines the licence fee.', prefillFrom: '', defaultValue: 'General Trade' },
        { id: 'date_of_commencement', label: 'Proposed / Actual Date of Commencement', type: 'date', required: true, helpText: 'Date when business commenced or will commence.', prefillFrom: 'profile.commencementDate', defaultValue: '' },
        { id: 'number_of_employees', label: 'Number of Employees', type: 'number', required: true, helpText: 'Total employees at this establishment.', prefillFrom: 'profile.employeeCount', defaultValue: '' }
      ]
    },
    {
      title: 'Premises Details',
      fields: [
        { id: 'premises_address', label: 'Address of Business Premises', type: 'textarea', required: true, helpText: 'Full address.', prefillFrom: 'profile.addressLine1', defaultValue: '' },
        { id: 'premises_ward', label: 'Ward Number / Zone', type: 'text', required: true, helpText: 'Municipal ward number.', prefillFrom: '', defaultValue: '' },
        { id: 'premises_city', label: 'City / Town', type: 'text', required: true, helpText: 'City.', prefillFrom: 'profile.city', defaultValue: '' },
        { id: 'premises_state', label: 'State', type: 'text', required: true, helpText: 'State.', prefillFrom: 'profile.state', defaultValue: '' },
        { id: 'premises_pincode', label: 'PIN Code', type: 'text', required: true, helpText: 'PIN.', prefillFrom: 'profile.pincode', defaultValue: '', validation: 'pin' },
        { id: 'premises_ownership', label: 'Premises Ownership', type: 'select', options: ['Owned', 'Rented', 'Leased'], required: true, helpText: 'Ownership status.', prefillFrom: '', defaultValue: 'Rented' },
        { id: 'premises_area', label: 'Total Area of Premises (sq. ft.)', type: 'number', required: true, helpText: 'Total area.', prefillFrom: '', defaultValue: '' },
        { id: 'property_tax_number', label: 'Property Tax Assessment Number / Khata Number', type: 'text', required: false, helpText: 'Property tax ID from the municipal records.', prefillFrom: '', defaultValue: '' }
      ]
    },
    {
      title: 'Supporting Information',
      fields: [
        { id: 'gstin', label: 'GSTIN (if registered)', type: 'text', required: false, helpText: 'GST number.', prefillFrom: 'profile.gstin', defaultValue: '', validation: 'gstin' },
        { id: 'shops_act_number', label: 'Shops & Establishment Registration Number (if obtained)', type: 'text', required: false, helpText: 'Shops Act registration number.', prefillFrom: '', defaultValue: '' },
        { id: 'fire_noc', label: 'Fire NOC (if applicable)', type: 'text', required: false, helpText: 'Fire department NOC number if applicable for the trade category.', prefillFrom: '', defaultValue: '' },
        { id: 'health_licence', label: 'Health / FSSAI Licence (if food business)', type: 'text', required: false, helpText: 'FSSAI registration/licence number.', prefillFrom: '', defaultValue: '' }
      ]
    }
  ],
  fees: { amount: 1000, description: 'Fee varies by municipality, trade category, and area of premises. Typically Rs. 500 - 25,000 per year. Hazardous trades attract higher fees.' },
  timeline: '7-30 working days. Inspection may be conducted.',
  prerequisites: ['PAN and Aadhaar of the applicant', 'Proof of premises (rent agreement / ownership document / property tax receipt)', 'NOC from property owner (if rented)', 'Passport-size photograph', 'Certificate of Incorporation (if company)', 'Property tax receipt', 'Fire NOC (for certain trades)', 'FSSAI licence (for food businesses)', 'Shops & Establishment registration'],
  postSubmission: ['Trade licence number is issued', 'Display licence at the establishment', 'Renew before expiry (typically annually)', 'Comply with any conditions mentioned in the licence'],
  portalSteps: [
    'Portal varies by city / municipality:',
    '  BBMP (Bangalore): bbmptax.karnataka.gov.in',
    '  BMC (Mumbai): portal.mcgm.gov.in',
    '  SDMC/NDMC/EDMC (Delhi): respective corporation portals',
    '  GCC (Chennai): chennaicorporation.gov.in',
    '  GHMC (Hyderabad): ghmc.gov.in',
    'Register on the municipal portal',
    'Fill in the trade licence application form',
    'Upload documents',
    'Pay the fee',
    'Submit application',
    'Inspection may be conducted by the Health Inspector',
    'Licence is issued after inspection clearance',
    'Download and display the licence'
  ]
};

// ---------------------------------------------------------------------------
// WORKFLOW DEFINITIONS
// ---------------------------------------------------------------------------

const WORKFLOWS = {
  'incorporation': {
    name: 'Company Incorporation (Private Limited)',
    forms: ['dsc-application', 'spice-plus-a', 'spice-plus-b', 'agile-pro-s', 'inc-9', 'dir-2', 'inc-20a'],
    description: 'Complete workflow from DSC application to commencement of business declaration.'
  },
  'gst-registration': {
    name: 'GST Registration',
    forms: ['gst-reg-01', 'gst-reg-06'],
    description: 'GST new registration and certificate download.'
  },
  'fssai-license': {
    name: 'FSSAI Food License',
    forms: ['fssai-form-a', 'fssai-form-b'],
    description: 'FSSAI basic registration (Form A) or state/central licence (Form B).'
  },
  'labour-compliance': {
    name: 'Labour Compliance Registrations',
    forms: ['epfo-registration', 'esic-registration', 'shops-establishment', 'professional-tax'],
    description: 'EPFO, ESIC, Shops & Establishments, and Professional Tax registrations.'
  },
  'msme-registration': {
    name: 'MSME / Udyam Registration',
    forms: ['udyam-registration'],
    description: 'Udyam (MSME) registration for micro, small, and medium enterprises.'
  },
  'director-compliance': {
    name: 'Director Compliance',
    forms: ['dsc-application', 'dir-3-kyc', 'dir-2'],
    description: 'DSC application, annual DIR-3 KYC, and consent to act as director.'
  },
  'full-launch': {
    name: 'Full Business Launch',
    forms: [
      'dsc-application', 'spice-plus-a', 'spice-plus-b', 'agile-pro-s', 'inc-9', 'dir-2', 'inc-20a',
      'gst-reg-01', 'gst-reg-06',
      'udyam-registration',
      'epfo-registration', 'esic-registration', 'shops-establishment', 'professional-tax',
      'trade-license'
    ],
    description: 'Comprehensive startup launch: incorporation, tax registrations, labour, MSME, and municipal licences.'
  }
};

// ---------------------------------------------------------------------------
// VALIDATION PATTERNS
// ---------------------------------------------------------------------------

const VALIDATION_PATTERNS = {
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+91)?[6-9]\d{9}$/,
  pin: /^\d{6}$/,
  cin: /^[A-Z]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/,
  gstin: /^\d{2}[A-Z]{5}\d{4}[A-Z]\d[A-Z][A-Z\d]Z[A-Z\d]$/,
  din: /^\d{8}$/
};

// ---------------------------------------------------------------------------
// EXPORTED FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Returns a list of all available form templates with summary info.
 */
function listForms() {
  return Object.values(FORM_TEMPLATES).map(function (form) {
    var totalFields = 0;
    var requiredFields = 0;
    form.sections.forEach(function (section) {
      totalFields += section.fields.length;
      section.fields.forEach(function (field) {
        if (field.required) { requiredFields++; }
      });
    });
    return {
      id: form.id,
      name: form.name,
      authority: form.authority,
      portalUrl: form.portalUrl,
      description: form.description,
      totalFields: totalFields,
      requiredFields: requiredFields,
      fees: form.fees,
      timeline: form.timeline
    };
  });
}

/**
 * Returns the full template for a specific form.
 */
function getFormTemplate(formId) {
  var template = FORM_TEMPLATES[formId];
  if (!template) {
    return { error: 'Form template not found: ' + formId, availableForms: Object.keys(FORM_TEMPLATES) };
  }
  return JSON.parse(JSON.stringify(template));
}

/**
 * Resolves a dotted path like 'profile.directors[0].firstName' against a data object.
 */
function resolvePath(obj, path) {
  if (!path || !obj) { return undefined; }
  var parts = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  var current = obj;
  for (var i = 0; i < parts.length; i++) {
    if (current === undefined || current === null) { return undefined; }
    current = current[parts[i]];
  }
  return current !== undefined && current !== null && current !== '' ? current : undefined;
}

/**
 * Pre-fills a form template with data from the business profile.
 * Returns the template with 'value' set on each field where a mapping exists.
 */
function prefillForm(formId, profile) {
  var template = getFormTemplate(formId);
  if (template.error) { return template; }

  var profileWrapper = { profile: profile || {} };
  var filledCount = 0;
  var totalRequired = 0;

  template.sections.forEach(function (section) {
    section.fields.forEach(function (field) {
      if (field.required) { totalRequired++; }
      if (field.prefillFrom) {
        var resolved = resolvePath(profileWrapper, field.prefillFrom);
        if (resolved !== undefined) {
          field.value = resolved;
          filledCount++;
        }
      }
      if (field.value === undefined && field.defaultValue !== undefined && field.defaultValue !== '') {
        field.value = field.defaultValue;
      }
    });
  });

  template.prefillSummary = {
    totalFields: countFields(template),
    filledFromProfile: filledCount,
    totalRequired: totalRequired,
    profileCompleteness: totalRequired > 0 ? Math.round((filledCount / totalRequired) * 100) + '%' : '0%'
  };

  return template;
}

function countFields(template) {
  var count = 0;
  template.sections.forEach(function (section) {
    count += section.fields.length;
  });
  return count;
}

/**
 * Generates a complete filled form package.
 * Returns filled fields, missing required fields, readiness status, and downloadable HTML.
 */
function generateFormPackage(formId, formData) {
  var template = getFormTemplate(formId);
  if (template.error) { return template; }

  var filledFields = [];
  var missingFields = [];
  var validationErrors = [];
  var data = formData || {};

  template.sections.forEach(function (section) {
    section.fields.forEach(function (field) {
      var value = data[field.id];
      if (value !== undefined && value !== null && value !== '') {
        field.value = value;
        filledFields.push({ id: field.id, label: field.label, value: value, section: section.title });
        if (field.validation && VALIDATION_PATTERNS[field.validation]) {
          var pattern = VALIDATION_PATTERNS[field.validation];
          if (!pattern.test(String(value))) {
            validationErrors.push({ id: field.id, label: field.label, value: value, validation: field.validation, message: 'Invalid format for ' + field.validation.toUpperCase() });
          }
        }
      } else if (field.required) {
        missingFields.push({ id: field.id, label: field.label, section: section.title, helpText: field.helpText });
      }
    });
  });

  var readyToSubmit = missingFields.length === 0 && validationErrors.length === 0;
  var downloadHtml = renderFormHtml(formId, data);

  return {
    form: template,
    filledFields: filledFields,
    missingFields: missingFields,
    validationErrors: validationErrors,
    readyToSubmit: readyToSubmit,
    summary: {
      formName: template.name,
      authority: template.authority,
      totalFields: countFields(template),
      filled: filledFields.length,
      missing: missingFields.length,
      errors: validationErrors.length,
      fees: template.fees,
      timeline: template.timeline,
      ready: readyToSubmit ? 'READY for submission' : 'NOT READY \u2014 ' + missingFields.length + ' required field(s) missing, ' + validationErrors.length + ' validation error(s)'
    },
    downloadHtml: downloadHtml
  };
}

/**
 * Returns the ordered list of forms needed for a workflow.
 */
function getFormsForWorkflow(workflow) {
  var wf = WORKFLOWS[workflow];
  if (!wf) {
    return { error: 'Unknown workflow: ' + workflow, availableWorkflows: Object.keys(WORKFLOWS) };
  }
  return {
    workflow: workflow,
    name: wf.name,
    description: wf.description,
    totalForms: wf.forms.length,
    forms: wf.forms.map(function (formId, index) {
      var t = FORM_TEMPLATES[formId];
      return {
        step: index + 1,
        id: t.id,
        name: t.name,
        authority: t.authority,
        portalUrl: t.portalUrl,
        timeline: t.timeline,
        fees: t.fees,
        totalFields: countFields(t)
      };
    })
  };
}

/**
 * Renders a professional downloadable HTML representation of a filled form.
 */
function renderFormHtml(formId, filledData) {
  var template = FORM_TEMPLATES[formId];
  if (!template) { return '<html><body><p>Form template not found: ' + escapeHtml(formId) + '</p></body></html>'; }

  var data = filledData || {};
  var now = new Date();
  var dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  var html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>' + escapeHtml(template.name) + '</title>\n<style>\n';
  html += getFormStyles();
  html += '\n</style>\n</head>\n<body>\n';

  // Watermark
  html += '<div class="watermark">DRAFT &mdash; For Review Before Portal Submission</div>\n';

  // Header
  html += '<div class="form-header">\n';
  html += '<div class="authority-name">' + escapeHtml(template.authority) + '</div>\n';
  html += '<div class="form-title">' + escapeHtml(template.name) + '</div>\n';
  html += '<div class="form-meta">Portal: <a href="' + escapeHtml(template.portalUrl) + '">' + escapeHtml(template.portalUrl) + '</a></div>\n';
  html += '<div class="form-meta">Generated: ' + dateStr + ' | Timeline: ' + escapeHtml(template.timeline) + '</div>\n';
  if (template.fees) {
    html += '<div class="form-meta">Fees: Rs. ' + template.fees.amount.toLocaleString('en-IN') + ' \u2014 ' + escapeHtml(template.fees.description) + '</div>\n';
  }
  html += '</div>\n';

  // Description
  html += '<div class="form-description">' + escapeHtml(template.description) + '</div>\n';

  // Sections
  template.sections.forEach(function (section) {
    html += '<div class="section">\n';
    html += '<div class="section-title">' + escapeHtml(section.title) + '</div>\n';
    html += '<table class="field-table">\n';
    html += '<thead><tr><th class="col-label">Field</th><th class="col-value">Value</th><th class="col-help">Guidance</th></tr></thead>\n';
    html += '<tbody>\n';

    section.fields.forEach(function (field) {
      var value = data[field.id];
      var displayValue = '';
      var valueClass = 'field-value';

      if (value !== undefined && value !== null && value !== '') {
        displayValue = String(value);
        if (field.type === 'checkbox') {
          displayValue = value ? '\u2611 Yes' : '\u2610 No';
        }
      } else if (field.defaultValue !== undefined && field.defaultValue !== '') {
        displayValue = String(field.defaultValue);
        valueClass = 'field-value default-value';
      } else {
        displayValue = field.required ? '\u2014 REQUIRED \u2014' : '\u2014';
        valueClass = field.required ? 'field-value missing-value' : 'field-value';
      }

      html += '<tr>\n';
      html += '<td class="col-label"><span class="field-label">' + escapeHtml(field.label) + '</span>';
      if (field.required) { html += ' <span class="required-marker">*</span>'; }
      if (field.validation) { html += ' <span class="validation-tag">' + field.validation.toUpperCase() + '</span>'; }
      html += '</td>\n';
      html += '<td class="col-value"><span class="' + valueClass + '">' + escapeHtml(displayValue) + '</span></td>\n';
      html += '<td class="col-help"><span class="help-text">' + escapeHtml(field.helpText || '') + '</span></td>\n';
      html += '</tr>\n';
    });

    html += '</tbody>\n</table>\n</div>\n';
  });

  // Prerequisites checklist
  if (template.prerequisites && template.prerequisites.length > 0) {
    html += '<div class="checklist-section">\n';
    html += '<div class="section-title">Prerequisites &amp; Documents Checklist</div>\n';
    html += '<ul class="checklist">\n';
    template.prerequisites.forEach(function (item) {
      html += '<li><span class="checkbox">\u2610</span> ' + escapeHtml(item) + '</li>\n';
    });
    html += '</ul>\n</div>\n';
  }

  // Post-submission actions
  if (template.postSubmission && template.postSubmission.length > 0) {
    html += '<div class="checklist-section">\n';
    html += '<div class="section-title">Post-Submission Actions</div>\n';
    html += '<ol class="post-submission">\n';
    template.postSubmission.forEach(function (item) {
      html += '<li>' + escapeHtml(item) + '</li>\n';
    });
    html += '</ol>\n</div>\n';
  }

  // Portal step-by-step instructions
  if (template.portalSteps && template.portalSteps.length > 0) {
    html += '<div class="portal-steps">\n';
    html += '<div class="section-title">Portal Submission Steps</div>\n';
    html += '<ol class="steps-list">\n';
    template.portalSteps.forEach(function (step) {
      html += '<li>' + escapeHtml(step) + '</li>\n';
    });
    html += '</ol>\n</div>\n';
  }

  // Footer
  html += '<div class="form-footer">\n';
  html += '<p>This draft was generated by NyaayaMitra for internal review. It is NOT a government-issued form.</p>\n';
  html += '<p>Do NOT submit this PDF directly to any authority. Use this as a reference to fill the live portal form.</p>\n';
  html += '<p>Verify all details against original documents before portal submission.</p>\n';
  html += '<p class="generated-at">Generated: ' + now.toISOString() + '</p>\n';
  html += '</div>\n';

  html += '</body>\n</html>';

  return html;
}

function escapeHtml(str) {
  if (str === undefined || str === null) { return ''; }
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getFormStyles() {
  return [
    '* { margin: 0; padding: 0; box-sizing: border-box; }',
    'body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; font-size: 11pt; color: #1a1a1a; background: #fff; padding: 20px 30px; line-height: 1.5; }',
    '@media print { body { padding: 10px 15px; } .watermark { position: fixed !important; } }',
    '.watermark { position: fixed; top: 40%; left: 50%; transform: translate(-50%, -50%) rotate(-35deg); font-size: 48pt; font-weight: bold; color: rgba(220, 53, 69, 0.08); white-space: nowrap; pointer-events: none; z-index: 9999; letter-spacing: 4px; }',
    '.form-header { text-align: center; border-bottom: 3px solid #1a237e; padding-bottom: 15px; margin-bottom: 20px; }',
    '.authority-name { font-size: 16pt; font-weight: bold; color: #1a237e; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }',
    '.form-title { font-size: 13pt; font-weight: 600; color: #333; margin-bottom: 6px; }',
    '.form-meta { font-size: 9pt; color: #555; margin-bottom: 2px; }',
    '.form-meta a { color: #1a237e; text-decoration: none; }',
    '.form-description { background: #f8f9fa; border-left: 4px solid #1a237e; padding: 10px 15px; margin-bottom: 20px; font-size: 10pt; color: #444; }',
    '.section { margin-bottom: 20px; page-break-inside: avoid; }',
    '.section-title { background: #1a237e; color: #fff; padding: 6px 12px; font-size: 11pt; font-weight: 600; margin-bottom: 0; }',
    '.field-table { width: 100%; border-collapse: collapse; border: 1px solid #ccc; }',
    '.field-table thead th { background: #e8eaf6; color: #1a237e; font-size: 9pt; font-weight: 600; padding: 5px 8px; text-align: left; border: 1px solid #ccc; }',
    '.field-table tbody tr { border-bottom: 1px solid #e0e0e0; }',
    '.field-table tbody tr:nth-child(even) { background: #fafafa; }',
    '.field-table td { padding: 5px 8px; vertical-align: top; border: 1px solid #e0e0e0; }',
    '.col-label { width: 30%; }',
    '.col-value { width: 35%; }',
    '.col-help { width: 35%; }',
    '.field-label { font-weight: 500; font-size: 10pt; }',
    '.required-marker { color: #dc3545; font-weight: bold; }',
    '.validation-tag { display: inline-block; background: #e3f2fd; color: #1565c0; font-size: 7pt; padding: 1px 4px; border-radius: 3px; font-weight: 600; margin-left: 4px; }',
    '.field-value { font-size: 10pt; }',
    '.default-value { color: #666; font-style: italic; }',
    '.missing-value { color: #dc3545; font-weight: 600; font-size: 9pt; }',
    '.help-text { font-size: 8.5pt; color: #777; }',
    '.checklist-section { margin-bottom: 20px; }',
    '.checklist { list-style: none; padding: 8px 15px; }',
    '.checklist li { padding: 3px 0; font-size: 10pt; }',
    '.checkbox { margin-right: 8px; font-size: 12pt; }',
    '.post-submission { padding-left: 25px; }',
    '.post-submission li { padding: 3px 0; font-size: 10pt; }',
    '.portal-steps { margin-bottom: 20px; background: #f1f8e9; border: 1px solid #c5e1a5; padding: 10px 15px; page-break-inside: avoid; }',
    '.portal-steps .section-title { background: #33691e; margin: -10px -15px 10px -15px; padding: 6px 15px; }',
    '.steps-list { padding-left: 25px; }',
    '.steps-list li { padding: 3px 0; font-size: 10pt; }',
    '.form-footer { border-top: 2px solid #1a237e; padding-top: 12px; margin-top: 25px; text-align: center; }',
    '.form-footer p { font-size: 9pt; color: #666; margin-bottom: 4px; }',
    '.form-footer .generated-at { font-size: 8pt; color: #999; }'
  ].join('\n');
}

// ---------------------------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------------------------

module.exports = {
  listForms: listForms,
  getFormTemplate: getFormTemplate,
  prefillForm: prefillForm,
  generateFormPackage: generateFormPackage,
  getFormsForWorkflow: getFormsForWorkflow,
  renderFormHtml: renderFormHtml
};
