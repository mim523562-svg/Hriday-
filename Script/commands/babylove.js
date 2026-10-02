/**
 * ╔══════════════════════════════════════════════╗
 * ║             🐥 BABYLOVE BOT                ║
 * ║      Voice + Song + RX API + Menu          ║
 * ║      Developer: হৃদয় হাসান শান্ত           ║
 * ╚══════════════════════════════════════════════╝
 */

const axios = require("axios");
const fs = require("fs");
const path = require("path");

// ═══════════════════════════════════════════════
// BASIC CONFIG
// ═══════════════════════════════════════════════

const API_JSON_URL =
  "https://raw.githubusercontent.com/rummmmna21/rx-api/refs/heads/main/baseApiUrl.json";

const MARKER = "\u200B";

const songProgress = {};

// ═══════════════════════════════════════════════
// COMMAND CONFIG
// ═══════════════════════════════════════════════

module.exports.config = {
  name: "babylove",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "হৃদয় হাসান শান্ত",
  description:
    "BabyLove voice, song, RX API and automatic menu system",
  commandCategory: "auto",
  usages: "Baby",
  cooldowns: 0,
  prefix: false
};

// ═══════════════════════════════════════════════
// VOICE TRIGGERS
// ═══════════════════════════════════════════════

const triggers = [
  {
    keywords: ["ghumabo"],
    audioUrl: "https://files.catbox.moe/us0nva.mp3",
    reply: "😴 Okaay baby, sweet dreams 🌙",
    fileName: "ghumabo.mp3"
  },

  {
    keywords: ["🤨🤨", "🙄🙄"],
    audioUrl: "https://files.catbox.moe/vgzkeu.mp3",
    reply: "jaki 🐥",
    fileName: "jaki.mp3"
  },

  {
    keywords: ["ringtone"],
    audioUrl: "https://files.catbox.moe/ga798u.mp3",
    reply: "💖 ay lo. Baby!",
    fileName: "bhalobashi.mp3"
  },

  {
    keywords: ["kanna"],
    audioUrl: "https://files.catbox.moe/6xbjbb.mp3",
    reply: "",
    fileName: "whataga.mp3"
  },

  {
    keywords: ["busy naki"],
    audioUrl: "https://files.catbox.moe/cw9bdy.mp3",
    reply: "🥴🤔",
    fileName: "busy.mp3"
  },

  {
    keywords: ["bby explain"],
    audioUrl: "https://files.catbox.moe/ijgma4.mp3",
    reply: "📝 go away!",
    fileName: "explain.mp3"
  },

  {
    keywords: ["mari gan", "mari vabi gan"],
    audioUrl: "https://files.catbox.moe/vw58fi.mp3",
    reply: "",
    fileName: "mariasong.mp3"
  },

  {
    keywords: ["choose"],
    audioUrl: "https://files.catbox.moe/hqw3my.mp3",
    reply: "🧃🐣",
    fileName: "iloveyou.mp3"
  },

  {
    keywords: ["dami un gar"],
    audioUrl: "https://files.catbox.moe/07txpg.mp3",
    reply: "🎀 ukhe",
    fileName: "ukhe.mp3"
  },

  {
    keywords: ["amr girlfriend"],
    audioUrl: "https://files.catbox.moe/v395oa.mp3",
    reply: "Oow 🫡🎀",
    fileName: "gfkoliza.mp3"
  }
];

// ═══════════════════════════════════════════════
// SONG LIST
// ═══════════════════════════════════════════════

const deepSongs = [
  {
    url: "https://files.catbox.moe/uodwqm.mp3",
    title: "🎵 Ei ta tmr jonno"
  },

  {
    url: "https://files.catbox.moe/v4i4uc.mp3",
    title: "🎶"
  },

  {
    url: "https://files.catbox.moe/tbdd6q.mp3",
    title: "🎧 kmn Hoise"
  },

  {
    url: "https://files.catbox.moe/5m6t42.mp3",
    title: "🔥 Created by rX"
  },

  {
    url: "https://files.catbox.moe/ag634t.mp3",
    title: "💥❤️‍🩹"
  },

  {
    url: "https://files.catbox.moe/k7gdw6.mp3",
    title: "🫠😊"
  },

  {
    url: "https://files.catbox.moe/wqrc2m.mp3",
    title: "🎀🧃"
  }
];

// ═══════════════════════════════════════════════
// TEXT MARKER
// ═══════════════════════════════════════════════

function withMarker(text = "") {
  return `${text}${MARKER}`;
}

// ═══════════════════════════════════════════════
// TYPING SYSTEM
// ═══════════════════════════════════════════════

