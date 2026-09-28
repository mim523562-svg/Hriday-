/**
 * ╔══════════════════════════════════════════════╗
 * ║              🤖 AUTO REACT BOT              ║
 * ║          💠 HRIDOY HASAN SHANTO 💠          ║
 * ║                 Version 2.0.0               ║
 * ╚══════════════════════════════════════════════╝
 */

module.exports.config = {
  name: "autoreact",
  version: "2.0.0",
  hasPermission: 0,
  credits: "HRIDOY HASAN SHANTO",
  description: "Automatically reacts to every new message",
  commandCategory: "No Prefix",
  cooldowns: 0,
  usages: "autoreact [on/off/toggle]"
};

// =====================================================
// 😍 REACTION LIST
// =====================================================

const emojis = [
  // Faces
  "😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇",
  "🙂","🙃","😉","😌","😍","🥰","😘","😗","😙","😚",
  "😋","😛","😝","😜","🤪","🤨","🧐","🤓","😎","🤩",
  "🥳","😏","😒","😞","😔","😟","😕","🙁","☹️","😣",
  "😖","😫","😩","🥺","😢","😭","😤","😠","😡","🤬",
  "🤯","😳","🥵","🥶","😱","😨","😰","😥","😓","🤗",
  "🤭","🫢","🫣","🤫","🤔","🫡","🤐","😐","😑","😶",
  "🙄","😬","😮","😯","😲","😴","🤤","😪","😵","🥴",
  "🤢","🤮","🤧","😷","🤠","🥸","😈","👿","👹","👺",
  "🤡","💩","👻","💀","☠️","👽","👾","🤖",

  // ❤️ Hearts
  "❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","🩷",
  "🩵","🩶","💔","❤️‍🔥","❤️‍🩹","💕","💞","💓","💗",
  "💖","💘","💝","💟","❣️","💯","💫","✨","⭐","🌟",
  "🔥","💥","⚡","🌈",

  // 🌸 Nature
  "☀️","🌙","🌸","🌺","🌻","🌹","🌷","🌼","💐",
  "🍀","🌿","🍁","🍂","🍃","🌱","🌴","🌵",

  // 🤝 Hands
  "👍","👎","👌","✌️","🤞","🤟","🤘","🤙","👋","👏",
  "🙌","👐","🤲","🙏","💪","🫶","🫰","🤌","✍️","🤳",
  "💅","👀","👄","👂","👃","🧠","💋",

  // 🎉 Fun
  "🎉","🎊","🎈","🎁","🎂","🎀","🎵","🎶","🎸","🎹",
  "🥁","🎧","🎤","🎬","🎮","🏆","🥇","🥈","🥉","🚀",

  // 🐾 Animals
  "🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯",
  "🦁","🐮","🐷","🐸","🐵","🙈","🙉","🙊","🐔","🐧",
  "🐦","🦋","🐝","🐞","🦄","🐴","🐢","🐍","🦎","🐊",
  "🐳","🐬","🐟","🐠","🦈","🐙","🦀","🦐","🦑","🐚"
];

// =====================================================
// 🔧 HELPERS
// =====================================================

function getRandomEmoji() {
  return emojis[Math.floor(Math.random() * emojis.length)];
}

function isEnabled(threadData) {
  return threadData && threadData["autoreact"] === true;
}

// =====================================================
// ⚡ AUTO REACT EVENT
// =====================================================

module.exports.handleEvent = async ({ api, event }) => {
  try {
    if (!event || !event.threadID || !event.messageID) return;

    // Ignore bot messages
    if (event.isGroup === false && !event.threadID) return;

    const threadData =
      global.data?.threadData?.get(event.threadID) || {};

    // Auto-react disabled
    if (!isEnabled(threadData)) return;

    const reaction = getRandomEmoji();

    api.setMessageReaction(
      reaction,
      event.messageID,
      (error) => {
        if (error) {
          console.error(
            `[AUTOREACT] Failed: ${error.message || error}`
          );
        }
      },
      true
    );

  } catch (error) {
    console.error(
      `[AUTOREACT] Event Error: ${error.message || error}`
    );
  }
};

// =====================================================
// 🎛️ COMMAND
// =====================================================

module.exports.run = async ({ api, event, Threads }) => {
  try {
    const { threadID, messageID, body = "" } = event;

    const threadInfo = await Threads.getData(threadID);

    if (!threadInfo || !threadInfo.data) {
      return api.sendMessage(
        "❌ Thread data পাওয়া যায়নি!",
        threadID,
        messageID
      );
    }

    const data = threadInfo.data;

    const args = body
      .trim()
      .split(/\s+/)
      .slice(1);

    const action = (args[0] || "toggle").toLowerCase();

    // ===============================
    // ON
    // ===============================

    if (action === "on") {
      data.autoreact = true;
    }

    // ===============================
    // OFF
    // ===============================

    else if (action === "off") {
      data.autoreact = false;
    }

    // ===============================
    // TOGGLE
    // ===============================

    else if (action === "toggle") {
      data.autoreact = !data.autoreact;
    }

    // ===============================
    // INVALID
    // ===============================

    else {
      return api.sendMessage(
        "❌ ভুল ব্যবহার!\n\n" +
        "✅ autoreact on\n" +
        "❌ autoreact off\n" +
        "🔄 autoreact toggle",
        threadID,
        messageID
      );
    }

    // Save thread data
    await Threads.setData(threadID, {
      data: data
    });

    // Update global cache
    if (global.data?.threadData) {
      global.data.threadData.set(threadID, data);
    }

    const status = data.autoreact === true;

    return api.sendMessage(
      status
        ? "╭──────────────╮\n" +
          "│ 🤖 AUTO REACT │\n" +
          "├──────────────┤\n" +
          "│ 🟢 Status: ON │\n" +
          "│ 💫 Random React Active\n" +
          "╰──────────────╯"
        : "╭──────────────╮\n" +
          "│ 🤖 AUTO REACT │\n" +
          "├──────────────┤\n" +
          "│ 🔴 Status: OFF│\n" +
          "╰──────────────╯",
      threadID,
      messageID
    );

  } catch (error) {
    console.error(
      `[AUTOREACT] Command Error: ${error.message || error}`
    );

    return api.sendMessage(
      "❌ Auto-react চালু/বন্ধ করতে সমস্যা হয়েছে!\n\n" +
      `🔴 Error: ${error.message || error}`,
      event.threadID,
      event.messageID
    );
  }
};

ব্যবহার

autoreact on

🟢 Auto-react চালু

autoreact off

🔴 Auto-react বন্ধ

autoreact toggle

🔄 বর্তমান অবস্থার বিপরীত করবে

গুরুত্বপূর্ণ: এখানে আগের ""🥰"" key-এর বদলে পরিষ্কারভাবে ""autoreact"" key ব্যবহার করেছি, তাই অন্য কোনো ""🥰"" thread setting-এর সঙ্গে conflict হবে না।
