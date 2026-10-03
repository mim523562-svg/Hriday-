const fs = require("fs");
const path = require("path");
const login = require("stfca");

const APPSTATE = path.join(__dirname, "appstate.json");

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("💠 HRIDOY BOT");
console.log("📥 Inbox Listener Test");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

if (!fs.existsSync(APPSTATE)) {
console.error("❌ appstate.json পাওয়া যায়নি!");
console.error("📁 Xrahat.js-এর একই folder-এ appstate.json রাখুন।");
process.exit(1);
}

let appState;

try {
appState = JSON.parse(
fs.readFileSync(APPSTATE, "utf8")
);

if (!Array.isArray(appState) || appState.length === 0) {
    throw new Error("Invalid appstate");
}

} catch (err) {
console.error("❌ appstate.json পড়তে সমস্যা হয়েছে!");
console.error("⚠️ JSON format ঠিক আছে কিনা পরীক্ষা করুন।");
process.exit(1);
}

console.log("✅ appstate.json পাওয়া গেছে");
console.log("🔐 Facebook session দিয়ে login হচ্ছে...");

login(
{
appState: appState
},
(err, api) => {
if (err) {
console.error("❌ Login Error:");
console.error(err);
return;
}

    console.log("✅ Facebook login সফল");
    console.log("📡 Inbox listener চালু হচ্ছে...");

    try {
        api.setOptions({
            listenEvents: true,
            selfListen: false,
            logLevel: "info"
        });
    } catch (e) {
        console.log("⚠️ Listener options সেট করতে সমস্যা:");
        console.log(e.message);
    }

    api.listenMqtt((err, event) => {
        if (err) {
            console.error("❌ Listener Error:");
            console.error(err);
            return;
        }

        if (!event) return;

        console.log(
            "📨 Event:",
            event.type || "unknown",
            event.body || ""
        );

        if (event.type !== "message") return;
        if (!event.threadID) return;

        const body = String(event.body || "").trim();

        if (!body) return;

        console.log("👤 Message:", body);
        console.log("🆔 Thread:", event.threadID);

        /*
         * শুধু test reply।
         * নিজের পাঠানো message ignore করা হবে।
         */

        const reply =
            "🤖 HRIDOY BOT ONLINE\n\n" +
            "📥 তোমার মেসেজ পেয়েছি!\n" +
            "💬 " + body;

        api.sendMessage(
            reply,
            event.threadID,
            sendErr => {
                if (sendErr) {
                    console.error("❌ Reply পাঠাতে সমস্যা:");
                    console.error(sendErr);
                } else {
                    console.log("✅ Reply পাঠানো হয়েছে");
                }
            }
        );
    });

    console.log("🟢 BOT LISTENER RUNNING");
    console.log("📩 এখন Facebook Inbox-এ একটি test message পাঠাও।");
}

);
