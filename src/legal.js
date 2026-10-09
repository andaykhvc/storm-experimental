// Public legal information. Fill these fields with confirmed details only.
// See docs/legal-publication.md for the decisions still needed before publication.
export const legal = {
  updated: '2026-10-09',
  controllerName: 'Storm Nijhuis',
  business: {
    registeredName: null,
    tradingName: null,
    address: null,
    addressShielded: null,
    kvkNumber: null,
    vatId: null,
    vatApplicable: null,
  },
  privacy: {
    enquiryRetention: null,
    hostingLogRetention: null,
    transferSafeguards: null,
  },
  // Confirm this against the deployed Vercel project, including injected scripts.
  deploymentPrivacyVerified: false,
};

export function businessInformationMissing() {
  const business = legal.business;
  return !business.registeredName || !business.tradingName || !business.kvkNumber
    || (!business.address && business.addressShielded !== true)
    || business.vatApplicable === null || (business.vatApplicable && !business.vatId);
}

export function privacyInformationMissing() {
  return !legal.privacy.enquiryRetention || !legal.privacy.hostingLogRetention
    || !legal.privacy.transferSafeguards || !legal.deploymentPrivacyVerified;
}
