const fs = require("fs-extra");
const { createCanvas } = require("canvas");
const path = require("path");

module.exports.config = {
    name: "owner2",
    version: "3.0.0",
    hasPermssion: 0,
    credits: "Šħẫňto Hřiȡẫy Ħẫššẫň",
    description: "Show stylish Owner Info card with random video",
    commandCategory: "info",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
    const { threadID, messageID } = event;

    try {
        // =========================
        // Canvas Setup
        // =========================
        const width = 945;
        const height = 1260;

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        // =========================
        // Background
        // =========================
        const bg = ctx.createLinearGradient(0, 0, 0, height);
        bg.addColorStop(0, "#003d66");
        bg.addColorStop(0.5, "#005c99");
        bg.addColorStop(1, "#007acc");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        // =========================
        // Glass Card
        // =========================
        const cardX = 40;
        const cardY = 50;
        const cardWidth = width - 80;
        const cardHeight = height - 100;

        drawGlassCard(
            ctx,
            cardX,
            cardY,
            cardWidth,
            cardHeight,
            40
        );

        // =========================
        // Title
        // =========================
        ctx.font = "bold 65px Segoe UI";
        ctx.textAlign = "left";

        const titleGradient = ctx.createLinearGradient(
            cardX,
            cardY,
            cardX + 600,
            cardY
        );

        titleGradient.addColorStop(0, "#c2f7ff");
        titleGradient.addColorStop(1, "#6de3ff");

        ctx.fillStyle = titleGradient;
        ctx.shadowColor = "#00e0ff77";
        ctx.shadowBlur = 20;

        ctx.fillText(
            "✨ OWNER INFO ✨",
            cardX + 100,
            cardY + 100
        );

        ctx.shadowBlur = 0;

        // =========================
        // Divider
        // =========================
        ctx.strokeStyle = "#a0f0ff66";
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(cardX + 60, cardY + 135);
        ctx.lineTo(cardX + cardWidth - 60, cardY + 135);
        ctx.stroke();

        // =========================
        // Owner Information
        // =========================
        ctx.font = "bold 38px Segoe UI";
        ctx.fillStyle = "#ffffff";

        let y = cardY + 220;

        const info = [
            "👑 Name : Šħẫňto Hřiȡẫy Ħẫššẫň",
            "🧸 Nickname : হৃদয়",
            "💘 Relation : Single",
            "💼 Profession : Job",
            "",
            "🔗 CONTACT LINKS",
            "",
            "📘 Facebook :",
            "facebook.com/share/19pNyArctH/"
        ];

        for (const line of info) {
            if (line === "") {
                y += 35;
                continue;
            }

            ctx.fillText(
                line,
                cardX + 90,
                y
            );

            y += 75;
        }

        // =========================
        // Bottom Divider
        // =========================
        ctx.strokeStyle = "#a0f0ff44";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(
            cardX + 80,
            cardY + cardHeight - 80
        );

        ctx.lineTo(
            cardX + cardWidth - 80,
            cardY + cardHeight - 80
        );

        ctx.stroke();

        // =========================
        // Developer Credit
        // =========================
        ctx.font = "bold 30px Segoe UI";
        ctx.fillStyle = "#d9faff";

        ctx.textAlign = "center";

        ctx.fillText(
            "💠 Šħẫňto Hřiȡẫy Ħẫššẫň 💠",
            width / 2,
            cardY + cardHeight - 35
        );

        // =========================
        // Save Card
        // =========================
        const cacheDir = path.join(__dirname, "cache");

        await fs.ensureDir(cacheDir);

        const imagePath = path.join(
            cacheDir,
            "owner2_card.png"
        );

        fs.writeFileSync(
            imagePath,
            canvas.toBuffer("image/png")
        );

        // =========================
        // Random Video
        // =========================
        const videos = [
            "https://files.catbox.moe/ixri0h.mp4",
            "https://files.catbox.moe/1oyxlf.mp4"
        ];

        const randomVideo =
            videos[Math.floor(Math.random() * videos.length)];

        const videoPath = path.join(
            cacheDir,
            "owner2_video.mp4"
        );

        // Download video
        const response = await fetch(randomVideo);

        if (!response.ok) {
            throw new Error(
                `Video download failed: ${response.status}`
            );
        }

        const videoBuffer = Buffer.from(
            await response.arrayBuffer()
        );

        fs.writeFileSync(
            videoPath,
            videoBuffer
        );

        // =========================
        // Send Message
        // =========================
        api.sendMessage(
            {
                body:
                    "💙 𝗦𝗵𝗮𝗻𝘁𝗼 𝗕𝗼𝘁 💙\n" +
                    "✨ 𝗢𝘄𝗻𝗲𝗿 𝗜𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻 ✨",
                attachment: [
                    fs.createReadStream(imagePath),
                    fs.createReadStream(videoPath)
                ]
            },
            threadID,
            () => {
                // =========================
                // Cleanup
                // =========================
                setTimeout(() => {
                    fs.unlink(imagePath, () => {});
                    fs.unlink(videoPath, () => {});
                }, 5000);
            },
            messageID
        );

    } catch (error) {
        console.error(
            "[OWNER2 ERROR]",
            error
        );

        api.sendMessage(
            "❌ Owner2 চালু করতে সমস্যা হয়েছে!\n\n" +
            "⚠️ Error: " +
            error.message,
            threadID,
            messageID
        );
    }
};


// ==================================================
// Glass Card
// ==================================================

function drawGlassCard(
    ctx,
    x,
    y,
    w,
    h,
    r
) {
    ctx.save();

    ctx.shadowColor = "#33ddff55";
    ctx.shadowBlur = 25;

    ctx.fillStyle =
        "rgba(255,255,255,0.08)";

    roundRect(
        ctx,
        x,
        y,
        w,
        h,
        r,
        true,
        false
    );

    ctx.restore();
}


// ==================================================
// Rounded Rectangle
// ==================================================

function roundRect(
    ctx,
    x,
    y,
    w,
    h,
    r,
    fill,
    stroke
) {
    if (typeof r === "number") {
        r = {
            tl: r,
            tr: r,
            br: r,
            bl: r
        };
    }

    ctx.beginPath();

    ctx.moveTo(
        x + r.tl,
        y
    );

    ctx.lineTo(
        x + w - r.tr,
        y
    );

    ctx.quadraticCurveTo(
        x + w,
        y,
        x + w,
        y + r.tr
    );

    ctx.lineTo(
        x + w,
        y + h - r.br
    );

    ctx.quadraticCurveTo(
        x + w,
        y + h,
        x + w - r.br,
        y + h
    );

    ctx.lineTo(
        x + r.bl,
        y + h
    );

    ctx.quadraticCurveTo(
        x,
        y + h,
        x,
        y + h - r.bl
    );

    ctx.lineTo(
        x,
        y + r.tl
    );

    ctx.quadraticCurveTo(
        x,
        y,
        x + r.tl,
        y
    );

    ctx.closePath();

    if (fill) {
        ctx.fill();
    }

    if (stroke) {
        ctx.stroke();
    }
    }
