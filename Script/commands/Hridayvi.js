/**
 * ╔══════════════════════════════════════════╗
 * ║          🤖 HRI̲D̲A̲Y̲V̲I̲ AUTO REPLY       ║
 * ║          💠 HRIDOY HASAN SHANTO 💠      ║
 * ╚══════════════════════════════════════════╝
 */

const fs = require("fs");
const path = require("path");

// ===================== STORAGE =====================

const cacheDir = path.join(__dirname, "cache");
const dataFile = path.join(cacheDir, "hridayvi.json");

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify({}, null, 2));
}

// ===================== CONFIG =====================

module.exports.config = {
  name: "hridayvi",
  version: "3.0.0",
  author: "Hriday Hasan Shanto",
  countDown: 2,

  // Mirai / loader compatibility
  role: 0,
  commandCategory: "automation",
  category: "automation",

  shortDescription: "Mention-based automatic reply",
  longDescription: "Enable or disable automatic replies for a selected user.",
  guide: {
    en: "{pn} on @user\n{pn} off"
  }
};

// ===================== HELPERS =====================

function readData() {
  try {
    return JSON.parse(fs.readFileSync(dataFile, "utf8"));
  } catch (error) {
    console.error("[HRIDAYVI] JSON read error:", error);
    return {};
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(
      dataFile,
      JSON.stringify(data, null, 2),
      "utf8"
    );
  } catch (error) {
    console.error("[HRIDAYVI] JSON save error:", error);
  }
}

// ===================== ADMIN CHECK =====================

function isAdmin(event) {
  const admins =
    global.GoatBot?.config?.adminBot ||
    global.config?.adminBot ||
    [];

  return admins.map(String).includes(String(event.senderID));
}

// ===================== COMMAND =====================

module.exports.run = async function ({ api, event, args }) {

  // Only bot admins can turn it ON/OFF
  if (!isAdmin(event)) {
    return api.sendMessage(
      "❌ এই কমান্ডটি শুধু Bot Admin ব্যবহার করতে পারবেন।",
      event.threadID,
      event.messageID
    );
  }

  const data = readData();
  const action = (args[0] || "").toLowerCase();

  // ===================== OFF =====================

  if (action === "off") {

    if (!data[event.threadID]) {
      return api.sendMessage(
        "ℹ️ এই গ্রুপে Auto Reply আগে থেকেই বন্ধ আছে।",
        event.threadID,
        event.messageID
      );
    }

    delete data[event.threadID];
    saveData(data);

    return api.sendMessage(
      "✅ Auto Reply সফলভাবে বন্ধ করা হয়েছে।",
      event.threadID,
      event.messageID
    );
  }

  // ===================== ON =====================

  if (action === "on") {

    const mentions = event.mentions || {};
    const mentionIDs = Object.keys(mentions);

    if (!mentionIDs.length) {
      return api.sendMessage(
        "❌ একজন ইউজারকে @mention করুন।\n\nExample:\nhridayvi on @user",
        event.threadID,
        event.messageID
      );
    }

    const targetID = mentionIDs[0];

    let targetName = mentions[targetID] || "User";

    // Try getting real name
    try {
      const info = await api.getUserInfo(targetID);

      if (
        info &&
        info[targetID] &&
        info[targetID].name
      ) {
        targetName = info[targetID].name;
      }
    } catch (error) {
      console.log("[HRIDAYVI] User info error:", error.message);
    }

    data[event.threadID] = {
      uid: String(targetID),
      name: targetName,
      index: 0,
      enabled: true
    };

    saveData(data);

    const message =
      `✅ Auto Reply চালু হয়েছে!\n\n` +
      `👤 Target: ${targetName}\n` +
      `💬 এখন ${targetName} মেসেজ করলে Bot automatic reply করবে।`;

    return api.sendMessage(
      {
        body: message,
        mentions: [
          {
            tag: targetName,
            id: targetID,
            fromIndex: message.indexOf(targetName)
          }
        ]
      },
      event.threadID,
      event.messageID
    );
  }

  // ===================== STATUS =====================

  if (action === "status") {

    const target = data[event.threadID];

    if (!target || !target.enabled) {
      return api.sendMessage(
        "ℹ️ এই গ্রুপে Auto Reply বর্তমানে OFF আছে।",
        event.threadID,
        event.messageID
      );
    }

    return api.sendMessage(
      `✅ Auto Reply: ON\n` +
      `👤 Target: ${target.name}\n` +
      `🆔 UID: ${target.uid}`,
      event.threadID,
      event.messageID
    );
  }

  // ===================== HELP =====================

  return api.sendMessage(
    `🤖 HRIDAYVI AUTO REPLY\n\n` +
    `• hridayvi on @user\n` +
    `• hridayvi off\n` +
    `• hridayvi status`,
    event.threadID,
    event.messageID
  );
};

// ===================== AUTO REPLY =====================

