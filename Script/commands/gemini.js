/**
 * ╔══════════════════════════════════════════════╗
 * ║              🤖 GEMINI AI BOT               ║
 * ║                                              ║
 * ║  Developer : হৃদয় হাসান শান্ত                ║
 * ║  Platform  : Mirai Bot                       ║
 * ║  Version   : 1.0.0                           ║
 * ╚══════════════════════════════════════════════╝
 */

const axios = require("axios");

const API_CONFIG =
  "https://raw.githubusercontent.com/aryannix/stuffs/master/raw/apis.json";

module.exports.config = {
  name: "gemini",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "💠 𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐀𝐒𝐀𝐍 𝐒𝐇𝐀𝐍𝐓𝐎 💠",
  description: "Ask Gemini AI",
  commandCategory: "AI",
  usages: "gemini [your question]",
  cooldowns: 3,
  aliases: ["ai", "chat"]
};

module.exports.run = async function ({ api, event, args }) {
  const prompt = args.join(" ").trim();

  if (!prompt) {
    return api.sendMessage(
      "❌ | Please provide a question.\n\nExample:\n/gemini Hello",
      event.threadID,
      event.messageID
    );
  }

  api.setMessageReaction("⏳", event.messageID, () => {}, true);

  try {
    // Get API configuration
    const configResponse = await axios.get(API_CONFIG, {
      timeout: 15000
    });

    const baseApi = configResponse.data?.api;

    if (!baseApi) {
      throw new Error("API URL not found");
    }

    // Gemini request
    const response = await axios.get(
      `${baseApi}/gemini?prompt=${encodeURIComponent(prompt)}`,
      {
        timeout: 30000
      }
    );

    const reply = response.data?.response;

    if (!reply) {
      throw new Error("Empty Gemini response");
    }

    api.setMessageReaction("✅", event.messageID, () => {}, true);

    api.sendMessage(
      `🤖 Gemini AI\n\n${reply}`,
      event.threadID,
      (err, info) => {
        if (err || !info) return;

        // Save reply session
        if (global.client && global.client.handleReply) {
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            baseApi: baseApi
          });
        }
      },
      event.messageID
    );

  } catch (error) {
    console.error("[Gemini Error]", error);

    api.setMessageReaction("❌", event.messageID, () => {}, true);

    api.sendMessage(
      "⚠️ | Gemini AI থেকে response পাওয়া যাচ্ছে না।\n\n" +
      "কিছুক্ষণ পরে আবার চেষ্টা করুন।",
      event.threadID,
      event.messageID
    );
  }
};


// ===============================
//        REPLY HANDLER
// ===============================

module.exports.handleReply = async function ({ api, event, handleReply }) {
  if (!handleReply) return;

  // Only the original user can continue the session
  if (event.senderID !== handleReply.author) return;

  const prompt = event.body?.trim();

  if (!prompt) return;

  const baseApi = handleReply.baseApi;

  if (!baseApi) {
    return api.sendMessage(
      "❌ | Session expired. Please use /gemini again.",
      event.threadID,
      event.messageID
    );
  }

  api.setMessageReaction("⏳", event.messageID, () => {}, true);

  try {
    const response = await axios.get(
      `${baseApi}/gemini?prompt=${encodeURIComponent(prompt)}`,
      {
        timeout: 30000
      }
    );

    const reply = response.data?.response;

    if (!reply) {
      throw new Error("Empty Gemini response");
    }

    api.setMessageReaction("✅", event.messageID, () => {}, true);

    api.sendMessage(
      `🤖 Gemini AI\n\n${reply}`,
      event.threadID,
      (err, info) => {
        if (err || !info) return;

        if (global.client && global.client.handleReply) {
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            baseApi: baseApi
          });
        }
      },
      event.messageID
    );

  } catch (error) {
    console.error("[Gemini Reply Error]", error);

    api.setMessageReaction("❌", event.messageID, () => {}, true);

    api.sendMessage(
      "⚠️ | Gemini AI response দিতে সমস্যা হচ্ছে।",
      event.threadID,
      event.messageID
    );
  }
};
