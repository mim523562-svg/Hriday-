const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "admin",
    version: "2.0.0",
    hasPermssion: 2,
    credits: "💠 হৃদয় হাসান শান্ত 💠",
    description: "Admin & Support Management System",
    commandCategory: "Admin",
    usages: "[add/remove/list/addndh/removendh/only/ndhonly/qtvonly/ibonly] [@mention/reply/UID/link/name]",
    cooldowns: 2,
    dependencies: {
        "fs-extra": ""
    }
};

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              DATABASE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

const dataPath = path.join(__dirname, "cache", "data.json");

function ensureDatabase() {
    if (!fs.existsSync(path.dirname(dataPath))) {
        fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    }

    if (!fs.existsSync(dataPath)) {
        fs.writeFileSync(
            dataPath,
            JSON.stringify({
                adminbox: {}
            }, null, 4)
        );
    }

    let data;

    try {
        data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    } catch (e) {
        data = {};
    }

    if (!data.adminbox) {
        data.adminbox = {};
    }

    fs.writeFileSync(dataPath, JSON.stringify(data, null, 4));

    return data;
}

module.exports.onLoad = function () {
    ensureDatabase();
};

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SAVE CONFIG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

function saveConfig(configPath, config) {
    fs.writeFileSync(
        configPath,
        JSON.stringify(config, null, 4),
        "utf8"
    );
}

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          GET USER NAME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

async function getUserName(Users, uid) {
    try {
        const data = await Users.getData(uid);

        if (data && data.name) {
            return data.name;
        }
    } catch (e) {}

    return "Unknown User";
}

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FACEBOOK LINK → UID
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

async function getUIDFromLink(api, link) {
    if (
        !link ||
        (
            !link.includes("facebook.com") &&
            !link.includes("fb.com")
        )
    ) {
        return null;
    }

    try {
        const uid = await api.getUID(link);
        return uid ? uid.toString() : null;
    } catch (e) {
        return null;
    }
}

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        FULL NAME → UID
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

async function getUIDByFullName(api, threadID, text) {
    if (!text || !text.includes("@")) {
        return null;
    }

    try {
        const match = text.match(/@(.+)/);

        if (!match) {
            return null;
        }

        const targetName = match[1]
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ");

        const threadInfo = await api.getThreadInfo(threadID);

        const users = threadInfo.userInfo || [];

        const found = users.find(user => {
            if (!user.name) return false;

            const fullName = user.name
                .trim()
                .toLowerCase()
                .replace(/\s+/g, " ");

            return fullName === targetName;
        });

        return found ? found.id.toString() : null;

    } catch (e) {
        return null;
    }
}

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            TARGET DETECTOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

async function detectTargetID(api, event, args) {

    const {
        messageReply,
        mentions,
        threadID
    } = event;

    /*━━━━ Reply ━━━━*/

    if (messageReply && messageReply.senderID) {
        return messageReply.senderID.toString();
    }

    /*━━━━ Mention ━━━━*/

    if (mentions && Object.keys(mentions).length > 0) {
        return Object.keys(mentions)[0].toString();
    }

    /*━━━━ Arguments ━━━━*/

    if (!args || args.length === 0) {
        return null;
    }

    const text = args.join(" ").trim();

    /*━━━━ Facebook Link ━━━━*/

    if (
        text.includes("facebook.com/") ||
        text.includes("fb.com/")
    ) {
        const link = text.split(/\s+/)[0];

        const uid = await getUIDFromLink(api, link);

        if (uid) {
            return uid;
        }
    }

    /*━━━━ Direct UID ━━━━*/

    if (/^\d{8,}$/.test(text)) {
        return text;
    }

    /*━━━━ Full Name ━━━━*/

    if (text.includes("@")) {
        const uid = await getUIDByFullName(
            api,
            threadID,
            text
        );

        if (uid) {
            return uid;
        }
    }

    return null;
}

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
             HELP MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

