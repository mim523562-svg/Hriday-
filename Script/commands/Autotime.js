Install Autotime.js /**
 * ╔══════════════════════════════════════════════╗
 * ║              🤖 AUTO SENT BOT               ║
 * ║          💠 HRIDOY HASAN SHANTO 💠          ║
 * ║                 Version 2.0.0               ║
 * ╚══════════════════════════════════════════════╝
 */

const schedule = require("node-schedule");

// ================================
// ⚙️ CONFIG
// ================================
module.exports.config = {
  name: "autosent",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "HRIDOY HASAN SHANTO",
  description: "Automatically sends hourly messages with media",
  commandCategory: "group messenger",
  usages: "[]",
  cooldowns: 0
};

// ================================
// 🕐 HOURLY MESSAGES
// ================================
const messages = [
  {
    time: "12:00 AM",
    message:
      "এখন সময় রাত 12:00 AM ⏳\nঅনেক রাত হলো, ঘুমিয়ে পড় Bby Good Night 😴💤❤️"
  },
  {
    time: "1:00 AM",
    message:
      "এখন সময় রাত 1:00 AM ⏳\nকিরে তুই এখনো ঘুমাস নাই? তাড়াতাড়ি ঘুমিয়ে পড়! 😾😴🛌"
  },
  {
    time: "2:00 AM",
    message:
      "এখন সময় রাত 2:00 AM ⏳\nঘুমে আয় ভাই! এখনো জাইগা আফসোস ক্যান? 😤👊💤"
  },
  {
    time: "3:00 AM",
    message:
      "এখন সময় রাত 3:00 AM ⏳\nসবাই ঘুমাইয়া গেছে, তুই এখন জাইগা আসোস ক্যান? 🙄🌃🛌"
  },
  {
    time: "4:00 AM",
    message:
      "এখন সময় ভোর 4:00 AM ⏳\nএকটু পর আজান হবে, সময় হয়ে গেছে। 🕌🕋🕓"
  },
  {
    time: "5:00 AM",
    message:
      "এখন সময় ভোর 5:00 AM ⏳\nফজরের আজান হয়ে গেছে, নামাজটা পড়ে নিও পিও~ 🕌✨🤲💖"
  },
  {
    time: "6:00 AM",
    message:
      "এখন সময় সকাল 6:00 AM ⏳\nআসসালামুয়ালাইকুম Good Morning Bby! 🌅💖"
  },
  {
    time: "7:00 AM",
    message:
      "এখন সময় সকাল 7:00 AM ⏳\nঘুম ভাঙতেই মোবাইল! দাঁত ব্রাশটা করবি তো নাকি! 🛌➡️📱"
  },
  {
    time: "8:00 AM",
    message:
      "এখন সময় সকাল 8:00 AM ⏳\nপিও, মোবাইল রেখে দাঁত ব্রাশ করে খেয়ে নাও! 📱🪥🍽️"
  },
  {
    time: "9:00 AM",
    message:
      "এখন সময় সকাল 9:00 AM ⏳\nBby, Breakfast korco? 🍳🥞💖"
  },
  {
    time: "10:00 AM",
    message:
      "এখন সময় সকাল 10:00 AM ⏳\nকিরে ভন্ড, তুই আজ কলেজ যাস নাই? 😜📚🙄"
  },
  {
    time: "11:00 AM",
    message:
      "এখন সময় সকাল 11:00 AM ⏳\nনাটক কম কর পিও~ বস এখন বিজি আছে! 🙄📱💼"
  },
  {
    time: "12:00 PM",
    message:
      "এখন সময় দুপুর 12:00 PM ⏳\nGood Afternoon! 🌞🙌🌸"
  },
  {
    time: "1:00 PM",
    message:
      "এখন সময় দুপুর 1:00 PM ⏳\nভন্ড কোথাকার, মোবাইল বন্ধ করে জোহরের নামাজ পড়ে নাও 😻❣️🥰"
  },
  {
    time: "2:00 PM",
    message:
      "এখন সময় দুপুর 2:00 PM ⏳\nভন্ড কোথাকার, মোবাইল রাখ! গোসল করে খাওয়া-দাওয়া করে নে 🔪🛁🍽️"
  },
  {
    time: "3:00 PM",
    message:
      "এখন সময় বিকেল 3:00 PM ⏳\nJan, তোমাকে ছাড়া আর দুপুরে ঘুম হয় না….! 😴💔🌙"
  },
  {
    time: "4:00 PM",
    message:
      "এখন সময় বিকেল 4:00 PM ⏳\nঅনেক গরম পড়েছিল আজ! 🥵🌞💦"
  },
  {
    time: "5:00 PM",
    message:
      "এখন সময় বিকেল 5:00 PM ⏳\nপরিস্থিতি যেমনি হোক না কেন, সব সময় হাসতেই হবে! 😅🕒🙂"
  },
  {
    time: "6:00 PM",
    message:
      "এখন সময় সন্ধ্যা 6:00 PM ⏳\nGood Evening Everyone! সবাই হাত মুখ ধুয়ে নাও! 🌆👐💦"
  },
  {
    time: "7:00 PM",
    message:
      "এখন সময় সন্ধ্যা 7:00 PM ⏳\nকিরে ভন্ড, তুই আজ পড়তে বসছিলি নাকি? 😏📚🤔"
  },
  {
    time: "8:00 PM",
    message:
      "এখন সময় রাত 8:00 PM ⏳\nওই ওই, এত bot bot না করে আমার বসকে একটা গফ দে...! 🫰😎🔥"
  },
  {
    time: "9:00 PM",
    message:
      "এখন সময় রাত 9:00 PM ⏳\nআমার cute bby টাহ খানা খাইছে...? 😘🍽️❤️"
  },
  {
    time: "10:00 PM",
    message:
      "এখন সময় রাত 10:00 PM ⏳\nকিরে ভন্ড, খাইবি কখন? সারাদিন মোবাইল টিপস..! 😜📱😾"
  },
  {
    time: "11:00 PM",
    message:
      "এখন সময় রাত 11:00 PM ⏳\nযে ছেড়ে গেছে 😔 তাকে ভুলে যাও 🙂 নতুন করে হাসতে শেখো! 🙈🐸🤗"
  }
];

