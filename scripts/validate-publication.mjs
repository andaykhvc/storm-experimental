import { legal } from '../src/legal.js';

const missing = [];
const business = legal.business;
if (!business.registeredName) missing.push('Registered business name');
if (!business.tradingName) missing.push('Trading name');
if (!business.address && business.addressShielded !== true) missing.push('Business address or confirmed address shielding');
if (!business.kvkNumber) missing.push('KVK number');
else if (!/^\d{8}$/.test(business.kvkNumber)) missing.push('KVK number must contain 8 digits');
if (business.vatApplicable === null) missing.push('Whether a VAT identification number applies');
else if (business.vatApplicable && !/^NL\d{9}B\d{2}$/.test(business.vatId || '')) missing.push('Public Dutch VAT identification number (not the private tax number)');
if (!legal.privacy.enquiryRetention) missing.push('Confirmed enquiry retention policy');
if (!legal.privacy.hostingLogRetention) missing.push('Vercel hosting/security log retention');
if (!legal.privacy.transferSafeguards) missing.push('International-transfer arrangements for the actual Vercel and Gmail accounts');
if (!legal.deploymentPrivacyVerified) missing.push('Live deployment checked for optional scripts, cookies and hosting security features');

if (missing.length) {
  console.error(`Legal pages remain drafts. Confirm these details in src/legal.js:\n${missing.map((item) => `- ${item}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log('Required legal publication details are present. This checks completeness and number formats, not legal compliance or actual account settings.');
}
