const twilio = require("twilio");

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

async function sendTwilioReply(to, message) {
  try {
    console.log("💬 Final message to Twilio:", message);

    await client.messages.create({
      from: "whatsapp:+14155238886", // Twilio sandbox number
      to, // Format: 'whatsapp:+YOUR_USER_NUMBER'
      body: message,
    });
  } catch (error) {
    console.error("Error sending WhatsApp reply:", error.message);
  }
}

module.exports = { sendTwilioReply };
