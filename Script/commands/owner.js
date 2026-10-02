const request = require("request");
const fs = require("fs-extra");

module.exports.config = {
  name: "owner",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Šħẫňto Hřiȡẫy Ħẫššẫň",
  description: "Show Owner Info with styled box & random photo",
  commandCategory: "Information",
  usages: "owner",
  cooldowns: 2
};

module.exports.run = async function ({ api, event }) {

  const info = `
╔══════════════════════✿
║   ✨ 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 ✨
╠══════════════════════✿
║ 👑 𝗡𝗮𝗺𝗲 : Šħẫňto Hřiȡẫy Ħẫššẫň
║ 🧸 𝗡𝗶𝗰𝗸 𝗡𝗮𝗺𝗲 : হৃদয়
║ 💘 𝗥𝗲𝗹𝗮𝘁𝗶𝗼𝗻 : 𝗦𝗶𝗻𝗴𝗹𝗲
║ 💻 𝗣𝗿𝗼𝗳𝗲𝘀𝘀𝗶𝗼𝗻 : 𝗝𝗼𝗯
╠══════════════════════✿
║ 🔗 𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗟𝗜𝗡𝗞𝗦
╠══════════════════════✿
║ 📘 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 :
║ https://www.facebook.com/share/19pNyArctH/
╚══════════════════════✿

        💠 𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿 : Šħẫňto Hřiȡẫy Ħẫššẫň 💠
`;

  const images = [
    "https://i.imgur.com/Q53O1jh.jpeg",
    "https://i.imgur.com/clFIBRL.jpeg",
    "https://i.imgur.com/4sDJ6oa.jpeg",
    "https://i.imgur.com/G8wZwUB.jpeg"
  ];

  const randomImg =
    images[Math.floor(Math.random() * images.length)];

  const cacheDir = __dirname + "/cache";
  const imagePath = cacheDir + "/owner.jpg";

  try {
    await fs.ensureDir(cacheDir);

    const response = request.get(encodeURI(randomImg));
    const writer = fs.createWriteStream(imagePath);

    response.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage(
        {
          body: info,
          attachment: fs.createReadStream(imagePath)
        },
        event.threadID,
        () => {
          fs.unlink(imagePath, () => {});
        },
        event.messageID
      );
    });

    writer.on("error", (err) => {
      api.sendMessage(
        "❌ Owner Photo Download করা যায়নি!\n\n⚠️ Error: " + err.message,
        event.threadID,
        event.messageID
      );
    });

  } catch (error) {
    api.sendMessage(
      "❌ Owner Command চালু করতে সমস্যা হয়েছে!\n\n⚠️ Error: " +
        error.message,
      event.threadID,
      event.messageID
    );
  }
};