async function sendTyping(api, threadID, duration = 2000) {
  try {
    if (typeof api.sendTypingIndicatorV2 === "function") {
      await api.sendTypingIndicatorV2(true, threadID);

      await new Promise(resolve =>
        setTimeout(resolve, duration)
      );

      await api.sendTypingIndicatorV2(false, threadID);

      return;
    }

    if (typeof api.sendTypingIndicator === "function") {
      api.sendTypingIndicator(threadID, true);

      await new Promise(resolve =>
        setTimeout(resolve, duration)
      );

      api.sendTypingIndicator(threadID, false);
    }
  } catch (error) {
    console.log(
      "⚠️ Typing error:",
      error.message
    );
  }
}

// ═══════════════════════════════════════════════
// RX API
// ═══════════════════════════════════════════════

async function getRxAPI() {
  try {
    const res = await axios.get(API_JSON_URL, {
      timeout: 10000
    });

    if (!res.data?.voice) {
      throw new Error("voice API not found");
    }

    let base = String(res.data.voice).trim();

    base = base.replace(/\/+$/, "");

    if (!base.endsWith("/rx")) {
      base += "/rx";
    }

    return base;
  } catch (error) {
    console.error(
      "❌ Failed to load RX API:",
      error.message
    );

    return null;
  }
}

// ═══════════════════════════════════════════════
// DOWNLOAD FILE
// ═══════════════════════════════════════════════

async function downloadFile(url, filePath) {
  const res = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: 30000,
    maxContentLength: 50 * 1024 * 1024
  });

  fs.writeFileSync(
    filePath,
    Buffer.from(res.data)
  );
}

// ═══════════════════════════════════════════════
// DELETE FILE
// ═══════════════════════════════════════════════

function deleteFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.log(
      "⚠️ Cleanup error:",
      error.message
    );
  }
}

// ═══════════════════════════════════════════════
// 🐥 BABY MENU
// ═══════════════════════════════════════════════

function getBabyMenu() {
  let menu = `
╭━━━〔 🐥 BABY LOVE 〕━━━╮
┃
┃ 💕 VOICE TRIGGERS
┃ ─────────────────
`;

  triggers.forEach((trigger, index) => {
    menu += `┃ ${index + 1}. ${trigger.keywords.join(" / ")}\n`;
  });

  menu += `
┃
┃ 🎵 SONG SYSTEM
┃ ─────────────────
┃ • ekta gan bolo
┃ • next
┃ • arekta
┃
┃ 🎶 AVAILABLE SONGS
┃ ─────────────────
`;

  deepSongs.forEach((song, index) => {
    menu += `┃ ${index + 1}. ${song.title}\n`;
  });

  menu += `
┃
┃ 🤖 RX AI VOICE
┃ ─────────────────
┃ • Baby voice message-এ
┃   reply করলে AI response
┃   automatically আসবে।
┃
┃ 💡 EXAMPLE
┃ ─────────────────
┃ • Baby
┃ • ghumabo
┃ • ringtone
┃ • ekta gan bolo
┃ • next
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯
💠 Developer: হৃদয় হাসান শান্ত
`;

  return menu;
}

// ═══════════════════════════════════════════════
// SEND VOICE
// ═══════════════════════════════════════════════

async function sendVoice(api, event, trigger) {
  const {
    threadID,
    messageID
  } = event;

  const filePath = path.join(
    __dirname,
    `baby_${Date.now()}_${trigger.fileName}`
  );

  try {
    await downloadFile(
      trigger.audioUrl,
      filePath
    );

    await new Promise((resolve, reject) => {
      api.sendMessage(
        {
          body: withMarker(trigger.reply),
          attachment: fs.createReadStream(filePath)
        },
        threadID,
        error => {
          deleteFile(filePath);

          if (error) {
            reject(error);
          } else {
            resolve();
          }
        },
        messageID
      );
    });
  } catch (error) {
    deleteFile(filePath);

    console.error(
      "❌ Voice error:",
      error.message
    );
  }
}

// ═══════════════════════════════════════════════
// SEND SONG
// ═══════════════════════════════════════════════

async function sendSong(
  api,
  threadID,
  index,
  replyToID
) {
  if (!deepSongs.length) return;

  index =
    ((index % deepSongs.length) +
      deepSongs.length) %
    deepSongs.length;

  const song = deepSongs[index];

  const filePath = path.join(
    __dirname,
    `baby_song_${Date.now()}.mp3`
  );

  try {
    await downloadFile(
      song.url,
      filePath
    );

    await new Promise((resolve, reject) => {
      api.sendMessage(
        {
          body: withMarker(song.title),
          attachment: fs.createReadStream(filePath)
        },
        threadID,
        (error, info) => {
          deleteFile(filePath);

          if (error) {
            reject(error);
            return;
          }

          if (info?.messageID) {
            songProgress[threadID] = {
              index,
              msgID: info.messageID
            };
          }

          resolve();
        },
        replyToID
      );
    });
  } catch (error) {
    deleteFile(filePath);

    console.error(
      "❌ Song error:",
      error.message
    );
  }
}

