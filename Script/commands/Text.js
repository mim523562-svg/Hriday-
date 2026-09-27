/**
 * ╔══════════════════════════════════════════════╗
 * ║              🎙️ TEXT VOICE BOT              ║
 * ║        💠 HRIDOY HASAN SHANTO 💠            ║
 * ║       MIRAI + GOATBOT COMPATIBLE             ║
 * ║          RANDOM ONE-OF VOICE SYSTEM          ║
 * ╚══════════════════════════════════════════════╝
 */

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// ═══════════════════════════════════════════════
// 🎙️ TEXT / EMOJI → VOICE MAP
// ═══════════════════════════════════════════════

const textAudioMap = {

  "🎵": [
    "https://files.catbox.moe/l0jhdq.mp3"
  ],

  "ঘুমা": [
    "https://files.catbox.moe/mofu8n.mp3"
  ],

  "ভয়েস": [
    "https://files.catbox.moe/b973ms.mp4"
  ],

  "😸": [
    "https://files.catbox.moe/bo0o5e.mp3"
  ],

  "নাটেক": [
    "https://files.catbox.moe/8w1wo5.mp3"
  ],

  "🙏": [
    "https://files.catbox.moe/i429lj.mp3",
    "https://files.catbox.moe/7avi7u.mp3"
  ],

  "এহ": [
    "https://files.catbox.moe/6tkyn2.mp3"
  ],

  "ডিলেট": [
    "https://files.catbox.moe/kcemka.mp4"
  ],

  "matha betha": [
    "https://files.catbox.moe/5rdtc6.mp3"
  ],

  "mata beta": [
    "https://files.catbox.moe/5rdtc6.mp3"
  ],

  "মিম": [
    "https://files.catbox.moe/dz7n65.mp3"
  ],

  "সর বাল": [
    "https://files.catbox.moe/q84p1d.mp3"
  ],

  "কেউ নাই": [
    "https://files.catbox.moe/3u6shs.mp3"
  ],

  "good night": [
    "https://files.catbox.moe/i29m4q.mp3"
  ],

  "গুড নাইট": [
    "https://files.catbox.moe/i29m4q.mp3"
  ],

  "good morning": [
    "https://files.catbox.moe/8gzqx5.mp3"
  ],

  "গুড মর্নিং": [
    "https://files.catbox.moe/8gzqx5.mp3"
  ],

  "i love you": [
    "https://files.catbox.moe/y3fk8i.mp3"
  ],

  "love you": [
    "https://files.catbox.moe/y3fk8i.mp3"
  ],

  "@everyone": [
    "https://files.catbox.moe/3u6shs.mp3"
  ],

  "ভুদা": [
    "https://files.catbox.moe/gnyx0p.mp3"
  ],

  "by": [
    "https://files.catbox.moe/fdqh2m.mp3"
  ],

  "বাই": [
    "https://files.catbox.moe/fdqh2m.mp3"
  ],

  "বায়": [
    "https://files.catbox.moe/fdqh2m.mp3"
  ],

  "🫵😡": [
    "https://files.catbox.moe/yuonxq.mp3"
  ],

  "gana": [
    "https://files.catbox.moe/995anc.mp3"
  ],

  "dirim": [
    "https://files.catbox.moe/1rk48q.mp4"
  ],

  "চুদি": [
    "https://files.catbox.moe/0ykb7f.mp3"
  ],

  // ═══════════════════════════════════════════
  // 😄 EMOJI
  // ═══════════════════════════════════════════

  "🥱": [
    "https://files.catbox.moe/9pou40.mp3",
    "https://files.catbox.moe/60cwcg.mp3"
  ],

  "😁": [
    "https://files.catbox.moe/60cwcg.mp3"
  ],

  "😌": [
    "https://files.catbox.moe/epqwbx.mp3"
  ],

  "🥺": [
    "https://files.catbox.moe/wc17iq.mp3",
    "https://files.catbox.moe/dv9why.mp3"
  ],

  "🤭": [
    "https://files.catbox.moe/cu0mpy.mp3"
  ],

  "😅": [
    "https://files.catbox.moe/jl3pzb.mp3"
  ],

  "😏": [
    "https://files.catbox.moe/z9e52r.mp3"
  ],

  "😞": [
    "https://files.catbox.moe/tdimtx.mp3"
  ],

  "🤫": [
    "https://files.catbox.moe/0uii99.mp3"
  ],

  "🍼": [
    "https://files.catbox.moe/p6ht91.mp3"
  ],

  "🤔": [
    "https://files.catbox.moe/hy6m6w.mp3"
  ],

  "🥰": [
    "https://files.catbox.moe/dv9why.mp3"
  ],

  "🤦": [
    "https://files.catbox.moe/ivlvoq.mp3"
  ],

  "😘": [
    "https://files.catbox.moe/ma2jlz.mp4",
    "https://files.catbox.moe/37dqpx.mp3"
  ],

  "😑": [
    "https://files.catbox.moe/p78xfw.mp3"
  ],

  "😢": [
    "https://files.catbox.moe/shxwj1.mp3"
  ],

  "🙊": [
    "https://files.catbox.moe/3bejxv.mp3"
  ],

  "🤨": [
    "https://files.catbox.moe/4aci0r.mp3"
  ],

  "😡": [
    "https://files.catbox.moe/shxwj1.mp3",
    "https://files.catbox.moe/h9ekli.mp3"
  ],

  "🤬": [
    "https://files.catbox.moe/shxwj1.mp3",
    "https://files.catbox.moe/h9ekli.mp3"
  ],

  "🙈": [
    "https://files.catbox.moe/3qc90y.mp3"
  ],

  "😍": [
    "https://files.catbox.moe/qjfk1b.mp3"
  ],

  "😭": [
    "https://files.catbox.moe/itm4g0.mp3"
  ],

  "😱": [
    "https://files.catbox.moe/mu0kka.mp3"
  ],

  "😻": [
    "https://files.catbox.moe/y8ul2j.mp3"
  ],

  "😿": [
    "https://files.catbox.moe/tqxemm.mp3"
  ],

  "💔": [
    "https://files.catbox.moe/6yanv3.mp3"
  ],

  "🤣": [
    "https://files.catbox.moe/2sweut.mp3",
    "https://files.catbox.moe/jl3pzb.mp3"
  ],

  "🥹": [
    "https://files.catbox.moe/jf85xe.mp3"
  ],

  "বট": [
    "https://files.catbox.moe/3u6shs.mp3"
  ],

  "🫣": [
    "https://files.catbox.moe/ttb6hi.mp3"
  ],

  "🐸": [
    "https://files.catbox.moe/utl83s.mp3",
    "https://files.catbox.moe/sg6ugl.mp3"
  ],

  "💋": [
    "https://files.catbox.moe/37dqpx.mp3"
  ],

  "🫦": [
    "https://files.catbox.moe/61w3i0.mp3"
  ],

  "😴": [
    "https://files.catbox.moe/rm5ozj.mp3"
  ],

  "😼": [
    "https://files.catbox.moe/4oz916.mp3"
  ],

  "🖕": [
    "https://files.catbox.moe/593u3j.mp3",
    "https://files.catbox.moe/dtua60.mp3"
  ],

  "🥵": [
    "https://files.catbox.moe/l90704.mp3"
  ],

  "🙂": [
    "https://files.catbox.moe/4oks08.mp3"
  ],

  "😒": [
    "https://files.catbox.moe/mt5il0.mp3"
  ],

  "😓": [
    "https://files.catbox.moe/zh3mdg.mp3"
  ],

  "🤧": [
    "https://files.catbox.moe/zh3mdg.mp3"
  ],

  "🙄": [
    "https://files.catbox.moe/vgzkeu.mp3"
  ]
};

