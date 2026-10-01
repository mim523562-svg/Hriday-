module.exports.config = {
    name: "hack",
    aliases: ["idhack", "hacked"],
    version: "4.0.0",
    hasPermssion: 0,
    credits: "HRIDAY HASAN SHANTO",
    description: "Fake hack profile info + video",
    commandCategory: "fun",
    usages: "reply or mention",
    cooldowns: 5,
    usePrefix: true,

    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const VIDEO_URL =
    "https://files.catbox.moe/rshvjk.mp4";

module.exports.run = async function ({ api, event }) {

    const cacheDir = path.join(__dirname, "cache");

    await fs.ensureDir(cacheDir);

    const id = `${event.senderID}_${Date.now()}`;

    const avatarPath =
        path.join(cacheDir, `hack_avatar_${id}.jpg`);

    const videoPath =
        path.join(cacheDir, `hack_video_${id}.mp4`);

    try {

        /*
         * =========================
         * FIND TARGET UID
         * =========================
         */

        let targetID;

        if (
            event.type === "message_reply" &&
            event.messageReply &&
            event.messageReply.senderID
        ) {

            targetID =
                event.messageReply.senderID;

        } else if (
            event.mentions &&
            Object.keys(event.mentions).length > 0
        ) {

            targetID =
                Object.keys(event.mentions)[0];

        } else {

            targetID =
                event.senderID;
        }

        /*
         * =========================
         * GET USER INFO
         * =========================
         */

        let name = "Unknown User";
        let userInfo = {};

        try {

            userInfo =
                await api.getUserInfo(targetID);

            if (
                userInfo &&
                userInfo[targetID]
            ) {

                name =
                    userInfo[targetID].name ||
                    "Unknown User";
            }

        } catch (e) {

            console.log(
                "[HACK] getUserInfo:",
                e.message
            );
        }

        /*
         * =========================
         * PROFILE PICTURE URL
         * =========================
         */

        let avatarUrl = null;

        /*
         * Try information returned
         * by getUserInfo()
         */

        if (
            userInfo &&
            userInfo[targetID]
        ) {

            const profile =
                userInfo[targetID];

            avatarUrl =
                profile.thumbSrc ||
                profile.profileUrl ||
                profile.avatar ||
                profile.picture ||
                profile.photo ||
                null;
        }

        /*
         * Fallback Facebook URL
         */

        if (!avatarUrl) {

            avatarUrl =
                `https://graph.facebook.com/${targetID}/picture` +
                `?width=720&height=720`;
        }

        /*
         * =========================
         * DOWNLOAD PROFILE PICTURE
         * =========================
         */

        let avatarOK = false;

        try {

            const avatarResponse =
                await axios.get(
                    avatarUrl,
                    {
                        responseType:
                            "arraybuffer",
                        timeout: 30000,
                        maxRedirects: 5
                    }
                );

            const contentType =
                String(
                    avatarResponse.headers[
                        "content-type"
                    ] || ""
                );

            /*
             * Make sure response
             * is actually an image
             */

            if (
                contentType.startsWith("image/")
            ) {

                await fs.writeFile(
                    avatarPath,
                    Buffer.from(
                        avatarResponse.data
                    )
                );

                avatarOK = true;
            }

        } catch (e) {

            console.log(
                "[HACK] Avatar download failed:",
                e.message
            );
        }

        /*
         * =========================
         * DOWNLOAD VIDEO
         * =========================
         */

        const videoResponse =
            await axios.get(
                VIDEO_URL,
                {
                    responseType:
                        "arraybuffer",
                    timeout: 60000,
                    maxRedirects: 5
                }
            );

        await fs.writeFile(
            videoPath,
            Buffer.from(
                videoResponse.data
            )
        );

        /*
         * =========================
         * PROFILE CAPTION
         * =========================
         */

        const caption =
            "╭━━━━━━━━━━━━━━━━━━╮\n" +
            "   🩸 𝐇𝐀𝐂𝐊 𝐓𝐀𝐑𝐆𝐄𝐓 🩸\n" +
            "╰━━━━━━━━━━━━━━━━━━╯\n\n" +

            "👤 𝐍𝐚𝐦𝐞: " +
            name +
            "\n\n" +

            "🆔 𝐔𝐈𝐃: " +
            targetID +
            "\n\n" +

            "🖼️ 𝐏𝐫𝐨𝐟𝐢𝐥𝐞: " +
            (avatarOK
                ? "Found ✔️"
                : "Unavailable") +
            "\n\n" +

            "🔐 𝐒𝐭𝐚𝐭𝐮𝐬: 𝐀𝐜𝐜𝐞𝐬𝐬𝐞𝐝 ✔️\n" +
            "\n\n" +

            "☠️" +
            "💀";

        /*
         * =========================
         * SEND PROFILE + VIDEO
         * =========================
         */

        if (avatarOK) {

            await api.sendMessage(
                {
                    body: caption,
                    attachment:
                        fs.createReadStream(
                            avatarPath
                        )
                },
                event.threadID
            );

        } else {

            await api.sendMessage(
                {
                    body: caption
                },
                event.threadID
            );
        }

        /*
         * =========================
         * SEND VIDEO
         * =========================
         */

        await api.sendMessage(
            {
                body:
                    "╭━━━━━━━━━━━━━━━━━━╮\n" +
                    "     💻 𝐇𝐀𝐂𝐊 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐄 ✔️\n" +
                    "╰━━━━━━━━━━━━━━━━━━╯\n\n" +

                    "👤 Target: " +
                    name +
                    "\n" +

                    "🆔 UID: " +
                    targetID +
                    "\n\n" +

                    "💀" +

                    "☠️",

                attachment:
                    fs.createReadStream(
                        videoPath
                    )
            },
            event.threadID
        );

        /*
         * =========================
         * CLEANUP
         * =========================
         */

        setTimeout(async () => {

            try {

                if (
                    await fs.pathExists(
                        avatarPath
                    )
                ) {
                    await fs.remove(
                        avatarPath
                    );
                }

                if (
                    await fs.pathExists(
                        videoPath
                    )
                ) {
                    await fs.remove(
                        videoPath
                    );
                }

            } catch (e) {}

        }, 10000);

    } catch (error) {

        console.error(
            "[HACK COMMAND ERROR]",
            error
        );

        /*
         * Cleanup
         */

        try {

            if (
                await fs.pathExists(
                    avatarPath
                )
            ) {
                await fs.remove(
                    avatarPath
                );
            }

            if (
                await fs.pathExists(
                    videoPath
                )
            ) {
                await fs.remove(
                    videoPath
                );
            }

        } catch (e) {}

        return api.sendMessage(
            "❌ Hack command চালাতে সমস্যা হয়েছে।",
            event.threadID,
            event.messageID
        );
    }
};
