/**
 * ╔══════════════════════════════════════════════╗
 * ║            ⏰ AUTO SENT + IMAGE             ║
 * ║          💠 HRIDOY HASAN SHANTO 💠          ║
 * ║                 Version 4.0.0               ║
 * ╚══════════════════════════════════════════════╝
 */

const fs = require("fs");
const path = require("path");
const schedule = require("node-schedule");

module.exports.config = {
  name: "autosent",
  version: "4.0.0",
  hasPermission: 0,
  credits: "💠 HRIDOY HASAN SHANTO 💠",
  description: "Automatic hourly message with image",
  commandCategory: "group messenger",
  usages: "autosent on | off | status",
  cooldowns: 3
};

const IMAGE_DIR = path.join(__dirname, "autosent_images");
const TIMEZONE = "Asia/Dhaka";

let jobs = [];

if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

/* =========================
   ⏰ HOURLY DATA
========================= */

const messages = [
  ["12 AM", "এখন সময় রাত 12:00 AM ⏳\nঅনেক রাত হলো, ঘুমিয়ে পড় Bby Good Night 😴💤❤️", "12am.jpg"],
  ["1 AM", "এখন সময় রাত 1:00 AM ⏳\nকিরে তুই এখনো ঘুমাস নাই? তাড়াতাড়ি ঘুমিয়ে পড়! 😾😴🛌", "1am.jpg"],
  ["2 AM", "এখন সময় রাত 2:00 AM ⏳\nঘুমে আয় ভাই! এখনো জাইগা আফসোস ক্যান? 😤👊💤", "2am.jpg"],
  ["3 AM", "এখন সময় রাত 3:00 AM ⏳\nসবাই ঘুমাইয়া গেছে, তুই এখন জাইগা আসোস ক্যান? 🙄🌃🛌", "3am.jpg"],
  ["4 AM", "এখন সময় ভোর 4:00 AM ⏳\nএকটু পর আজান হবে, সময় হয়ে গেছে। 🕌🕋🕓", "4am.jpg"],
  ["5 AM", "এখন সময় ভোর 5:00 AM ⏳\nফজরের আজান হয়ে গেছে, নামাজটা পড়ে নিও পিও~ 🕌✨🤲💖", "5am.jpg"],
  ["6 AM", "এখন সময় সকাল 6:00 AM ⏳\nআসসালামুয়ালাইকুম Good Morning Bby! 🌅💖", "6am.jpg"],
  ["7 AM", "এখন সময় সকাল 7:00 AM ⏳\nঘুম ভাঙতেই মোবাইল! দাঁত ব্রাশটা করবি তো নাকি! 🛌➡️📱🪥", "7am.jpg"],
  ["8 AM", "এখন সময় সকাল 8:00 AM ⏳\nপিও, মোবাইল রেখে দাঁত ব্রাশ করে নাশতা করে নাও! 📱🪥🍽️", "8am.jpg"],
  ["9 AM", "এখন সময় সকাল 9:00 AM ⏳\nBby, Breakfast korco? 🍳🥞💖", "9am.jpg"],
  ["10 AM", "এখন সময় সকাল 10:00 AM ⏳\nকিরে ভন্ড, আজ এত দেরি করে উঠলি নাকি? 😜📚🙄", "10am.jpg"],
  ["11 AM", "এখন সময় সকাল 11:00 AM ⏳\nনাটক কম কর পিও~ বস এখন বিজি আছে! 🙄📱💼", "11am.jpg"],
  ["12 PM", "এখন সময় দুপুর 12:00 PM ⏳\nGood Afternoon Everyone! 🌞🙌🌸", "12pm.jpg"],
  ["1 PM", "এখন সময় দুপুর 1:00 PM ⏳\nমোবাইল একটু রেখে জোহরের নামাজ পড়ে নাও 🕌🤲❤️", "1pm.jpg"],
  ["2 PM", "এখন সময় দুপুর 2:00 PM ⏳\nমোবাইল রাখ! গোসল করে খাওয়া-দাওয়া করে নে 🛁🍽️😾", "2pm.jpg"],
  ["3 PM", "এখন সময় বিকেল 3:00 PM ⏳\nJan, তোমাকে ছাড়া আর দুপুরে ঘুম হয় না….! 😴💔🌙", "3pm.jpg"],
  ["4 PM", "এখন সময় বিকেল 4:00 PM ⏳\nঅনেক গরম পড়েছিল আজ! 🥵🌞💦", "4pm.jpg"],
  ["5 PM", "এখন সময় বিকেল 5:00 PM ⏳\nপরিস্থিতি যেমনই হোক না কেন, সব সময় হাসতে হবে! 😅🙂❤️", "5pm.jpg"],
  ["6 PM", "এখন সময় সন্ধ্যা 6:00 PM ⏳\nGood Evening Everyone! সবাই হাত-মুখ ধুয়ে নাও 🌆👐💦", "6pm.jpg"],
  ["7 PM", "এখন সময় সন্ধ্যা 7:00 PM ⏳\nকিরে ভন্ড, আজ পড়তে বসছিলি নাকি? 😏📚🤔", "7pm.jpg"],
  ["8 PM", "এখন সময় রাত 8:00 PM ⏳\nওই ওই, এত bot bot না করে আমার বসকে একটা গফ দে! 🫰😎🔥", "8pm.jpg"],
  ["9 PM", "এখন সময় রাত 9:00 PM ⏳\nআমার cute bby টাহ খানা খাইছে...? 😘🍽️❤️", "9pm.jpg"],
  ["10 PM", "এখন সময় রাত 10:00 PM ⏳\nকিরে ভন্ড, খাইবি কখন? সারাদিন মোবাইল টিপস! 😜📱😾", "10pm.jpg"],
  ["11 PM", "এখন সময় রাত 11:00 PM ⏳\nযে ছেড়ে গেছে তাকে ভুলে যাও 🙂❤️ জীবন সামনে এগিয়ে নাও! 🌙✨", "11pm.jpg"]
];