function sendHelp(api, event) {

    const msg =
`╭━━━〔 💠 𝐀𝐃𝐌𝐈𝐍 𝐌𝐄𝐍𝐔 💠 〕━━━╮
┃
┃ 👑 admin list
┃ └─ Admin & Support List
┃
┃ ➕ admin add @mention
┃ └─ Add New Admin
┃
┃ ➖ admin remove @mention
┃ └─ Remove Admin
┃
┃ 🛡️ admin addndh @mention
┃ └─ Add Support
┃
┃ ❌ admin removendh @mention
┃ └─ Remove Support
┃
┃ 🔒 admin only
┃ └─ Admin Only Mode
┃
┃ 🛡️ admin ndhonly
┃ └─ Support Only Mode
┃
┃ 👑 admin qtvonly
┃ └─ Group Admin Only Mode
┃
┃ 💬 admin ibonly
┃ └─ Inbox Admin Only Mode
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

💡 𝐔𝐬𝐚𝐠𝐞:
• Reply করে → admin add
• Mention → admin add @user
• UID → admin add 100xxxxxxxx
• Link → admin add https://facebook.com/username

💠 𝐃𝐞𝐯: হৃদয় হাসান শান্ত`;

    return api.sendMessage(
        msg,
        event.threadID,
        event.messageID
    );
}

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
               MAIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