module.exports.onChat = async function ({ api, event }) {

  if (!event || !event.threadID || !event.senderID) {
    return;
  }

  if (!event.body) {
    return;
  }

  const data = readData();
  const target = data[event.threadID];

  // No active target
  if (!target || !target.enabled) {
    return;
  }

  // Only selected user triggers the bot
  if (String(event.senderID) !== String(target.uid)) {
    return;
  }

  const text = String(event.body).trim();

  // Ignore command itself
  if (
    text.toLowerCase().startsWith("hridayvi ")
  ) {
    return;
  }

  // ===================== CLEAN REPLIES =====================

  const messages = [
    "\খাংকির পোলা তোর মার ভোদা তে গাধার মাল ফালাবো! 😈",  
    "\nআমার হৃদয় হাসান শান্ত  বস তোর মা কে চুদে পল্টি মারবো! 😡",  
    "\nতোর মার গুদে ফুল ট্যাবলেট পুশ করবো! 🤡",  
    "\nতোর মার ভোদায় হৃদয় হাসান শান্ত বস গাধার মতো মাল ফালিয়ে দিবে!🔥",  
    "\হৃদয় হাসান শান্ত বস তোর মাকে গাধার মতো চুদে বলবো এটা কার মাল? 😂",  
    "\nএই খানকির পোলা বেশ্যার পোলা তোর মাকে চুদে আমার বস হৃদয় হাসান শান্ত বস সারা বেলা,🖕💯",  
    "\nবস হৃদয় হাসান শান্ত বস তোর মার গুদে ইনপুট দিয়ে আউটপুট নেবো! 💀",  
    "\nআম পাতা জোড়া জোড়া তোর মাকে চূদে আমার বস হৃদয় হাসান শান্ত  উরাধুরা..!🖕💯",
    "\nতুই নাকি অনলাইনের কিং তোর মায়ের ভোদা মধ্যে বাজামু সাপের বিন বিনের তালে তালে চুদতে চুদতে নিয়া যামু খালে খালে নাই সাপ আমার বস হৃদয় হাসান শান্ত তোর অবৈধ বাপ💦👅..",
    "\nরাম চুদলাম লখোন চুদলাম চুদলাম হনুমান তোর মায়েরে অনলাইনে চুইদা হইছি আমি বট গালিবাজ শুয়ারের বাচ্চা💦😈..",
    "\nআমি বট গালি জানি না গালি গেছি ভুইলা তোর মায়ের চুদমু ছায়া বেলাউুজ খুইলা তোর আাবল জাতের মায়ের চুদি খাংকির পোলা..",
    "\nখাংকির পোলা তোর hmm সাথে আড়ি তোর মায়েরে চুদতে চুদতে নিয়া যামু নানার বাড়ি,,সেখানে আছে ছাগল তোর মায়েরে চুদে রাস্তা রাম ছাগল,,ছাগলের আছে নাকি পশম,,তোর মায়ের ভোদার শয়তানের কসম বান্দির বাচ্ছা...",
    "\nচুইদ্দা তোর মার বোদা দিয়া বাইর করমু রক্ত রক্তের কালার যদি হয় লাল তোর মারে চুদবো মেন্টাল ক চিরকাল শুয়ারের বাচচা..",
    "\nআমি বট! 👉করলাম শুরু তোর মার পুটকিতে ডুকামু ২টা গরু গরু নাকি ডাকে হাম্বা তোর মার ভোদায় ডুকামু ২টা ইলেক্ট্রিকের খাম্বা🙏🫦!",
    "\nকিরে ফকিন্নি মাগীর পোলা 🐸। মুরগী তোর মায়ের চুদতে চুদতে নিয়া যামু তুর্কী তুর্কীকে আছে নাকি কী মামু তোর বোনের কচি🫦💋👅💦!!",
    "\nজারজ মাগির পোলা তর কচি বোনের ভুদায় উম্মম্মম্মম্মা 🫦 😋। ওয়াক থু তর বোনের ভুদায় গন্ধ কাইল্লা মাগির পুত 🤬🤬",
    "\nএই মুরগি খাংকির পোলা হৃদয় হাসান শান্ত বস তর আম্মুর বাতার লাগে বাস্ট্রাডের বাচ্ছা গালি বাজ হয়ে গেসিস..!!",
    "\nখাংকির পোলা তুই হৃদয় হাসান শান্ত  বস কে গালি দেস তুই তো রাস্তার পতিতার পুত ছোডো ভাই তর আম্মু রে টুস করে চুদে দিয়ে দূর দিভো 🐒🙈?",
    "\nকিরে বস্তির পোলা তর আম্মু রে তর দুলাভাই এর কান্দে ফেলে আর তর কচি বোন রে তর বাপের কান্দে রেখে চুদি উফফফ!!",
    "\n‎জং ধরা লোহা দিয়া পাকিস্তানের মানচিত্র বানাই্য়া তোদের পিছন দিয়া ঢুকামু।🤬",
    "\n‎বান্দির পোলা তর কচি বোনের ভুদা ফাক কর থুতু দিয়ে ভুদায় দন ডুকামু 🤟",
    "\n‎বাতিজা শুন তর আম্মু রে চুদলে রাগ করবি না তো আচ্ছা জা রাগ করিস না তর আম্মুর কালা ভুদায় আর চুদলাম না তো বোন এর জামা টা খুলে দে  ✋!",
    "\n‎হিজলা মাগির পোলা বালি দিয়া চুদমু তরে খাঙ্কি মাগী!তর মাকে।  ✋!"
  ];

  let index = Number(target.index) || 0;

  const reply =
    messages[index % messages.length];

  target.index =
    (index + 1) % messages.length;

  data[event.threadID] = target;

  saveData(data);

  return api.sendMessage(
    reply,
    event.threadID,
    event.messageID
  );
};