// ═══════════════════════════════════════════════
// 🛡️ DUPLICATE PROTECTION
// ═══════════════════════════════════════════════

const processedMessages = new Set();

function alreadyProcessed(id) {

  if (!id) return false;

  if (processedMessages.has(id)) {
    return true;
  }

  processedMessages.add(id);

  setTimeout(() => {
    processedMessages.delete(id);
  }, 30000);

  return false;
}

// ═══════════════════════════════════════════════
// 🎲 RANDOM VOICE
// ═══════════════════════════════════════════════

function getRandomVoice(key) {

  const list = textAudioMap[key];

  if (!Array.isArray(list) || list.length === 0) {
    return null;
  }

  return list[
    Math.floor(Math.random() * list.length)
  ];
}

// ═══════════════════════════════════════════════
// 📋 LIST
// ═══════════════════════════════════════════════

const voiceList = `
╔═══『 🎙️ TEXT VOICE 』═══╗
      🩸 AUTO VOICE LIST
╚════════════════════════╝

🎙️ TEXT TRIGGERS

🎵 গান
😴 ঘুমা
🎙️ ভয়েস
😸 😸
😂 নাটেক
🙏 🙏
😶 এহ
🗑️ ডিলেট
🧠 matha betha
🧠 mata beta
😂 মিম
🤣 সর বাল
🥺 কেউ নাই

🌙 good night
🌙 গুড নাইট
🌅 good morning
🌅 গুড মর্নিং

❤️ i love you
❤️ love you

📢 @everyone
😈 ভুদা

👋 by
👋 বাই
👋 বায়

🫵😡
🎵 gana
🎙️ dirim
🔊 চুদি

━━━━━━━━━━━━━━━━━━━━━━

😄 EMOJI VOICE

🥱 😁 😌 🥺
🤭 😅 😏 😞
🤫 🍼 🤔 🥰
🤦 😘 😑 😢
🙊 🤨 😡 🤬
🙈 😍 😭 😱
😻 😿 💔 🤣
🥹 🫣 🐸 💋
🫦 😴 😼 🖕
🥵 🙂 😒 😓
🤧 🙄

━━━━━━━━━━━━━━━━━━━━━━

🎲 Multiple URL থাকলে
প্রতিবার Random Voice

🛡️ Same Message ID
শুধু একবার Process হবে

💠 BOT : TEXT VOICE
👑 ADMIN : HRIDOY HASAN SHANTO
🎙️ SYSTEM : AUTO VOICE

━━━━━━━━━━━━━━━━━━━━━━
`;