// ═══════════════════════════════════════════════
// RX AI REPLY
// ═══════════════════════════════════════════════

async function handleRxReply(
  api,
  event,
  Users
) {
  const {
    threadID,
    messageID,
    senderID
  } = event;

  const text = String(
    event.body || ""
  ).trim();

  if (!text) return;

  const name =
    (await Users.getNameUser(senderID)) ||
    "User";

  const rxAPI = await getRxAPI();

  if (!rxAPI) {
    return api.sendMessage(
      "❌ Voice API এখন পাওয়া যাচ্ছে না।",
      threadID,
      messageID
    );
  }

  await sendTyping(
    api,
    threadID,
    2200
  );

  try {
    const res = await axios.get(
      rxAPI,
      {
        params: {
          text,
          senderName: name
        },
        timeout: 30000
      }
    );

    let replies = res.data?.response;

    if (!replies) return;

    if (!Array.isArray(replies)) {
      replies = [replies];
    }

    for (const reply of replies) {
      if (!reply) continue;

      await new Promise(resolve => {
        api.sendMessage(
          withMarker(String(reply)),
          threadID,
          () => resolve(),
          messageID
        );
      });
    }
  } catch (error) {
    console.error(
      "❌ RX API error:",
      error.message
    );
  }
}

// ═══════════════════════════════════════════════
// EVENT HANDLER
// ═══════════════════════════════════════════════

module.exports.handleEvent = async function ({
  api,
  event,
  Users
}) {
  try {
    const body = event.body;

    if (!body) return;

    const msg = String(body)
      .trim()
      .toLowerCase();

    if (!msg) return;

    const {
      threadID,
      messageID,
      messageReply
    } = event;

    // ═══════════════════════════════════════════
    // 🐥 BABY MENU
    // ═══════════════════════════════════════════

    if (
      msg === "🎀🧸" ||
      msg === "baby🐥" ||
      msg === "🐥"
    ) {
      return api.sendMessage(
        getBabyMenu(),
        threadID,
        messageID
      );
    }

    // ═══════════════════════════════════════════
    // 🤖 RX API REPLY
    // ═══════════════════════════════════════════

    if (
      messageReply &&
      messageReply.senderID ===
        api.getCurrentUserID() &&
      typeof messageReply.body === "string" &&
      messageReply.body.includes(MARKER)
    ) {
      await handleRxReply(
        api,
        event,
        Users
      );

      return;
    }

    // ═══════════════════════════════════════════
    // 🎵 NEXT / AREKTA
    // ═══════════════════════════════════════════

    if (
      event.type === "message_reply" &&
      ["next", "arekta"].includes(msg)
    ) {
      const repliedID =
        messageReply?.messageID;

      const progress =
        songProgress[threadID];

      if (
        !progress ||
        progress.msgID !== repliedID
      ) {
        return;
      }

      await sendTyping(
        api,
        threadID,
        1800
      );

      const nextIndex =
        (progress.index + 1) %
        deepSongs.length;

      await sendSong(
        api,
        threadID,
        nextIndex,
        messageID
      );

      return;
    }

    // ═══════════════════════════════════════════
    // 🎤 VOICE TRIGGERS
    // ═══════════════════════════════════════════

    for (const trigger of triggers) {
      const matched =
        trigger.keywords.some(keyword =>
          msg.includes(
            String(keyword).toLowerCase()
          )
        );

      if (!matched) continue;

      await sendTyping(
        api,
        threadID,
        2200
      );

      await sendVoice(
        api,
        event,
        trigger
      );

      return;
    }

    // ═══════════════════════════════════════════
    // 🎶 RANDOM SONG
    // ═══════════════════════════════════════════

    if (
      msg.includes("ekta gan bolo")
    ) {
      await sendTyping(
        api,
        threadID,
        1800
      );

      const randomIndex =
        Math.floor(
          Math.random() *
            deepSongs.length
        );

      await sendSong(
        api,
        threadID,
        randomIndex,
        messageID
      );

      return;
    }

  } catch (error) {
    console.error(
      "❌ BABYLOVE ERROR:",
      error
    );
  }
};

// ═══════════════════════════════════════════════
// COMMAND RUN
// ═══════════════════════════════════════════════

module.exports.run = function () {
  // Auto event system
};
