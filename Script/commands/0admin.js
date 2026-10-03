const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "0admin",
    version: "2.0.0",
    hasPermssion: 3,
    credits: "💠 হৃদয় হাসান শান্ত 💠",
    description: "Admin & Supporter Config",
    commandCategory: "Admin",
    usages: "admin [list/add/remove/addndh/removendh/only/ndhonly/qtvonly/ibonly] [@mention/reply/UID/Facebook Link]",
    cooldowns: 2,
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.languages = {
    vi: {
        listAdmin:
            "╭━━━〔 👑 𝗔𝗗𝗠𝗜𝗡 𝗟𝗜𝗦𝗧 〕━━━╮\n\n%1\n\n╰━━━〔 🤖 𝗦𝗨𝗣𝗣𝗢𝗥𝗧 〕━━━╯\n\n%2",

        notHavePermssion:
            "❌ আপনার এই কমান্ড ব্যবহার করার permission নেই!\n\n⚙️ Command: %1",

        addedNewAdmin:
            "╭━━〔 👑 𝗔𝗗𝗠𝗜𝗡 𝗔𝗗𝗗 〕━━╮\n\n✅ সফলভাবে Admin করা হয়েছে!\n\n%2\n\n╰━━━━━━━━━━━━━━╯",

        addedNewNDH:
            "╭━━〔 🤖 𝗦𝗨𝗣𝗣𝗢𝗥𝗧 𝗔𝗗𝗗 〕━━╮\n\n✅ সফলভাবে Supporter করা হয়েছে!\n\n%2\n\n╰━━━━━━━━━━━━━━╯",

        removedAdmin:
            "╭━━〔 🗑️ 𝗔𝗗𝗠𝗜𝗡 𝗥𝗘𝗠𝗢𝗩𝗘 〕━━╮\n\n✅ Admin role সরানো হয়েছে!\n\n%2\n\n╰━━━━━━━━━━━━━━╯",

        removedNDH:
            "╭━━〔 🗑️ 𝗦𝗨𝗣𝗣𝗢𝗥𝗧 𝗥𝗘𝗠𝗢𝗩𝗘 〕━━╮\n\n✅ Supporter role সরানো হয়েছে!\n\n%2\n\n╰━━━━━━━━━━━━━━╯"
    },

    en: {
        listAdmin: "👑 Admin List:\n\n%1\n\n🤖 Supporter List:\n\n%2",
        notHavePermssion: "❌ You don't have permission to use: %1",
        addedNewAdmin: "✅ Added %1 Admin:\n\n%2",
        addedNewNDH: "✅ Added %1 Supporter:\n\n%2",
        removedAdmin: "✅ Removed %1 Admin:\n\n%2",
        removedNDH: "✅ Removed %1 Supporter:\n\n%2"
    }
};

/* =========================================================
   CACHE DATA
========================================================= */

module.exports.onLoad = function () {
    const cacheDir = path.join(__dirname, "cache");
    const dataPath = path.join(cacheDir, "data.json");

    if (!fs.existsSync(cacheDir)) {
        fs.ensureDirSync(cacheDir);
    }

    if (!fs.existsSync(dataPath)) {
        fs.writeJsonSync(
            dataPath,
            {
                adminbox: {}
            },
            { spaces: 4 }
        );
    } else {
        try {
            const data = fs.readJsonSync(dataPath);

            if (!data.adminbox || typeof data.adminbox !== "object") {
                data.adminbox = {};
            }

            fs.writeJsonSync(dataPath, data, { spaces: 4 });
        } catch (e) {
            fs.writeJsonSync(
                dataPath,
                {
                    adminbox: {}
                },
                { spaces: 4 }
            );
        }
    }
};

/* =========================================================
   GET USER ID FROM FULL NAME
========================================================= */

async function getUIDByFullName(api, threadID, body) {
    try {
        if (!body || !body.includes("@")) return null;

        const match = body.match(/@(.+)/);
        if (!match) return null;

        const targetName = match[1]
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ");

        const threadInfo = await api.getThreadInfo(threadID);
        const users = threadInfo.userInfo || [];

        const user = users.find(u => {
            if (!u.name) return false;

            const fullName = u.name
                .trim()
                .toLowerCase()
                .replace(/\s+/g, " ");

            return fullName === targetName;
        });

        return user ? user.id : null;
    } catch (e) {
        return null;
    }
}