// ================================
// 🎬 MEDIA LINKS
// ================================
const mediaLinks = [
  "https://drive.google.com/uc?id=16KeE4J7L2Pd8cCKIBvlwEPP07A92b-eb",
  "https://drive.google.com/uc?id=16MhNPi_H0-tEe5PQrrqkx_l7SrC_l0kd",
  "https://drive.google.com/uc?id=15w4cvYmKrCW2Hul2AcvPEk5S4b-CH3EE",
  "https://drive.google.com/uc?id=16Xa6thSHdEGCiypaetbAEqVCwEAzFnKX",
  "https://drive.google.com/uc?id=16BnRPvKQd7gd3YLR_rB9QNZymotMqHu7",
  "https://drive.google.com/uc?id=15fDe2735O50z-3G4yQ5tDT9J873x5izm",
  "https://drive.google.com/uc?id=16HgiGU7_Cdh8NtpsKi92dTJmALJCV8jD",
  "https://drive.google.com/uc?id=16KTSrInqvioGnT7RrAskjHYqz8R6RgNY",
  "https://drive.google.com/uc?id=162yWrNRRTeN4tFEjQEtsR4p-4gWbTFaS",
  "https://drive.google.com/uc?id=16-q768c6nXstZEjQhWa1pZUPL2Xpjwo9",
  "https://drive.google.com/uc?id=15bfkP01mTzXutgP_0Z1iyud7SXqq-jOt",
  "https://drive.google.com/uc?id=15WnvdFOQIhKQ1nlZgsABXaf6Q2nQexGW",
  "https://drive.google.com/uc?id=16GTgYVSIDduUs4VTxadIzPPyp9KA_102",
  "https://drive.google.com/uc?id=15Y2GnA-Kcox8Mw6jioxHc1G1yP4pihnC",
  "https://drive.google.com/uc?id=16-qsG6oldtJiGq11Q3bFxKzuZJRFnoPT",
  "https://drive.google.com/uc?id=15W8ETDBXrn_JvealPwPFQ2CjvZp437-g",
  "https://drive.google.com/uc?id=15StZMKfsTdAhhECdKjS6FUFwG_OIHa7W",
  "https://drive.google.com/uc?id=16lOXxs-Z9u-mxttFnwWzdUHvrP55aHnZ",
  "https://drive.google.com/uc?id=162Qn-pcnc9iijg5dv59S9DTTQOofL4Fy",
  "https://drive.google.com/uc?id=1680rf1wQ2TrRuSLHtTwFC7GYctJAnHaX",
  "https://drive.google.com/uc?id=16-XtMXpa4r1iFJTBS2N68ARMuDH2IWpG",
  "https://drive.google.com/uc?id=15bO3lguAxsMZPvKkcvlsM6ObXOfJMz79"
];