// ═══════════════════════════════════════════════
// ⚙️ CONFIG
// ═══════════════════════════════════════════════

module.exports.config = {

  name: "text_voice",

  version: "4.0.0",

  hasPermssion: 0,

  role: 0,

  credits: "💠 HRIDOY HASAN SHANTO 💠",

  author: "HRIDOY HASAN SHANTO",

  description:
    "Text এবং Emoji দিলে নির্দিষ্ট voice play করবে",

  shortDescription:
    "Text / Emoji Auto Voice",

  longDescription:
    "Text ও Emoji trigger অনুযায়ী random voice পাঠায়",

  commandCategory: "noprefix",

  category: "noprefix",

  usages: "Text / Emoji",

  cooldowns: 2,

  countDown: 2
};

// ═══════════════════════════════════════════════
// 🎙️ CORE HANDLER
// ═══════════════════════════════════════════════

async function processVoice(api, event) {

  let filePath = null;

  try {

    if (!event) return;

    const threadID = event.threadID;
    const messageID = event.messageID;
    const body = event.body;

    if (!threadID || !body) {
      return;
    }

    // 🛡️ SAME MESSAGE ID = ONLY ONE TIME
    if (alreadyProcessed(messageID)) {
      return;
    }

    const key = String(body)
      .trim()
      .toLowerCase();

    // ═══════════════════════════════════════════
    // 📋 VOICE LIST
    // ═══════════════════════════════════════════

    const listTriggers = [
      "voice list",
      "voicelist",
      "text voice",
      "textvoice",
      "ভয়েস লিস্ট",
      "ভয়েস লিস্ট",
      "ভয়েস লিস্ট দাও",
      "🎤",
      "command list"
    ];

    if (listTriggers.includes(key)) {

      return api.sendMessage(
        voiceList,
        threadID,
        messageID
      );
    }

    // ═══════════════════════════════════════════
    // 🎲 SELECT RANDOM URL
    // ═══════════════════════════════════════════

    const audioUrl = getRandomVoice(key);

    if (!audioUrl) {
      return;
    }

    // ═══════════════════════════════════════════
    // 📁 CACHE
    // ═══════════════════════════════════════════

    const cacheDir = path.join(
      __dirname,
      "cache"
    );

    await fs.ensureDir(cacheDir);

    const safeKey = encodeURIComponent(key);

    const safeMessageID = String(
      messageID || Date.now()
    ).replace(
      /[^a-zA-Z0-9_-]/g,
      ""
    );

    filePath = path.join(
      cacheDir,
      `${safeKey}_${safeMessageID}.mp3`
    );

    // ═══════════════════════════════════════════
    // ⬇️ DOWNLOAD
    // ═══════════════════════════════════════════

    const response = await axios({

      method: "GET",

      url: audioUrl,

      responseType: "stream",

      timeout: 30000,

      maxRedirects: 5

    });

    const writer =
      fs.createWriteStream(filePath);

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {

      writer.on("finish", resolve);

      writer.on("error", reject);

      response.data.on("error", reject);

    });

    // ═══════════════════════════════════════════
    // 🎙️ SEND ONCE
    // ═══════════════════════════════════════════

    await new Promise((resolve, reject) => {

      let finished = false;

      const done = (err) => {

        if (finished) return;

        finished = true;

        if (err) {
          reject(err);
        } else {
          resolve();
        }
      };

      api.sendMessage(
        {
          attachment:
            fs.createReadStream(filePath)
        },
        threadID,
        done,
        messageID
      );

    });

    // ═══════════════════════════════════════════
    // 🗑️ CLEAN CACHE
    // ═══════════════════════════════════════════

    setTimeout(() => {

      if (
        filePath &&
        fs.existsSync(filePath)
      ) {

        fs.unlink(
          filePath,
          () => {}
        );

      }

    }, 1500);

  } catch (error) {

    console.error(
      "[TEXT_VOICE]",
      error.message
    );

    // Cleanup
    try {

      if (
        filePath &&
        fs.existsSync(filePath)
      ) {

        fs.unlink(
          filePath,
          () => {}
        );

      }

    } catch (_) {}

  }
}

// ═══════════════════════════════════════════════
// 🐐 GOATBOT FORMAT
// ═══════════════════════════════════════════════

module.exports.onStart = async function ({
  api,
  event
}) {

  return processVoice(
    api,
    event
  );

};

// ═══════════════════════════════════════════════
// 🐐 GOATBOT EVENT FORMAT
// ═══════════════════════════════════════════════

module.exports.onChat = async function ({
  api,
  event
}) {

  return processVoice(
    api,
    event
  );

};

// ═══════════════════════════════════════════════
// 🐐 LEGACY EVENT SUPPORT
// ═══════════════════════════════════════════════

module.exports.handleEvent = async function ({
  api,
  event
}) {

  return processVoice(
    api,
    event
  );

};

// ═══════════════════════════════════════════════
// 🤖 MIRAI FORMAT
// ═══════════════════════════════════════════════

module.exports.run = async function ({
  api,
  event,
  message,
  args,
  threadID,
  senderID
}) {

  const currentEvent = event || {
    threadID,
    senderID,
    body: Array.isArray(args)
      ? args.join(" ")
      : String(args || "")
  };

  return processVoice(
    api,
    currentEvent
  );

};
