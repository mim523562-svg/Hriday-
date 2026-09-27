/**
 * ╔══════════════════════════════════════════════╗
 * ║             MIRAI BOT — AUTOREACT            ║
 * ║        Developer: HRIDOY HASAN SHANTO        ║
 * ║                  Version: 1.0.1              ║
 * ╚══════════════════════════════════════════════╝
 */

module.exports = {
  config: {
    name: "autoreact",
    version: "1.0.1",
    author: "HRIDOY HASAN SHANTO",

    // ✅ Mirai loader compatibility
    commandCategory: "system",

    countDown: 5,
    role: 0,

    shortDescription: "Automatic message reaction",
    longDescription: "Automatically reacts to specific words and emojis."
  },

  // ✅ Required command function
  run: async function ({ api, event }) {
    // Autoreact works through handleEvent
  },

  // ✅ Message event listener
  handleEvent: async function ({ api, event }) {
    try {
      if (!event || !event.body) return;

      const text = String(event.body).toLowerCase();

      const reactions = [
        ["iloveyou", "😙"],
        ["good night", "💗"],
        ["good morning", "💗"],
        ["pakyo", "😠"],
        ["mahal", "💗"],
        ["mwa", "💗"],

        ["😢", "😢"],
        ["😆", "😆"],
        ["😂", "😆"],
        ["🤣", "😆"],

        ["tangina", "😡"],
        ["good afternoon", "❤"],
        ["good evening", "❤"],
        ["gago", "😡"],

        ["bastos", "😳"],
        ["bas2s", "😳"],
        ["bastog", "😳"],

        ["hi", "💗"],
        ["hello", "💗"],
        ["zope", "⏳"],

        ["pangit", "😠"],
        ["redroom", "😏"],
        ["😏", "😏"],

        ["pakyu", "🤬"],
        ["fuck you", "🤬"],

        ["bata", "👧"],
        ["kid", "👧"],

        ["i hate you", "😞"],
        ["useless", "😓"],
        ["omg", "😮"],

        ["shoti", "😏"],
        ["pogi", "😎"],
        ["ganda", "💗"],

        ["i miss you", "💗"],
        ["sad", "😔"]
      ];

      for (const [keyword, reaction] of reactions) {
        if (text.includes(keyword)) {
          await api.setMessageReaction(
            reaction,
            event.messageID,
            event.threadID
          );
          break;
        }
      }

    } catch (error) {
      console.error("❌ AUTOREACT ERROR:", error);
    }
  }
};
