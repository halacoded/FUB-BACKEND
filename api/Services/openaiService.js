const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function parseOrderIntent(messageText) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are an Arabic-English food assistant. Extract food items, preferences, and return a snaccable summary in Arabic.",
      },
      {
        role: "user",
        content: messageText,
      },
    ],
  });

  return response.choices[0].message.content;
}
module.exports = { parseOrderIntent };
