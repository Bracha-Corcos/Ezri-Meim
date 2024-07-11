// emailService.js

import { functions } from './firebase.js';

export const sendApprovalEmail = async (email) => {
  try {
    const sendEmail = functions.httpsCallable('sendApprovalEmail');
    await sendEmail({ email });
  } catch (error) {
    console.error("Error sending approval email:", error);
  }
};
