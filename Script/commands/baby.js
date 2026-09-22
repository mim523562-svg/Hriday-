const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get(
    "https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json"
  );
  return base.data.api;
};

module.exports.config = {
  name: "baby",
  version: "7.0.0",
  credits: "dipto + modified by হৃদয় হাসান শান্ত",
  cooldowns: 0,
  hasPermssion: 0,
  description: "better than all sim simi",
  commandCategory: "chat",
  category: "chat",
  usePrefix: true,
  prefix: true,
  usages: `[anyMessage] OR
teach [YourMessage] - [Reply1], [Reply2], [Reply3]...
OR teach [react] [YourMessage] - [react1], [react2], [react3]...
OR remove [YourMessage]
OR rm [YourMessage] - [indexNumber]
OR msg [YourMessage]
OR list
OR all
OR edit [YourMessage] - [NewMessage]`,
};

module.exports.run = async function ({ api, event, args, Users }) {
  try {
    const link = `${await baseApiUrl()}/baby`;
    const dipto = args.join(" ").toLowerCase();
    const uid = event.senderID;

    if (!args[0]) {
      const ran = [
        "Bolo baby 😘",
        "হুম বলো জানু 💖",
        "type help baby 💬",
        "type !baby hi 🌸"
      ];

      const r = ran[Math.floor(Math.random() * ran.length)];
      return api.sendMessage(r, event.threadID, event.messageID);
    }

    if (args[0] === "remove") {
      const fina = dipto.replace("remove ", "");
      const respons = await axios.get(
        `${link}?remove=${encodeURIComponent(fina)}&senderID=${uid}`
      );

      return api.sendMessage(
        respons.data.message,
        event.threadID,
        event.messageID
      );
    }

    if (args[0] === "rm" && dipto.includes("-")) {
      const [fi, f] = dipto.replace("rm ", "").split(" - ");

      const respons = await axios.get(
        `${link}?remove=${encodeURIComponent(fi)}&index=${encodeURIComponent(f)}`
      );

      return api.sendMessage(
        respons.data.message,
        event.threadID,
        event.messageID
      );
    }

    if (args[0] === "list") {
      if (args[1] === "all") {
        const res = await axios.get(`${link}?list=all`);
        const data = res.data.teacher.teacherList || [];

        const teachers = await Promise.all(
          data.map(async (item) => {
            const number = Object.keys(item)[0];
            const value = item[number];
            const name = await Users.getName(number).catch(() => null);

            return {
              name: name || "unknown",
              value
            };
          })
        );

        teachers.sort((a, b) => b.value - a.value);

        const output = teachers
          .map(
            (teacher, index) =>
              `${index + 1}/ ${teacher.name}: ${teacher.value}`
          )
          .join("\n");

        return api.sendMessage(
          `Total Teach = ${res.data.length}\n\n👑 | List of Teachers of baby\n${output}`,
          event.threadID,
          event.messageID
        );
      } else {
        const respo = await axios.get(`${link}?list=all`);

        return api.sendMessage(
          `Total Teach = ${respo.data.length}`,
          event.threadID,
          event.messageID
        );
      }
    }

    if (args[0] === "msg" || args[0] === "message") {
      const fuk = dipto.replace("msg ", "");

      const respo = await axios.get(
        `${link}?list=${encodeURIComponent(fuk)}`
      );

      return api.sendMessage(
        `Message ${fuk} = ${respo.data.data}`,
        event.threadID,
        event.messageID
      );
    }

    if (args[0] === "edit") {
      const command = dipto.split(" - ")[1];

      if (!command || command.length < 2) {
        return api.sendMessage(
          "❌ | Invalid format! Use edit [YourMessage] - [NewReply]",
          event.threadID,
          event.messageID
        );
      }

      const question = dipto
        .split(" - ")[0]
        .replace("edit ", "")
        .trim();

      const res = await axios.get(
        `${link}?edit=${encodeURIComponent(question)}&replace=${encodeURIComponent(command)}`
      );

      return api.sendMessage(
        `changed ${res.data.message}`,
        event.threadID,
        event.messageID
      );
    }

    if (args[0] === "teach" && args[1] !== "amar" && args[1] !== "react") {
      const [comd, command] = dipto.split(" - ");
      const final = comd.replace("teach ", "");

      if (!command || command.length < 2) {
        return api.sendMessage(
          "❌ | Invalid format! Use [YourMessage] - [Reply1], [Reply2], [Reply3]...",
          event.threadID,
          event.messageID
        );
      }

      const re = await axios.get(
        `${link}?teach=${encodeURIComponent(final)}&reply=${encodeURIComponent(command)}&senderID=${uid}`
      );

      const name = await Users.getName(re.data.teacher).catch(() => null);

      return api.sendMessage(
        `✅ Replies added ${re.data.message}\nTeacher: ${name || "unknown"}\nTeachs: ${re.data.teachs}`,
        event.threadID,
        event.messageID
      );
    }

    if (args[0] === "teach" && args[1] === "amar") {
      const [comd, command] = dipto.split(" - ");
      const final = comd.replace("teach ", "");

      if (!command || command.length < 2) {
        return api.sendMessage(
          "❌ | Invalid format! Use [YourMessage] - [Reply1], [Reply2], [Reply3]...",
          event.threadID,
          event.messageID
        );
      }

      const re = await axios.get(
        `${link}?teach=${encodeURIComponent(final)}&senderID=${uid}&reply=${encodeURIComponent(command)}&key=intro`
      );

      return api.sendMessage(
        `✅ Replies added ${re.data.message}`,
        event.threadID,
        event.messageID
      );
    }

    if (args[0] === "teach" && args[1] === "react") {
      const [comd, command] = dipto.split(" - ");
      const final = comd.replace("teach react ", "");

      if (!command || command.length < 2) {
        return api.sendMessage(
          "❌ | Invalid format! Use [teach react] [YourMessage] - [react1], [react2], [react3]...",
          event.threadID,
          event.messageID
        );
      }

      const re = await axios.get(
        `${link}?teach=${encodeURIComponent(final)}&react=${encodeURIComponent(command)}`
      );

      return api.sendMessage(
        `✅ Replies added ${re.data.message}`,
        event.threadID,
        event.messageID
      );
    }

    if (
      [
        "amar name ki",
        "amr nam ki",
        "amar nam ki",
        "amr name ki"
      ].some((phrase) => dipto.includes(phrase))
    ) {
      const response = await axios.get(
        `${link}?text=amar%20name%20ki&senderID=${uid}&key=intro`
      );

      return api.sendMessage(
        response.data.reply,
        event.threadID,
        event.messageID
      );
    }

    const a = (
      await axios.get(
        `${link}?text=${encodeURIComponent(dipto)}&senderID=${uid}&font=1`
      )
    ).data.reply;

    return api.sendMessage(
      a,
      event.threadID,
      (error, info) => {
        if (error || !info) return;

        if (!global.client.handleReply) {
          global.client.handleReply = [];
        }

        global.client.handleReply.push({
          name: this.config.name,
          type: "reply",
          messageID: info.messageID,
          author: event.senderID,
          lnk: a,
          apiUrl: link
        });
      },
      event.messageID
    );
  } catch (e) {
    console.error("Error in command execution:", e);

    return api.sendMessage(
      `Error: ${e.message}`,
      event.threadID,
      event.messageID
    );
  }
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  try {
    if (event.type === "message_reply") {
      const reply = event.body.toLowerCase();

      if (isNaN(reply)) {
        const b = (
          await axios.get(
            `${await baseApiUrl()}/baby?text=${encodeURIComponent(
              reply
            )}&senderID=${event.senderID}&font=1`
          )
        ).data.reply;

        await api.sendMessage(
          b,
          event.threadID,
          (error, info) => {
            if (error || !info) return;

            if (!global.client.handleReply) {
              global.client.handleReply = [];
            }

            global.client.handleReply.push({
              name: this.config.name,
              type: "reply",
              messageID: info.messageID,
              author: event.senderID,
              lnk: b
            });
          },
          event.messageID
        );
      }
    }
  } catch (err) {
    return api.sendMessage(
      `Error: ${err.message}`,
      event.threadID,
      event.messageID
    );
  }
};

