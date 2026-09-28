/**
 * ╔══════════════════════════════════════════════╗
 * ║           🕌 ISLAMIC VIDEO V3                ║
 * ║          💠 HRIDOY HASAN SHANTO 💠           ║
 * ║        Random + Fallback + Retry System      ║
 * ╚══════════════════════════════════════════════╝
 */

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "islamick",
    aliases: ["islam", "islamic", "islamicvideo"],
    version: "3.1.0",
    hasPermssion: 0,
    credits: "HRIDOY HASAN SHANTO",
    description: "Send a random Islamic video",
    commandCategory: "Random Video",
    usages: "islamick",
    cooldowns: 5,
    usePrefix: true,

    dependencies: {
        axios: "",
        "fs-extra": ""
    }
};

// ═══════════════════════════════════════════════
// 🎬 VIDEO SOURCES
// ═══════════════════════════════════════════════

const videos = [
    "https://i.imgur.com/FbnZI40.mp4",
    "https://i.imgur.com/8k6OOZg.mp4",
    "https://i.imgur.com/lgQghHX.mp4",
    "https://i.imgur.com/D7HZFSg.mp4",
    "https://i.imgur.com/vUe9Zlv.mp4",
    "https://i.imgur.com/oxFuJYw.mp4",
    "https://i.imgur.com/OKKlDBN.mp4",
    "https://i.imgur.com/6wWebFc.mp4",
    "https://i.imgur.com/K2LTmaA.mp4",
    "https://i.imgur.com/i9vKvTd.mp4",
    "https://i.imgur.com/Y6uBzxx.mp4",
    "https://i.imgur.com/ULtFVPQ.mp4",
    "https://i.imgur.com/wX8WJh3.mp4",
    "https://i.imgur.com/6A42EIx.mp4",
    "https://i.imgur.com/ozRevxt.mp4",
    "https://i.imgur.com/Gd49ZSo.mp4",
    "https://i.imgur.com/xu6lBXk.mp4",
    "https://i.imgur.com/sDNohv4.mp4",
    "https://i.imgur.com/JBu2Ie3.mp4",
    "https://i.imgur.com/UaY42rq.mp4",
    "https://i.imgur.com/NFxf731.mp4",
    "https://i.imgur.com/vv1HsMC.mp4",
    "https://i.imgur.com/Y8MPzLv.mp4",
    "https://i.imgur.com/9M1v1qK.mp4",
    "https://i.imgur.com/EgUy7v0.mp4",
    "https://i.imgur.com/IjDqg2G.mp4",
    "https://i.imgur.com/51NYqmO.mp4",
    "https://i.imgur.com/XjfJHh9.mp4",
    "https://i.imgur.com/XHrkPt4.mp4",
    "https://i.imgur.com/mqEYRdy.mp4",
    "https://i.imgur.com/NaVsFmQ.mp4",
    "https://i.imgur.com/31XSmVj.mp4",
    "https://i.imgur.com/PPamCPI.mp4",
    "https://i.imgur.com/i6Iy7iN.mp4"
];

// ═══════════════════════════════════════════════
// ⚙️ SETTINGS
// ═══════════════════════════════════════════════

const MAX_TRIES = 8;
const DOWNLOAD_TIMEOUT = 60000;

// ═══════════════════════════════════════════════
// 🎲 RANDOM URL LIST
// ═══════════════════════════════════════════════

function getRandomUrls() {
    const list = [...videos];

    // Shuffle
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
    }

    return list.slice(0, MAX_TRIES);
}

// ═══════════════════════════════════════════════
// 📥 DOWNLOAD VIDEO
// ═══════════════════════════════════════════════

async function downloadVideo(url, filePath) {

    const response = await axios.get(url, {
        responseType: "stream",

        timeout: DOWNLOAD_TIMEOUT,

        maxContentLength: Infinity,
        maxBodyLength: Infinity,

        headers: {
            "User-Agent":
                "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36"
        },

        validateStatus: status =>
            status >= 200 && status < 300
    });

    await new Promise((resolve, reject) => {

        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        writer.on("finish", resolve);
        writer.on("error", reject);

        response.data.on("error", reject);
    });

    const stat = await fs.stat(filePath);

    if (!stat.size || stat.size < 1024) {
        throw new Error("Downloaded video is empty or too small.");
    }

    return true;
}