/* =========================================================
   FACEBOOK LINK / UID / MENTION / REPLY RESOLVER
========================================================= */

async function getTargetUser(api, event, args, Users) {
    let targetID = null;
    let targetName = null;

    try {
        /*
         * 1️⃣ REPLY
         */
        if (event.type === "message_reply" && event.messageReply) {
            targetID = event.messageReply.senderID;
        }

        /*
         * 2️⃣ DIRECT MENTION
         */
        if (!targetID && event.mentions) {
            const mentionIDs = Object.keys(event.mentions);

            if (mentionIDs.length > 0) {
                targetID = mentionIDs[0];
            }
        }

        /*
         * 3️⃣ ARGUMENT
         */
        if (!targetID && args && args.length > 0) {
            const input = args.join(" ").trim();

            /*
             * Facebook profile/share link
             *
             * Example:
             * https://www.facebook.com/share/19mWR5afna/
             */
            if (
                input.includes("facebook.com/") ||
                input.includes("fb.com/")
            ) {
                try {
                    targetID = await api.getUID(input);
                } catch (e) {
                    targetID = null;
                }
            }

            /*
             * 4️⃣ Direct UID
             */
            if (!targetID && /^\d{8,}$/.test(input)) {
                targetID = input;
            }

            /*
             * 5️⃣ Full name
             */
            if (!targetID && input.includes("@")) {
                targetID = await getUIDByFullName(
                    api,
                    event.threadID,
                    input
                );
            }
        }

        /*
         * USER NAME
         */
        if (targetID) {
            try {
                const data = await Users.getData(targetID);

                if (data && data.name) {
                    targetName = data.name;
                }
            } catch (e) {
                targetName = "Facebook User";
            }
        }

        return {
            targetID,
            targetName: targetName || "Facebook User"
        };
    } catch (e) {
        return {
            targetID: null,
            targetName: null
        };
    }
}

/* =========================================================
   NORMALIZE CONFIG
========================================================= */

function normalizeConfig(config) {
    if (!Array.isArray(config.ADMINBOT)) {
        config.ADMINBOT = [];
    }

    if (!Array.isArray(config.NDH)) {
        config.NDH = [];
    }

    if (typeof config.adminOnly !== "boolean") {
        config.adminOnly = false;
    }

    if (typeof config.ndhOnly !== "boolean") {
        config.ndhOnly = false;
    }

    if (typeof config.adminPaOnly !== "boolean") {
        config.adminPaOnly = false;
    }

    return config;
}

/* =========================================================
   SEND ERROR
========================================================= */

function sendTargetError(api, event) {
    return api.sendMessage(
        "❌ টার্গেট User পাওয়া যায়নি!\n\n" +
        "📌 ব্যবহার করতে পারো:\n" +
        "➊ @Mention\n" +
        "➋ Message Reply\n" +
        "➌ Facebook UID\n" +
        "➍ Facebook Profile/Share Link\n\n" +
        "🔗 Example:\n" +
        "https://www.facebook.com/share/19mWR5afna/",
        event.threadID,
        event.messageID
    );
}

/* =========================================================
   MAIN COMMAND
========================================================= */

