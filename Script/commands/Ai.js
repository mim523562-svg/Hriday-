/**
 * ╔══════════════════════════════════════════════╗
 * ║              🤖 AI CHAT BOT                 ║
 * ║                                              ║
 * ║  Direct API — No baseApiUrl.json            ║
 * ║  Developer: হৃদয় হাসান শান্ত                ║
 * ╚══════════════════════════════════════════════╝
 */

const axios = require("axios");

const AI_API = "https://vexa-ai.pages.dev/query";

module.exports.config = {
  name: "ai",
  version: "5.0.0",
  hasPermssion: 0,
  credits: "হৃদয় হাসান শান্ত",
  description: "AI Chat",
  commandCategory: "AI",
  usages: "ai <প্রশ্ন>",
  cooldowns: 3,
  usePrefix: true,
  aliases: ["chat", "gpt", "ask"]
};

async function askAI(question) {
  try {
    const response = await axios.get(AI_API, {
      params: {
        q: question
      },
      timeout: 30000,
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
      }
    });

    const data = response.data;

    console.log("AI API Response:", data);

    const answer =
      data?.answer ||
      data?.response ||
      data?.result ||
      data?.text ||
      data?.message;

    if (!answer) {
      return {
        ok: false,
        error: "AI API থেকে কোনো উত্তর পাওয়া যায়নি।"
      };
    }

    return {
      ok: true,
      answer: String(answer)
    };

  } catch (error) {
    console.error(
      "AI API ERROR:",
      error.response?.status || "",
      error.response?.data || error.message
    );

    return {
      ok: false,
      error: error.response?.status
        ? `API HTTP ${error.response.status} Error`
        : "AI API-তে সংযোগ করা যাচ্ছে না।"
    };
  }
}

module.exports.run = async function ({ api, event, args }) {

  const question = args.join(" ").trim();

  if (!question) {
    return api.sendMessage(
      "🤖 AI-কে কিছু জিজ্ঞেস করুন!\n\n" +
      "📌 Example:\n" +
      "ai তুমি কেমন আছো?",
      event.threadID,
      event.messageID
    );
  }

  try {

    if (api.sendTypingIndicator) {
      await api.sendTypingIndicator(event.threadID, true);
    }

    const result = await askAI(question);

    if (api.sendTypingIndicator) {
      await api.sendTypingIndicator(event.threadID, false);
    }

    if (!result.ok) {
      return api.sendMessage(
        `❌ AI API সমস্যা\n\n⚠️ ${result.error}`,
        event.threadID,
        event.messageID
      );
    }

    return api.sendMessage(
      `🤖 𝐀𝐈 𝐑𝐄𝐏𝐋𝐘\n\n${result.answer}\n\n` +
      `💠 Developer: হৃদয় হাসান শান্ত`,
      event.threadID,
      event.messageID
    );

  } catch (error) {

    console.error("AI Command Error:", error);

    return api.sendMessage(
      "❌ AI command-এ সমস্যা হয়েছে।\n\n" +
      "⚠️ একটু পরে আবার চেষ্টা করুন।",
      event.threadID,
      event.messageID
    );
  }
};
