/**
 * ╔══════════════════════════════════════╗
 * ║          🎁 GIVE COMMAND 🎁          ║
 * ║                                      ║
 * ║          ║
 *                  ║
 * ╚══════════════════════════════════════╝
 */

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "বন্ধু",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "হৃদয় হাসান শান্ত",
  description: "Give random warning image/GIF",
  commandCategory: "fun",
  usages: ".give",
  cooldowns: 3
};

const imageLinks = [
  "https://i.imgur.com/B6G3NlF.jpeg",
  "https://i.imgur.com/T7RtKlp.gif",
  "https://i.imgur.com/BmGxEFs.gif",
  "https://i.imgur.com/MEdpECT.jpeg",
  "https://i.imgur.com/KU8N4Ca.jpeg",
  "https://i.imgur.com/roBS6oX.gif",
  "https://i.imgur.com/SkfGapy.jpeg",
  "https://i.imgur.com/GGQv16z.jpeg",
  "https://i.imgur.com/VAf5Eue.gif",
  "https://i.imgur.com/ZZpapGi.jpeg",
  "https://i.imgur.com/4LvXywY.jpeg"
];

const messages = [
  "🎁 এই নাও তোমার গিফট! 😎",
  "🎁 বিশেষ গিফট তোমার জন্য! 🥰",
  "😂 ভাই, গিফটটা নাও!",
  "🌚 নাও বন্ধু, তোমার জন্য গিফট!",
  "🥳 Surprise! তোমার গিফট হাজির!",
  "💝 ভালোবাসা দিয়ে গিফট দিলাম!",
  "🔥 এই নাও বস, স্পেশাল গিফট!",
  "😎 গিফট নাও আর চুপচাপ থাকো!",
  "🎁 তোমার জন্য ছোট্ট একটা উপহার!"
];

function randomItem(array) {
  return array[
    Math.floor(Math.random() * array.length)
  ];
}

async function downloadFile(url, filePath) {
  const response = await axios({
    method: "GET",
    url,
    responseType: "stream",
    timeout: 30000,
    maxRedirects: 10,
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    writer.on("finish", resolve);
    writer.on("error", reject);
    response.data.on("error", reject);
  });
}

module.exports.run = async function ({
  api,
  event
}) {
  const cacheDir = path.join(
    __dirname,
    "cache"
  );

  await fs.ensureDir(cacheDir);

  const imageUrl = randomItem(imageLinks);
  const message = randomItem(messages);

  const extension = imageUrl
    .toLowerCase()
    .includes(".gif")
    ? ".gif"
    : ".jpg";

  const filePath = path.join(
    cacheDir,
    `give_${Date.now()}${extension}`
  );

  try {
    await downloadFile(
      imageUrl,
      filePath
    );

    const msg = {
      body:
        `${message}\n\n` +
        `╭──────────────╮\n` +
        `│ 🎁 𝐆𝐈𝐕𝐄 𝐁𝐎𝐓 │\n` +
        `╰──────────────╯\n` +
        `💠 Developer: হৃদয় হাসান শান্ত`,

      attachment:
        fs.createReadStream(filePath)
    };

    await new Promise((resolve, reject) => {
      api.sendMessage(
        msg,
        event.threadID,
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });

  } catch (error) {

    console.error(
      "GIVE COMMAND ERROR:",
      error
    );

    api.sendMessage(
      "❌ গিফট পাঠাতে সমস্যা হয়েছে!",
      event.threadID
    );

  } finally {

    await fs
      .remove(filePath)
      .catch(() => {});

  }
};