module.exports.run = async function ({
    api,
    event,
    args,
    Users,
    permssion,
    getText
}) {
    const { threadID, messageID } = event;

    const configPath = global.client.configPath;

    delete require.cache[require.resolve(configPath)];

    let config = require(configPath);
    config = normalizeConfig(config);

    const ADMINBOT = config.ADMINBOT;
    const NDH = config.NDH;

    /*
     * HELP
     */
    if (args.length === 0) {
        return api.sendMessage(
            `╭━━━〔 👑 𝗛𝗥𝗜𝗗𝗢𝗬 𝗔𝗗𝗠𝗜𝗡 〕━━━╮

⚙️ 𝗔𝗗𝗠𝗜𝗡 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦

➊ admin list
   ↳ Admin + Supporter list

➋ admin add
   ↳ Add Admin

➌ admin remove
   ↳ Remove Admin

➍ admin addndh
   ↳ Add Supporter

➎ admin removendh
   ↳ Remove Supporter

➏ admin only
   ↳ Admin Only Mode

➐ admin ndhonly
   ↳ Supporter Only Mode

➑ admin qtvonly
   ↳ Thread Admin Only

➒ admin ibonly
   ↳ Inbox Admin Only

━━━━━━━━━━━━━━━━━━
🎯 Target:
@Mention
Reply
UID
Facebook Profile Link
Facebook Share Link

🔗 Example:
https://www.facebook.com/share/19mWR5afna/

╰━━━〔 💠 HRIDOY BOT 〕━━━╯`,
            threadID,
            messageID
        );
    }

    const command = String(args[0]).toLowerCase();
    const targetArgs = args.slice(1);

    /* =====================================================
       LIST
    ===================================================== */

    if (
        command === "list" ||
        command === "all" ||
        command === "-a"
    ) {
        let adminList = [];
        let supporterList = [];

        for (const id of ADMINBOT) {
            try {
                const data = await Users.getData(id);
                const name = data?.name || "Unknown User";

                adminList.push(
                    `👑 ${name}\n` +
                    `🆔 ${id}\n` +
                    `🔗 https://www.facebook.com/${id}`
                );
            } catch (e) {}
        }

        for (const id of NDH) {
            try {
                const data = await Users.getData(id);
                const name = data?.name || "Unknown User";

                supporterList.push(
                    `🤖 ${name}\n` +
                    `🆔 ${id}\n` +
                    `🔗 https://www.facebook.com/${id}`
                );
            } catch (e) {}
        }

        return api.sendMessage(
            `╭━━〔 👑 𝗔𝗗𝗠𝗜𝗡 〕━━╮

${adminList.length
    ? adminList.join("\n\n")
    : "❌ কোনো Admin নেই"}

╰━━━━━━━━━━━━╯

╭━━〔 🤖 𝗦𝗨𝗣𝗣𝗢𝗥𝗧 〕━━╮

${supporterList.length
    ? supporterList.join("\n\n")
    : "❌ কোনো Supporter নেই"}

╰━━━━━━━━━━━━╯`,
            threadID,
            messageID
        );
    }

    /* =====================================================
       ADD ADMIN
    ===================================================== */

    if (command === "add") {
        if (permssion != 3) {
            return api.sendMessage(
                "❌ এই কমান্ড শুধুমাত্র Bot Owner ব্যবহার করতে পারবেন!",
                threadID,
                messageID
            );
        }

        const { targetID, targetName } =
            await getTargetUser(
                api,
                event,
                targetArgs,
                Users
            );

        if (!targetID) {
            return sendTargetError(api, event);
        }

        if (ADMINBOT.includes(String(targetID))) {
            return api.sendMessage(
                `⚠️ ${targetName} ইতোমধ্যেই Admin!`,
                threadID,
                messageID
            );
        }

        ADMINBOT.push(String(targetID));

        fs.writeJsonSync(configPath, config, {
            spaces: 4
        });

        return api.sendMessage(
            `╭━━〔 👑 𝗔𝗗𝗠𝗜𝗡 𝗔𝗗𝗗𝗘𝗗 〕━━╮

✅ সফলভাবে Admin করা হয়েছে!

👤 Name: ${targetName}
🆔 UID: ${targetID}

🔗 Facebook:
https://www.facebook.com/${targetID}

╰━━━━━━━━━━━━━━╯`,
            threadID,
            messageID
        );
    }

    /* =====================================================
       ADD SUPPORTER
    ===================================================== */

    if (command === "addndh") {
        if (permssion != 3) {
            return api.sendMessage(
                "❌ এই কমান্ড শুধুমাত্র Bot Owner ব্যবহার করতে পারবেন!",
                threadID,
                messageID
            );
        }

        const { targetID, targetName } =
            await getTargetUser(
                api,
                event,
                targetArgs,
                Users
            );

        if (!targetID) {
            return sendTargetError(api, event);
        }

        if (NDH.includes(String(targetID))) {
            return api.sendMessage(
                `⚠️ ${targetName} ইতোমধ্যেই Supporter!`,
                threadID,
                messageID
            );
        }

        NDH.push(String(targetID));

        fs.writeJsonSync(configPath, config, {
            spaces: 4
        });

        return api.sendMessage(
            `╭━━〔 🤖 𝗦𝗨𝗣𝗣𝗢𝗥𝗧 𝗔𝗗𝗗𝗘𝗗 〕━━╮

✅ সফলভাবে Supporter করা হয়েছে!

👤 Name: ${targetName}
🆔 UID: ${targetID}

🔗 Facebook:
https://www.facebook.com/${targetID}

╰━━━━━━━━━━━━━━╯`,
            threadID,
            messageID
        );
    }

    /* =====================================================
       REMOVE ADMIN
    ===================================================== */

    if (
        command === "remove" ||
        command === "rm" ||
        command === "delete"
    ) {
        if (permssion != 3) {
            return api.sendMessage(
                "❌ এই কমান্ড শুধুমাত্র Bot Owner ব্যবহার করতে পারবেন!",
                threadID,
                messageID
            );
        }

        const { targetID, targetName } =
            await getTargetUser(
                api,
                event,
                targetArgs,
                Users
            );

        if (!targetID) {
            return sendTargetError(api, event);
        }

        const index = ADMINBOT.indexOf(String(targetID));

        if (index === -1) {
            return api.sendMessage(
                `❌ ${targetName} Admin তালিকায় নেই!`,
                threadID,
                messageID
            );
        }

        ADMINBOT.splice(index, 1);

        fs.writeJsonSync(configPath, config, {
            spaces: 4
        });

        return api.sendMessage(
            `╭━━〔 🗑️ 𝗔𝗗𝗠𝗜𝗡 𝗥𝗘𝗠𝗢𝗩𝗘𝗗 〕━━╮

✅ Admin role সরানো হয়েছে!

👤 Name: ${targetName}
🆔 UID: ${targetID}

╰━━━━━━━━━━━━━━╯`,
            threadID,
            messageID
        );
    }

    /* =====================================================
       REMOVE SUPPORTER
    ===================================================== */

    if (command === "removendh") {
        if (permssion != 3) {
            return api.sendMessage(
                "❌ এই কমান্ড শুধুমাত্র Bot Owner ব্যবহার করতে পারবেন!",
                threadID,
                messageID
            );
        }

        const { targetID, targetName } =
            await getTargetUser(
                api,
                event,
                targetArgs,
                Users
            );

        if (!targetID) {
            return sendTargetError(api, event);
        }

        const index = NDH.indexOf(String(targetID));

        if (index === -1) {
            return api.sendMessage(
                `❌ ${targetName} Supporter তালিকায় নেই!`,
                threadID,
                messageID
            );
        }

        NDH.splice(index, 1);

        fs.writeJsonSync(configPath, config, {
            spaces: 4
        });

        return api.sendMessage(
            `╭━━〔 🗑️ 𝗦𝗨𝗣𝗣𝗢𝗥𝗧 𝗥𝗘𝗠𝗢𝗩𝗘𝗗 〕━━╮

✅ Supporter role সরানো হয়েছে!

👤 Name: ${targetName}
🆔 UID: ${targetID}

╰━━━━━━━━━━━━━━━━╯`,
            threadID,
            messageID
        );
    }

    /* =====================================================
       QTV ONLY
    ===================================================== */

    if (command === "qtvonly") {
        if (permssion < 1) {
            return api.sendMessage(
                "❌ আপনার permission নেই!",
                threadID,
                messageID
            );
        }

        const dataPath = path.join(
            __dirname,
            "cache",
            "data.json"
        );

        const database = fs.readJsonSync(dataPath);

        if (!database.adminbox) {
            database.adminbox = {};
        }

        database.adminbox[threadID] =
            !database.adminbox[threadID];

        fs.writeJsonSync(dataPath, database, {
            spaces: 4
        });

        return api.sendMessage(
            database.adminbox[threadID]
                ? "👑 QTV ONLY চালু হয়েছে!\n\nশুধুমাত্র Thread Adminরা Bot ব্যবহার করতে পারবে।"
                : "✅ QTV ONLY বন্ধ হয়েছে!\n\nসবাই Bot ব্যবহার করতে পারবে।",
            threadID,
            messageID
        );
    }

    /* =====================================================
       NDH ONLY
    ===================================================== */

    if (
        command === "ndhonly" ||
        command === "-ndh"
    ) {
        if (permssion < 2) {
            return api.sendMessage(
                "❌ আপনার permission নেই!",
                threadID,
                messageID
            );
        }

        config.ndhOnly = !config.ndhOnly;

        fs.writeJsonSync(configPath, config, {
            spaces: 4
        });

        return api.sendMessage(
            config.ndhOnly
                ? "🤖 NDH ONLY চালু হয়েছে!\n\nশুধুমাত্র Supporterরা Bot ব্যবহার করতে পারবে।"
                : "✅ NDH ONLY বন্ধ হয়েছে!\n\nসবাই Bot ব্যবহার করতে পারবে।",
            threadID,
            messageID
        );
    }

    /* =====================================================
       INBOX ONLY
    ===================================================== */

    if (command === "ibonly") {
        if (permssion != 3) {
            return api.sendMessage(
                "❌ শুধুমাত্র Bot Owner এই Mode পরিবর্তন করতে পারবেন!",
                threadID,
                messageID
            );
        }

        config.adminPaOnly = !config.adminPaOnly;

        fs.writeJsonSync(configPath, config, {
            spaces: 4
        });

        return api.sendMessage(
            config.adminPaOnly
                ? "💬 IB ONLY চালু হয়েছে!\n\nশুধুমাত্র Admin নিজের Inbox-এ Bot ব্যবহার করতে পারবে।"
                : "✅ IB ONLY বন্ধ হয়েছে!\n\nInbox Bot mode স্বাভাবিক হয়েছে।",
            threadID,
            messageID
        );
    }

    /* =====================================================
       ADMIN ONLY
    ===================================================== */

    if (
        command === "only" ||
        command === "-o"
    ) {
        if (permssion != 3) {
            return api.sendMessage(
                "❌ শুধুমাত্র Bot Owner এই Mode পরিবর্তন করতে পারবেন!",
                threadID,
                messageID
            );
        }

        config.adminOnly = !config.adminOnly;

        fs.writeJsonSync(configPath, config, {
            spaces: 4
        });

        return api.sendMessage(
            config.adminOnly
                ? "👑 ADMIN ONLY চালু হয়েছে!\n\nশুধুমাত্র Adminরা Bot ব্যবহার করতে পারবে।"
                : "✅ ADMIN ONLY বন্ধ হয়েছে!\n\nসবাই Bot ব্যবহার করতে পারবে।",
            threadID,
            messageID
        );
    }

    /* =====================================================
       UNKNOWN COMMAND
    ===================================================== */

    return api.sendMessage(
        `❌ Unknown Admin Command!

📌 ব্যবহার:
${global.config.PREFIX}admin list
${global.config.PREFIX}admin add
${global.config.PREFIX}admin remove
${global.config.PREFIX}admin addndh
${global.config.PREFIX}admin removendh
${global.config.PREFIX}admin only
${global.config.PREFIX}admin ndhonly
${global.config.PREFIX}admin qtvonly
${global.config.PREFIX}admin ibonly`,
        threadID,
        messageID
    );
};

Facebook link দিয়ে ব্যবহার:

.prefix admin add https://www.facebook.com/share/19mWR5afna/

অথবা ওই ব্যক্তির মেসেজে Reply করে:

.prefix admin add

অথবা:

.prefix admin add @Name

একটা গুরুত্বপূর্ণ বিষয়: "facebook.com/share/..." লিংক থেকে UID বের করার ক্ষমতা তোমার bot-এর "api.getUID()" implementation-এর ওপর নির্ভর করবে। যদি তোমার বর্তমান login/API wrapper "share" URL resolve না করে, তাহলে ওই অংশের জন্য আলাদা resolver লাগবে।