/* =========================
   🔧 STATE
========================= */

const stateFile = path.join(__dirname, "autosent_state.json");

function getState() {
  try {
    if (!fs.existsSync(stateFile)) {
      fs.writeFileSync(
        stateFile,
        JSON.stringify({ enabled: false }, null, 2)
      );
    }

    return JSON.parse(fs.readFileSync(stateFile, "utf8"));
  } catch (e) {
    console.error("[AUTOSENT STATE ERROR]", e);
    return { enabled: false };
  }
}

function saveState(data) {
  try {
    fs.writeFileSync(
      stateFile,
      JSON.stringify(data, null, 2)
    );
  } catch (e) {
    console.error("[AUTOSENT SAVE ERROR]", e);
  }
}

/* =========================
   📤 SEND MESSAGE
========================= */

async function sendMessage(api, threadID, item) {
  const [time, message, imageName] = item;
  const imagePath = path.join(IMAGE_DIR, imageName);

  try {
    if (fs.existsSync(imagePath)) {
      await api.sendMessage(
        {
          body: message,
          attachment: fs.createReadStream(imagePath)
        },
        threadID
      );

      console.log(
        `[AUTOSENT] ${time} → MESSAGE + IMAGE SENT → ${threadID}`
      );
    } else {
      await api.sendMessage(message, threadID);

      console.log(
        `[AUTOSENT] ${time} → TEXT SENT / IMAGE NOT FOUND → ${imageName}`
      );
    }
  } catch (error) {
    console.error(
      `[AUTOSENT SEND ERROR] ${time}`,
      error
    );
  }
}

/* =========================
   ⏰ START SCHEDULER
========================= */

function startScheduler(api) {
  stopScheduler();

  messages.forEach((item, index) => {
    const hour = index;

    const job = schedule.scheduleJob(
      {
        rule: `0 ${hour} * * *`,
        tz: TIMEZONE
      },
      async () => {
        const state = getState();

        if (!state.enabled) return;

        try {
          const threads =
            global.data?.allThreadID || [];

          console.log(
            `[AUTOSENT] ${item[0]} → ${threads.length} threads`
          );

          for (const threadID of threads) {
            await sendMessage(
              api,
              threadID,
              item
            );
          }
        } catch (error) {
          console.error(
            "[AUTOSENT SCHEDULE ERROR]",
            error
          );
        }
      }
    );

    jobs.push(job);
  });

  console.log(
    `✅ [AUTOSENT] Scheduler started → ${TIMEZONE}`
  );
}

/* =========================
   🛑 STOP SCHEDULER
========================= */

function stopScheduler() {
  for (const job of jobs) {
    try {
      job.cancel();
    } catch (e) {
      console.error(
        "[AUTOSENT CANCEL ERROR]",
        e
      );
    }
  }

  jobs = [];
}

/* =========================
   🤖 MIRAI COMMAND
========================= */

module.exports.run = async function ({
  api,
  event,
  args
}) {
  const action = String(
    args?.[0] || "status"
  ).toLowerCase();

  const state = getState();

  /* ON */
  if (
    action === "on" ||
    action === "enable" ||
    action === "start"
  ) {
    state.enabled = true;
    saveState(state);

    startScheduler(api);

    return api.sendMessage(
      "✅ AUTO SENT চালু হয়েছে!\n\n" +
      "⏰ প্রতি ঘণ্টায় মেসেজ যাবে\n" +
      "🖼️ Image থাকলে মেসেজের সাথে Image যাবে\n" +
      "🇧🇩 Timezone: Asia/Dhaka",
      event.threadID
    );
  }

  /* OFF */
  if (
    action === "off" ||
    action === "disable" ||
    action === "stop"
  ) {
    state.enabled = false;
    saveState(state);

    stopScheduler();

    return api.sendMessage(
      "🛑 AUTO SENT বন্ধ করা হয়েছে!",
      event.threadID
    );
  }

  /* STATUS */
  if (action === "status") {
    return api.sendMessage(
      "📊 AUTO SENT STATUS\n\n" +
      `🔘 Status: ${
        state.enabled ? "ON ✅" : "OFF ❌"
      }\n` +
      `⏰ Timezone: ${TIMEZONE}\n` +
      "🖼️ Image: Enabled\n" +
      `📅 Schedule: ${messages.length} hours`,
      event.threadID
    );
  }

  return api.sendMessage(
    "❌ সঠিক command দিন!\n\n" +
    "✅ autosent on\n" +
    "🛑 autosent off\n" +
    "📊 autosent status",
    event.threadID
  );
};

/* =========================
   🔄 AUTO RESTORE
========================= */

module.exports.onLoad = function ({
  api
}) {
  try {
    const state = getState();

    if (state.enabled) {
      startScheduler(api);

      console.log(
        "♻️ [AUTOSENT] Enabled state restored."
      );
    }
  } catch (error) {
    console.error(
      "[AUTOSENT ONLOAD ERROR]",
      error
    );
  }
};

/* =========================
   🧹 UNLOAD
========================= */

module.exports.onUnload = function () {
  stopScheduler();

  console.log(
    "🛑 [AUTOSENT] Scheduler stopped."
  );
};