// ═══════════════════════════════════════════════
// ▶️ COMMAND
// ═══════════════════════════════════════════════

module.exports.run = async function ({ api, event }) {

    const cacheDir = path.join(__dirname, "cache");

    const fileName =
        `islamic_${Date.now()}_${Math.random()
            .toString(36)
            .slice(2)}.mp4`;

    const filePath = path.join(cacheDir, fileName);

    let success = false;
    let lastError = null;
    let selectedUrl = null;

    try {

        // 📁 Create cache
        await fs.ensureDir(cacheDir);

        // ⏳ Reaction
        try {
            api.setMessageReaction(
                "⏳",
                event.messageID,
                () => {},
                true
            );
        } catch (_) {}

        // 🎲 Randomized sources
        const urls = getRandomUrls();

        // ═══════════════════════════════════════
        // 🔄 FALLBACK SYSTEM
        // ═══════════════════════════════════════

        for (let i = 0; i < urls.length; i++) {

            const url = urls[i];

            // Remove old partial file
            await fs.remove(filePath).catch(() => {});

            try {

                console.log(
                    `[ISLAMICK] Trying ${i + 1}/${urls.length}: ${url}`
                );

                await downloadVideo(url, filePath);

                success = true;
                selectedUrl = url;

                console.log(
                    `[ISLAMICK] SUCCESS: ${url}`
                );

                break;

            } catch (error) {

                lastError = error;

                const status =
                    error?.response?.status || "UNKNOWN";

                console.error(
                    `[ISLAMICK] FAILED ${i + 1}/${urls.length}`,
                    {
                        status,
                        message: error?.message,
                        url
                    }
                );

                // Continue to next source
                continue;
            }
        }

        // ═══════════════════════════════════════
        // ❌ ALL SOURCES FAILED
        // ═══════════════════════════════════════

        if (!success) {

            const status =
                lastError?.response?.status || "UNKNOWN";

            throw new Error(
                `All video sources failed. Last HTTP status: ${status}`
            );
        }

        // ✅ Success
        try {
            api.setMessageReaction(
                "✅",
                event.messageID,
                () => {},
                true
            );
        } catch (_) {}

        // ═══════════════════════════════════════
        // 🕌 MESSAGE
        // ═══════════════════════════════════════

        const message =
`🕌 𝐈𝐒𝐋𝐀𝐌𝐈𝐂 𝐕𝐈𝐃𝐄𝐎 🕌

🌻 মানুষ হারাম ছাড়ে না,
অথচ সুখ-শান্তি খুঁজে বেড়ায় আরাম।

🥺 মানুষ কেন বুঝতে চায় না,
সে যে খোদার গোলাম।

🤲 আল্লাহ আমাদের সবাইকে
হারাম থেকে দূরে থাকার
তৌফিক দান করুন।

❤️‍🩹 ━━━ 𝐀𝐌𝐄𝐄𝐍 ━━━ ❤️‍🩹

💠 𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐀𝐒𝐀𝐍 𝐒𝐇𝐀𝐍𝐓𝐎 💠`;

        // ═══════════════════════════════════════
        // 📤 SEND VIDEO
        // ═══════════════════════════════════════

        return api.sendMessage(
            {
                body: message,
                attachment: fs.createReadStream(filePath)
            },
            event.threadID,

            async () => {

                // 🧹 Delete after sending
                await fs.remove(filePath)
                    .catch(() => {});

            },

            event.messageID
        );

    } catch (error) {

        // 🧹 Cleanup
        await fs.remove(filePath)
            .catch(() => {});

        console.error(
            "[ISLAMICK FINAL ERROR]",
            error
        );

        // ❌ Reaction
        try {
            api.setMessageReaction(
                "❌",
                event.messageID,
                () => {},
                true
            );
        } catch (_) {}

        return api.sendMessage(
`❌ 𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐕𝐢𝐝𝐞𝐨 পাঠানো যায়নি!

⚠️ ${error.message}

🔄 একাধিক video source চেষ্টা করা হয়েছে।

💡 কিছুক্ষণ পরে আবার চেষ্টা করুন।`,
            event.threadID,
            event.messageID
        );
    }
};
