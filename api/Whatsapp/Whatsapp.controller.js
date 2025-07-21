// const { interpretMessage } = require("../services/openaiService");
const { sendTwilioReply } = require("../Services/twilioService");
const { parseOrderIntent } = require("../Services/openaiService");
// exports.handleIncomingMessage = async (req, res) => {
//   const { Body, From } = req.body;
//   console.log(`Incoming from ${From}: ${Body}`);

//   const response = await interpretMessage(Body);
//   await sendTwilioReply(From, response);

//   res.sendStatus(200);
// };

// exports.handleIncomingMessage = async (req, res) => {
//   const { Body, From } = req.body;
//   console.log(`Incoming from ${From}: ${Body}`);

//   const replyText = `You said: ${Body}`; // You can swap in OpenAI reply later
//   await sendTwilioReply(From, replyText);

//   res.sendStatus(200);
// };

// exports.handleIncomingMessage = async (req, res) => {
//   console.log("🔥 Twilio hit the webhook!");
//   console.log("Body:", req.body);

//   const { Body, From } = req.body;
//   const replyText = `You said: ${Body}`;
//   await sendTwilioReply(From, replyText);

//   res.sendStatus(200);
// };

exports.handleIncomingMessage = async (req, res) => {
  const { Body, From } = req.body;

  const reply = await parseOrderIntent(Body);
  await sendTwilioReply(From, reply);

  res.status(200).end();
};