// ================================
// 🔢 MEDIA ROTATION
// ================================
let mediaIndex = 0;

// ================================
// 🕐 TIME PARSER
// ================================
function parseTime(time) {
  const [h, m, period] = time.split(/[: ]/);

  let hour = parseInt(h, 10);
  const minute = parseInt(m, 10);

  if (period === "PM" && hour !== 12) {
    hour += 12;
  }

  if (period === "AM" && hour === 12) {
    hour = 0;
  }

  return {
    hour,
    minute
  };
}

// ================================
// 📤 SEND MEDIA + MESSAGE
// ================================
async function sendAutoMessage(api, threadID, message) {
  try {
    // প্রথমে Text
    await api.sendMessage(message, threadID);

    // Media না থাকলে শুধু Text
    if (!mediaLinks.length) return;

    const mediaURL = mediaLinks[mediaIndex];

    // পরবর্তী মিডিয়ার জন্য index
    mediaIndex++;

    if (mediaIndex >= mediaLinks.length) {
      mediaIndex = 0;
    }

    // Media পাঠানো
    await api.sendMessage(
      {
        body: "💠 Auto Sent Media 💠\n\n❤️ HRIDOY HASAN SHANTO ❤️",
        attachment: await global.utils.getStreamFromURL(mediaURL)
      },
      threadID
    );

  } catch (error) {
    console.error(
      `[AUTOSENT ERROR] Thread ${threadID}:`,
      error.message || error
    );
  }
}

// ================================
// 🚀 ON LOAD
// ================================
module.exports.onLoad = ({ api }) => {

  // Global switch
  if (global.config?.autoSent === false) {
    console.log("[AUTOSENT] Disabled from global config.");
    return;
  }

  console.log("[AUTOSENT] Starting scheduler...");
  console.log("[AUTOSENT] Timezone: Asia/Dhaka");
  console.log(`[AUTOSENT] Media: ${mediaLinks.length}`);

  messages.forEach(({ time, message }) => {

    if (!time || !message) return;

    const { hour, minute } = parseTime(time);

    const rule = new schedule.RecurrenceRule();

    // 🇧🇩 Bangladesh Time
    rule.tz = "Asia/Dhaka";

    rule.hour = hour;
    rule.minute = minute;
    rule.second = 0;

    schedule.scheduleJob(rule, async () => {

      try {

        if (global.config?.autoSent === false) {
          return;
        }

        const threadIDs = global.data?.allThreadID;

        if (!Array.isArray(threadIDs) || threadIDs.length === 0) {
          console.log("[AUTOSENT] No threads found.");
          return;
        }

        console.log(
          `[AUTOSENT] Sending ${time} to ${threadIDs.length} threads...`
        );

        for (const threadID of threadIDs) {

          if (!threadID) continue;

          await sendAutoMessage(
            api,
            threadID,
            message
          );

          // একটু delay
          await new Promise(resolve =>
            setTimeout(resolve, 1000)
          );
        }

        console.log(
          `[AUTOSENT] ${time} completed successfully.`
        );

      } catch (error) {

        console.error(
          `[AUTOSENT SCHEDULER ERROR] ${time}:`,
          error.message || error
        );

      }

    });

  });

  console.log(
    `[AUTOSENT] ${messages.length} hourly schedules loaded successfully.`
  );
};

// ================================
// 🤖 COMMAND
// ================================
module.exports.run = () => {};
