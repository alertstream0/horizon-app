import emailjs from '@emailjs/browser';

// These should be in environment variables in a real app
const SERVICE_ID = "service_horizon_demo"; // Placeholder
const TEMPLATE_ID = "template_resolution"; // Placeholder
const PUBLIC_KEY = "user_demo_key"; // Placeholder

export const emailService = {
  /**
   * Sends a resolution email to the passenger
   * @param {string} toEmail - Passenger's email
   * @param {string} toName - Passenger's name
   * @param {string} caseId - Complaint Reference ID
   * @param {string} message - The resolution message
   */
  sendResolution: async (toEmail, toName, caseId, message) => {
    try {
      if (!toEmail || !toEmail.includes('@')) {
        console.warn("EmailService: No valid email provided.");
        return false;
      }

      console.log(`EmailService: Sending to ${toEmail} (${caseId})...`);
      
      // Since we don't have a real key yet, we simulate a success for the UI
      // In production, uncomment the line below:
      // await emailjs.send(SERVICE_ID, TEMPLATE_ID, { to_name: toName, to_email: toEmail, message, case_id: caseId }, PUBLIC_KEY);
      
      await new Promise(r => setTimeout(r, 1500)); // Simulate network delay
      console.log("EmailService: Sent successfully!");
      return true;
    } catch (error) {
      console.error("EmailService Error:", error);
      throw error;
    }
  }
};