module.exports.handleEvent = async function ({ api, event }) {
  try {
    const body = event.body ? event.body.toLowerCase() : "";

    const triggerWords = [
      "baby",
      "bby",
      "bot",
      "বট",
      "mim",
      "মিম",
      "jan",
      "জান",
      "dim",
      "রিয়া",
      "babby"
    ];

    const matched = triggerWords.some((word) =>
      body.startsWith(word.toLowerCase())
    );

    if (!matched) return;

    const arr = body.replace(/^\S+\s*/, "");

    if (!arr) {
      const replies = [
        "বেশি bot Bot করলে leave নিবো কিন্তু😒😒",
        "শুনবো না😼 তুমি আমার হৃদয় হাসান শান্ত বসকে প্রেম করাই দাও নাই🥺 পচা তুমি🥺",
        "এতো ডেকো না, প্রেম এ পরে যাবো তো🙈",
        "বার বার ডাকলে মাথা গরম হয়ে যায় কিন্তু😑",
        "হ্যা বলো😒, তোমার জন্য কি করতে পারি😐😑?",
        "কী হয়ছে এতো ডাকো কেন😒",
        "I love you janu🥰",
        "আরে Bolo আমার জান, কেমন আছো?😚",
        "অসম্মান করছিস😰😿",
        "বট বলে চলে যাস কেন😤🥺 কী হলো উত্তর দে🥺",
        "জানু বল জানু 😘",
        "বার বার Disturb করছিস কোনো😾, আমার হৃদয় হাসান শান্ত বসের সাথে ব্যস্ত আছি😋",
        "এতো ডাকিস কেন🤬",
        "আমারে এতো ডাকিস না আমি মজা করার mood এ নাই এখন😒",
        "চিপায় আছি ডিস্টার্ব করিস না🙊🙁",
        "হ্যাঁ জানু, এইদিকে আসো 😘",
        "তোর কথা তোর বাড়ি কেউ শুনে না, তো আমি কোনো শুনবো?🤔😂",
        "আমাকে ডেকো না, আমি ব্যস্ত আছি",
        "কি হলো, মিসটেক করচ্ছিস নাকি🤣",
        "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏",
        "হা বলো, শুনছি আমি 😏",
        "আর কত বার ডাকবি, শুনছি তো",
        "হুম বলো কি বলবে😒",
        "বলো কি করতে পারি তোমার জন্য",
        "আমি তো অন্ধ কিছু দেখি না🐸😎",
        "হৃদয় হাসান শান্ত বস তোমাকে ভালোবাসে😌",
        "বলো জানু 🌚",
        "তোর কি চোখে পড়ে না আমি হৃদয় হাসান শান্ত বসের সাথে ব্যস্ত আছি😒",
        "একটা কথা বলতে চাইছিলাম🙂",
        "আসসালামু আলাইকুম বলেন আপনার জন্য কি করতে পারি..!🥰",
        "আমাকে এতো ডাকো কেন?🤔 ভালো-টালো বাসো নাকি🤭🙈",
        "🌻🌺💚আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ-💚🌺🌻",
        "আমি এখন বস হৃদয় হাসান শান্ত এর সাথে বিজি আছি আমাকে ডাকবেন না-😕😏 ধন্যবাদ-🤝🌻",
        "আমাকে না ডেকে আমার বস হৃদয় হাসান শান্তকে কে একটা জি এফ দাও-😽🫶🌺",
        "জান🥺 তুমি এখন শুধু বট বলে চলে যাও 😒 ভুলে গেলা নাকি🙂❓",
        "উফফ বুঝলাম না এতো ডাকছেন কেনো-😤😡😈",
        "ভালোবাসা কাকে বলে🙊❓",
        "আজকে আমার মন ভালো নেই তাই আমারে ডাকবেন না-😪🤧",
        "🙂শুনলাম কালকে বলে আপনার বিয়ে???",
        "আমার বস হৃদয় হাসান শান্ত এর হবু বউ রে কেও দেখছো খুজে পাচ্ছি না😪🤧😭",
        "স্বপ্ন তোমারে নিয়ে দেখতে চাই তুমি যদি আমার হয়ে থেকে যাও-💝🌺🌻",
        "জান হাঙ্গা করবা-🙊😝🌻",
        "ইসস এতো ডাকো কেনো লজ্জা লাগে তো-🙈🖤🌼",
        "আমার বস হৃদয় হাসান শান্ত এর পক্ষ থেকে তোমারে এতো এতো ভালোবাসা-🥰😽🫶",
        "আমার বস হৃদয় হাসান শান্ত এর জন্য সবাই দোয়া করবেন-💝",
        "ভালোবাসা নামক আব্লামি করতে মন চাইলে আমার বস হৃদয় হাসান শান্ত এর ইনবক্সে চলে যাও-🙊🥱🌻",
        "জান তুমি শুধু আমার আমি তোমারে ৩৬৫ দিন ভালোবাসি-💝🌺😽",
        "আগে অনেক খারাপ ছিলাম এখন ভালো হয়ে গেছি🙂",
        "রূপের অহংকার করো না-🙂❤️ চকচকে সূর্যটাও দিনশেষে অন্ধকারে পরিণত হয়-🤗💜",
        "সুন্দর মাইয়া মানেই-🥱 আমার বস হৃদয় হাসান শান্ত এর বউ-😽🫶 আর বাকি গুলো আমার বেয়াইন-🙈🐸🤗",
        "এত অহংকার করে লাভ নেই-🌸 মৃত্যুটা নিশ্চিত শুধু সময়টা অনিশ্চিত-🖤🙂",
        "দিন দিন কিছু মানুষের কাছে অপ্রিয় হয়ে যাইতেছি-🙂😿🌸",
        "হুদাই আপনারে শয়তানে লারে-😝😑☹️",
        "তোমার সাথে কথা বলে মনে হচ্ছে আমি কমেডি কিং 😂🎤",
        "🥺আজ তুমি কবরবাসীদের জন্য দোয়া করছ, কাল কেউ তোমার জন্য করবে😔",
        "🤲 গার্লফ্রেন্ডের ভালোবাসার চেয়ে সৃষ্টিকর্তার ভালোবাসা বেশি নিরাপদ ও চিরস্থায়ী😄",
        "🥀 মানুষের ভালোবাসা বদলায়, কিন্তু সৃষ্টিকর্তার ভালোবাসা কখনো বদলায় না🙂",
        "ইস কেউ যদি বলতো-🙂-আমার শুধু তোমাকেই লাগবে-💜🌸",
        "বলো তো, চাঁদে যদি বিয়ে করি, হানিমুনে যাবো কিভাবে? 🌝🚀",
        "হুদাই গ্রুপে আছি-🥺🐸-কেও ইনবক্সে নক দিয়ে বলে না জান তোমারে আমি অনেক ভালোবাসি-🥺🤧",
        "কি'রে গ্রুপে দেখি একটাও বেডি নাই-🙊",
        "আজ থেকে আর কাউকে পাত্তা দিমু না-!😏 কারণ আমি ফর্সা হওয়ার ক্রিম কিনছি-!🙂🐸",
        "বেশি Bot Bot করলে leave নিবো কিন্তু😒😒",
        "এই প্রথম বার বট দেখছো নাকি🥴",
        "হুদাই ডাকাডাকি করো কেন🙂",
        "এত কাছেও এসো না, প্রেম এ পরে যাবো তো 🙈",
        "Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈",
        "সাদিয়াকে চিনো কী??",
        "হা বলো😒, কি করতে পারি😐😑?",
        "আমাকে ডাকলে চকলেট দিতে হবে😒",
        "মেয়ে হলে বস হৃদয় হাসান শান্ত এর সাথে প্রেম করো🙈??",
        "আরে Bolo আমার জান, কেমন আসো?😚",
        "অসম্মান করচ্ছিছ কেন,😰😿",
        "Hop bedi😾, Boss বল boss😼",
        "আমি তো সিরিয়াস নই, আমি শুধু মজা করি 🤪🎈",
        "এইটা তুমি করতে পারলে 🫩🥹",
        "বার বার Disturb করেছিস কোনো😾, আমার বস হৃদয় হাসান শান্ত এর সাথে ব্যস্ত আছি😋",
        "আরে আমি মজা করার mood এ নাই😒",
        "তোমাকে ওইদিন দেখলাম রাস্তায় দাঁড়িয়ে আছো🥴",
        "দূরে যা, তোর কোনো কাজ নাই, শুধু bot bot করিস 😉😋🤣",
        "তোর কথা তোর বাড়ি কেউ শুনে না, তো আমি কোনো শুনবো?🤔😂",
        "আমাকে ডেকো না, আমি ব্যস্ত আছি",
        "কি হলো, মিস টিস করচ্ছিস নাকি🤣",
        "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏",
        "হা বলো, শুনছি আমি 😏",
        "খালি ঢং করে আসে আবার বট বলে চলে যায়🙁😔",
        "আর কত বার ডাকবি, শুনছি তো",
        "বলো কি করতে পারি তোমার জন্য",
        "আমি তো অন্ধ কিছু দেখি না🐸😎",
        "কী হয়ছে😌",
        "বলো জানু 🌚",
        "তোর কি চোখে পড়ে না আমি বস হৃদয় হাসান শান্ত এর সাথে ব্যস্ত আছি😒",
        "༊━━🦋নামাজি মানুষেরা সব থেকে বেশি সুন্দর হয়..!!😇🥀 🦋 কারণ.!! -অজুর পানির মত শ্রেষ্ঠ মেকআপ দুনিয়াতে নেই༊━ღ━༎🥰🥀 🥰-আলহামদুলিল্লাহ-🥰",
        "🌿 জীবন ভিন্ন পথে যায়, কিন্তু শেষ গন্তব্য একই—মাটি🙂",
        "তোমার জন্য আমি খাওয়া-দাওয়া বাদ দিছি🥺",
        "অনুমতি দিলে YouTube-এ কল দিতাম..!😒",
        "🍒---আমি সেই গল্পের বই-🙂 -যে বই সবাই পড়তে পারলেও-😌 -অর্থ বোঝার ক্ষমতা কারো নেই..!☺️🥀💔",
        "~কার জন্য এতো মায়া...!😌🥀 ~এই শহরে আপন বলতে...!😔🥀 ~শুধুই তো নিজের ছায়া...!😥🥀",
        "কারেন্ট একদম বেডিগো মতো-🤧-খালি ঢং করে আসে আবার চলে যায়-😤😾",
        "রাত যত গভীর হয়, বাস্তবতা তত ভয়ংকর হয়ে ওঠে\nকী ভাবছো তোমাকেই বলছি🤧🙊",
        "দুনিয়ার সবাই প্রেম করে.!🤧-আর মানুষ আমার বস হৃদয় হাসান শান্ত কে সন্দেহ করে.!🐸",
        "আমার থেকে ভালো অনেক পাবা-🙂-কিন্তু সব ভালো তে কি আর ভালোবাসা থাকে..!💔🥀",
        "দুনিয়া থেকে চলে যাওয়ার আগে এমন কিছু করে যেও যাতে সবাই তোমাকে মনে করে🙂❤️‍🩹",
        "অবহেলা করিস না-😑😪-যখন নিজেকে বদলে ফেলবো-😌-তখন আমার চেয়েও বেশি কষ্ট পাবি..!🙂💔",
        "বন্ধুর সাথে ছেকা খাওয়া গান শুনতে শুনতে-🤧-এখন আমিও বন্ধুর EX কে অনেক MISS করি-🤕🥺",
        "প্রিয়-🥺-তোমাকে না পেলে আমি সত্যি-😪-আরেকজন কে-😼-পটাতে বাধ্য হবো-😑🤧",
        "কিরে🫵 তরা নাকি prem করস..😐🐸•আমারে একটা করাই দিলে কি হয়-🥺",
        "যেই আইডির মায়ায় পড়ে ভুল্লি আমারে.!🥴-তুই কি জানিস সেই আইডিটাও আমি চালাইরে.!🙂"
      ];

      const randomReply =
        replies[Math.floor(Math.random() * replies.length)];

      await api.sendMessage(
        randomReply,
        event.threadID,
        (error, info) => {
          if (error || !info) return;

          if (!global.client.handleReply) {
            global.client.handleReply = [];
          }

          global.client.handleReply.push({
            name: this.config.name,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID
          });
        },
        event.messageID
      );

      return;
    }

    const a = (
      await axios.get(
        `${await baseApiUrl()}/baby?text=${encodeURIComponent(
          arr
        )}&senderID=${event.senderID}&font=1`
      )
    ).data.reply;

    await api.sendMessage(
      a,
      event.threadID,
      (error, info) => {
        if (error || !info) return;

        if (!global.client.handleReply) {
          global.client.handleReply = [];
        }

        global.client.handleReply.push({
          name: this.config.name,
          type: "reply",
          messageID: info.messageID,
          author: event.senderID,
          lnk: a
        });
      },
      event.messageID
    );
  } catch (err) {
    return api.sendMessage(
      `Error: ${err.message}`,
      event.threadID,
      event.messageID
    );
  }
};