module.exports.run = async function ({
    api,
    event,
    args,
    Users,
    permssion
}) {

    const {
        threadID,
        messageID
    } = event;

    const {
        configPath
    } = global.client;

    delete require.cache[
        require.resolve(configPath)
    ];

    const config = require(configPath);

    /*━━━━ Default ━━━━*/

    if (!args || args.length === 0) {
        return sendHelp(api, event);
    }

    /*━━━━ Safe Arrays ━━━━*/

    if (!Array.isArray(config.ADMINBOT)) {
        config.ADMINBOT = [];
    }

    if (!Array.isArray(config.NDH)) {
        config.NDH = [];
    }

    const ADMINBOT = config.ADMINBOT;
    const NDH = config.NDH;

    const action = args[0].toLowerCase();

    const targetArgs = args.slice(1);

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                  LIST
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    if (
        action === "list" ||
        action === "all" ||
        action === "-a"
    ) {

        let adminText = [];
        let supportText = [];

        for (const uid of ADMINBOT) {

            const name = await getUserName(
                Users,
                uid
            );

            adminText.push(
                `👑 ${name}\n` +
                `   └─ UID: ${uid}`
            );
        }

        for (const uid of NDH) {

            const name = await getUserName(
                Users,
                uid
            );

            supportText.push(
                `🛡️ ${name}\n` +
                `   └─ UID: ${uid}`
            );
        }

        const message =
`╭━━━〔 👑 𝐀𝐃𝐌𝐈𝐍 𝐋𝐈𝐒𝐓 〕━━━╮

👑 𝐁𝐎𝐓 𝐀𝐃𝐌𝐈𝐍
━━━━━━━━━━━━━━━━
${adminText.length
    ? adminText.join("\n\n")
    : "❌ No Admin Found"}

🛡️ 𝐒𝐔𝐏𝐏𝐎𝐑𝐓 𝐓𝐄𝐀𝐌
━━━━━━━━━━━━━━━━
${supportText.length
    ? supportText.join("\n\n")
    : "❌ No Support Found"}

━━━━━━━━━━━━━━━━
💠 𝐃𝐞𝐯: হৃদয় হাসান শান্ত
╰━━━━━━━━━━━━━━━━╯`;

        return api.sendMessage(
            message,
            threadID,
            messageID
        );
    }

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                  ADD ADMIN
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    if (action === "add") {

        if (permssion != 3) {
            return api.sendMessage(
                "🚫 এই কমান্ডটি শুধু Bot Owner ব্যবহার করতে পারবে।",
                threadID,
                messageID
            );
        }

        const targetID = await detectTargetID(
            api,
            event,
            targetArgs
        );

        if (!targetID) {

            return api.sendMessage(
`❌ 𝐔𝐬𝐞𝐫 𝐃𝐞𝐭𝐞𝐜𝐭 𝐇𝐨𝐲𝐧𝐢!

📌 ব্যবহার:
• Reply করে → admin add
• Mention → admin add @user
• UID → admin add 100xxxxxxxx
• Link → admin add https://facebook.com/username`,
                threadID,
                messageID
            );
        }

        if (
            ADMINBOT
                .map(String)
                .includes(String(targetID))
        ) {

            const name = await getUserName(
                Users,
                targetID
            );

            return api.sendMessage(
                `⚠️ ${name} ইতিমধ্যেই Admin আছে।`,
                threadID,
                messageID
            );
        }

        ADMINBOT.push(String(targetID));

        saveConfig(
            configPath,
            config
        );

        const name = await getUserName(
            Users,
            targetID
        );

        return api.sendMessage(
`╭━━━〔 👑 𝐀𝐃𝐌𝐈𝐍 𝐀𝐃𝐃𝐄𝐃 〕━━━╮

✅ সফলভাবে নতুন Admin যোগ করা হয়েছে!

👤 Name: ${name}
🆔 UID: ${targetID}
👑 Role: Bot Admin

💠 হৃদয় হাসান শান্ত
╰━━━━━━━━━━━━━━━━╯`,
            threadID,
            messageID
        );
    }

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
               REMOVE ADMIN
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    if (
        action === "remove" ||
        action === "rm" ||
        action === "delete"
    ) {

        if (permssion != 3) {
            return api.sendMessage(
                "🚫 শুধু Bot Owner এই কাজটি করতে পারবে।",
                threadID,
                messageID
            );
        }

        const targetID = await detectTargetID(
            api,
            event,
            targetArgs
        );

        if (!targetID) {
            return api.sendMessage(
                "❌ User detect করা যায়নি।",
                threadID,
                messageID
            );
        }

        const index = ADMINBOT.findIndex(
            uid =>
                String(uid) === String(targetID)
        );

        if (index === -1) {

            const name = await getUserName(
                Users,
                targetID
            );

            return api.sendMessage(
                `❌ ${name} Admin নয়।`,
                threadID,
                messageID
            );
        }

        ADMINBOT.splice(index, 1);

        saveConfig(
            configPath,
            config
        );

        const name = await getUserName(
            Users,
            targetID
        );

        return api.sendMessage(
`╭━━━〔 ❌ 𝐀𝐃𝐌𝐈𝐍 𝐑𝐄𝐌𝐎𝐕𝐄𝐃 〕━━━╮

✅ Admin role remove করা হয়েছে।

👤 Name: ${name}
🆔 UID: ${targetID}

💠 হৃদয় হাসান শান্ত
╰━━━━━━━━━━━━━━━━━━━━╯`,
            threadID,
            messageID
        );
    }

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                ADD SUPPORT
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    if (action === "addndh") {

        if (permssion != 3) {
            return api.sendMessage(
                "🚫 শুধু Bot Owner এই কাজটি করতে পারবে।",
                threadID,
                messageID
            );
        }

        const targetID = await detectTargetID(
            api,
            event,
            targetArgs
        );

        if (!targetID) {
            return api.sendMessage(
                "❌ Support user detect করা যায়নি।",
                threadID,
                messageID
            );
        }

        if (
            NDH
                .map(String)
                .includes(String(targetID))
        ) {

            const name = await getUserName(
                Users,
                targetID
            );

            return api.sendMessage(
                `⚠️ ${name} ইতিমধ্যেই Support Team-এ আছে।`,
                threadID,
                messageID
            );
        }

        NDH.push(String(targetID));

        saveConfig(
            configPath,
            config
        );

        const name = await getUserName(
            Users,
            targetID
        );

        return api.sendMessage(
`╭━━━〔 🛡️ 𝐒𝐔𝐏𝐏𝐎𝐑𝐓 𝐀𝐃𝐃𝐄𝐃 〕━━━╮

✅ নতুন Support Member যোগ করা হয়েছে।

👤 Name: ${name}
🆔 UID: ${targetID}
🛡️ Role: Support

💠 হৃদয় হাসান শান্ত
╰━━━━━━━━━━━━━━━━━━━━━━╯`,
            threadID,
            messageID
        );
    }

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
             REMOVE SUPPORT
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    if (action === "removendh") {

        if (permssion != 3) {
            return api.sendMessage(
                "🚫 শুধু Bot Owner এই কাজটি করতে পারবে।",
                threadID,
                messageID
            );
        }

        const targetID = await detectTargetID(
            api,
            event,
            targetArgs
        );

        if (!targetID) {
            return api.sendMessage(
                "❌ Support user detect করা যায়নি।",
                threadID,
                messageID
            );
        }

        const index = NDH.findIndex(
            uid =>
                String(uid) === String(targetID)
        );

        if (index === -1) {

            const name = await getUserName(
                Users,
                targetID
            );

            return api.sendMessage(
                `❌ ${name} Support Team-এ নেই।`,
                threadID,
                messageID
            );
        }

        NDH.splice(index, 1);

        saveConfig(
            configPath,
            config
        );

        const name = await getUserName(
            Users,
            targetID
        );

        return api.sendMessage(
`╭━━━〔 ❌ 𝐒𝐔𝐏𝐏𝐎𝐑𝐓 𝐑𝐄𝐌𝐎𝐕𝐄𝐃 〕━━━╮

✅ Support role remove করা হয়েছে।

👤 Name: ${name}
🆔 UID: ${targetID}

💠 হৃদয় হাসান শান্ত
╰━━━━━━━━━━━━━━━━━━━━━━━╯`,
            threadID,
            messageID
        );
    }

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              QTV ONLY
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    if (action === "qtvonly") {

        if (permssion < 1) {
            return api.sendMessage(
                "🚫 আপনার permission নেই।",
                threadID,
                messageID
            );
        }

        const database = ensureDatabase();

        database.adminbox[threadID] =
            database.adminbox[threadID] === true
                ? false
                : true;

        fs.writeFileSync(
            dataPath,
            JSON.stringify(database, null, 4)
        );

        const status =
            database.adminbox[threadID]
                ? "𝐄𝐍𝐀𝐁𝐋𝐄𝐃 🔒"
                : "𝐃𝐈𝐒𝐀𝐁𝐋𝐄𝐃 🔓";

        return api.sendMessage(
`╭━━━〔 👑 𝐐𝐓𝐕 𝐌𝐎𝐃𝐄 〕━━━╮

⚙️ Status: ${status}

${
    database.adminbox[threadID]
        ? "🔒 এখন শুধু Group Admin/permission user bot ব্যবহার করতে পারবে।"
        : "🔓 এখন সবাই bot ব্যবহার করতে পারবে।"
}

╰━━━━━━━━━━━━━━━━━━━━╯`,
            threadID,
            messageID
        );
    }

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
               NDH ONLY
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    if (
        action === "ndhonly" ||
        action === "-ndh"
    ) {

        if (permssion < 2) {
            return api.sendMessage(
                "🚫 আপনার permission নেই।",
                threadID,
                messageID
            );
        }

        config.ndhOnly =
            config.ndhOnly === true
                ? false
                : true;

        saveConfig(
            configPath,
            config
        );

        return api.sendMessage(
`🛡️ 𝐍𝐃𝐇 𝐎𝐍𝐋𝐘 𝐌𝐎𝐃𝐄

⚙️ Status:
${
    config.ndhOnly
        ? "🔒 ENABLED — শুধু Support ব্যবহার করতে পারবে।"
        : "🔓 DISABLED — সবাই bot ব্যবহার করতে পারবে।"
}`,
            threadID,
            messageID
        );
    }

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                IB ONLY
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    if (action === "ibonly") {

        if (permssion != 3) {
            return api.sendMessage(
                "🚫 শুধু Bot Owner এই mode পরিবর্তন করতে পারবে।",
                threadID,
                messageID
            );
        }

        config.adminPaOnly =
            config.adminPaOnly === true
                ? false
                : true;

        saveConfig(
            configPath,
            config
        );

        return api.sendMessage(
`💬 𝐈𝐁 𝐎𝐍𝐋𝐘 𝐌𝐎𝐃𝐄

⚙️ Status:
${
    config.adminPaOnly
        ? "🔒 ENABLED — Inbox-এ শুধু Admin ব্যবহার করতে পারবে।"
        : "🔓 DISABLED — সবাই Inbox-এ bot ব্যবহার করতে পারবে।"
}`,
            threadID,
            messageID
        );
    }

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
               ADMIN ONLY
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    if (
        action === "only" ||
        action === "-o"
    ) {

        if (permssion != 3) {
            return api.sendMessage(
                "🚫 শুধু Bot Owner এই mode পরিবর্তন করতে পারবে।",
                threadID,
                messageID
            );
        }

        config.adminOnly =
            config.adminOnly === true
                ? false
                : true;

        saveConfig(
            configPath,
            config
        );

        return api.sendMessage(
`👑 𝐀𝐃𝐌𝐈𝐍 𝐎𝐍𝐋𝐘 𝐌𝐎𝐃𝐄

⚙️ Status:
${
    config.adminOnly
        ? "🔒 ENABLED — শুধু Admin bot ব্যবহার করতে পারবে।"
        : "🔓 DISABLED — সবাই bot ব্যবহার করতে পারবে।"
}`,
            threadID,
            messageID
        );
    }

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                 UNKNOWN
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    return sendHelp(api, event);
};
