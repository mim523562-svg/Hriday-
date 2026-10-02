const fs = require("fs-extra");
const path = require("path");
const request = require("request");

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//        💎 HRIDAY HELP 2 • V2 SYSTEM 💎
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

module.exports.config = {
  name: "help2",
  version: "2.2.0",
  hasPermssion: 0,
  credits: "💎 𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐀𝐒𝐀𝐍 𝐒𝐇𝐀𝐍𝐓𝐎 💎",
  description: "💠 Full Emoji Stylish Command System",
  commandCategory: "SYSTEM",
  usages: "[command name]",
  cooldowns: 5,

  envConfig: {
    autoUnsend: true,
    delayUnsend: 90
  }
};

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//                 🖼️ IMAGE
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const HELP_IMAGE =
  "https://i.imgur.com/QS7TTQx.jpeg";

async function getHelpImage() {
  const imagePath = path.join(
    __dirname,
    `help2_${Date.now()}_${Math.floor(
      Math.random() * 999999
    )}.jpeg`
  );

  try {
    await new Promise((resolve, reject) => {
      request(
        {
          url: HELP_IMAGE,
          encoding: null
        },
        (error, response, body) => {
          if (error) {
            return reject(error);
          }

          if (
            !response ||
            response.statusCode !== 200
          ) {
            return reject(
              new Error(
                `HTTP Status: ${
                  response
                    ? response.statusCode
                    : "Unknown"
                }`
              )
            );
          }

          fs.writeFileSync(
            imagePath,
            body
          );

          resolve();
        }
      );
    });

    return {
      attachments: [
        fs.createReadStream(imagePath)
      ],

      cleanup: () => {
        try {
          if (
            fs.existsSync(imagePath)
          ) {
            fs.unlinkSync(imagePath);
          }
        } catch (e) {}
      }
    };
  } catch (error) {
    console.error(
      "[HELP2] Image Error:",
      error.message
    );

    return {
      attachments: [],
      cleanup: () => {}
    };
  }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//                 🔀 RANDOM
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function shuffleCommands(commands) {
  const arr = [...commands];

  for (
    let i = arr.length - 1;
    i > 0;
    i--
  ) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [
      arr[i],
      arr[j]
    ] = [
      arr[j],
      arr[i]
    ];
  }

  return arr;
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//                 😀 EMOJI
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function randomIcon() {
  const icons = [
    "💠",
    "🔹",
    "🔸",
    "✨",
    "⚡",
    "💫",
    "🌸",
    "🔥",
    "💎",
    "🦋",
    "🌙",
    "🎀",
    "🌟",
    "🪽",
    "🔮",
    "🍁",
    "🖤",
    "🤍",
    "💜",
    "💙"
  ];

  return icons[
    Math.floor(
      Math.random() * icons.length
    )
  ];
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//              📂 CATEGORY ICON
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function categoryIcon(category) {
  const cat = String(
    category || ""
  ).toLowerCase();

  if (
    cat.includes("admin") ||
    cat.includes("system")
  ) {
    return "🛡️";
  }

  if (
    cat.includes("info") ||
    cat.includes("information")
  ) {
    return "👤";
  }

  if (
    cat.includes("ai") ||
    cat.includes("bot")
  ) {
    return "🤖";
  }

  if (
    cat.includes("fun") ||
    cat.includes("game")
  ) {
    return "🎮";
  }

  if (
    cat.includes("music") ||
    cat.includes("song")
  ) {
    return "🎵";
  }

  if (
    cat.includes("media") ||
    cat.includes("video")
  ) {
    return "🎬";
  }

  if (
    cat.includes("utility") ||
    cat.includes("tools")
  ) {
    return "🧰";
  }

  if (
    cat.includes("owner")
  ) {
    return "👑";
  }

  if (
    cat.includes("group")
  ) {
    return "👥";
  }

  return "📂";
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//                 🚀 RUN
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

module.exports.run = async function ({
  api,
  event,
  args
}) {
  const {
    threadID,
    messageID
  } = event;

  const {
    commands
  } = global.client;

  const threadSetting =
    global.data.threadData.get(
      threadID
    ) || {};

  const prefix =
    threadSetting.PREFIX ||
    global.config.PREFIX ||
    "/";

  const botName =
    global.config.BOTNAME ||
    "𝐇𝐑𝐈𝐃𝐀𝐘 𝐁𝐎𝐓";

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //            🔎 COMMAND INFO
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  if (
    args[0] &&
    commands.has(
      args[0].toLowerCase()
    )
  ) {
    const command =
      commands.get(
        args[0].toLowerCase()
      );

    const config =
      command.config || {};

    const info = `
╔══════════════════════════════╗
║
║       💎 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎 💎
║       ✨ 𝐕𝟐 𝐒𝐘𝐒𝐓𝐄𝐌 ✨
║
╠══════════════════════════════╣
║
║ 🏷️ 𝐍𝐀𝐌𝐄
║    ➜ ${config.name || "Unknown"}
║
║ 📝 𝐔𝐒𝐀𝐆𝐄
║    ➜ ${config.usages || "None"}
║
║ 📖 𝐃𝐄𝐒𝐂𝐑𝐈𝐏𝐓𝐈𝐎𝐍
║    ➜ ${
      config.description ||
      "None"
    }
║
║ 🔐 𝐏𝐄𝐑𝐌𝐈𝐒𝐒𝐈𝐎𝐍
║    ➜ ${
      config.hasPermssion ??
      config.role ??
      0
    }
║
║ 👨‍💻 𝐂𝐑𝐄𝐃𝐈𝐓
║    ➜ ${
      config.credits ||
      "Unknown"
    }
║
║ 📂 𝐂𝐀𝐓𝐄𝐆𝐎𝐑𝐘
║    ➜ ${
      config.commandCategory ||
      "OTHER"
    }
║
║ ⏳ 𝐂𝐎𝐎𝐋𝐃𝐎𝐖𝐍
║    ➜ ${
      config.cooldowns ||
      0
    }𝐬
║
╠══════════════════════════════╣
║
║ ⚡ 𝐏𝐑𝐄𝐅𝐈𝐗
║    ➜ ${prefix}
║
║ 🤖 𝐁𝐎𝐓
║    ➜ ${botName}
║
║ 🧩 𝐂𝐎𝐌𝐌𝐀𝐍𝐃
║    ➜ ${prefix}${config.name || ""}
║
╠══════════════════════════════╣
║
║ 👑 𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑
║    ➜ হৃদয় হাসান শান্ত
║
║ 💎 𝐒𝐘𝐒𝐓𝐄𝐌
║    ➜ 𝐕𝟐 𝐄𝐌𝐎𝐉𝐈 𝐄𝐃𝐈𝐓𝐈𝐎𝐍
║
║ 🖤 𝐒𝐓𝐀𝐓𝐔𝐒
║    ➜ 𝐎𝐍𝐋𝐈𝐍𝐄
║
╚══════════════════════════════╝`;

    try {
      const {
        attachments,
        cleanup
      } = await getHelpImage();

      return api.sendMessage(
        {
          body: info,
          attachment: attachments
        },
        threadID,
        (err, sent) => {
          cleanup();

          if (
            !err &&
            sent &&
            module.exports.config
              .envConfig
              .autoUnsend
          ) {
            setTimeout(
              () => {
                if (
                  sent.messageID
                ) {
                  api.unsendMessage(
                    sent.messageID
                  );
                }
              },
              module.exports.config
                .envConfig
                .delayUnsend * 1000
            );
          }
        },
        messageID
      );
    } catch (error) {
      console.error(
        "[HELP2] Info Error:",
        error
      );

      return api.sendMessage(
        info,
        threadID,
        messageID
      );
    }
  }

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //              📂 GROUPING
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const groups = {};
  const categoryDisplay = {};

  for (
    const [
      name,
      cmd
    ] of commands
  ) {
    const category =
      String(
        cmd.config?.commandCategory ||
        "OTHER"
      ).trim() || "OTHER";

    const key =
      category.toLowerCase();

    if (!groups[key]) {
      groups[key] = [];

      categoryDisplay[key] =
        category.toUpperCase();
    }

    groups[key].push(name);
  }

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //              💎 HEADER
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  let body = `
╔══════════════════════════════╗
║
║       💎 𝐇𝐑𝐈𝐃𝐀𝐘 𝐁𝐎𝐓 💎
║
║       ✨ 𝐇𝐄𝐋𝐏 𝟐 • 𝐕𝟐 ✨
║       🖤 𝐄𝐌𝐎𝐉𝐈 𝐒𝐘𝐒𝐓𝐄𝐌 🖤
║
╠══════════════════════════════╣
║
║ 👑 𝐎𝐖𝐍𝐄𝐑
║    ➜ হৃদয় হাসান শান্ত
║
║ 🤖 𝐁𝐎𝐓
║    ➜ ${botName}
║
║ ⚡ 𝐏𝐑𝐄𝐅𝐈𝐗
║    ➜ ${prefix}
║
║ 📦 𝐓𝐎𝐓𝐀𝐋
║    ➜ ${commands.size} 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒
║
╠══════════════════════════════╣`;

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //             📋 COMMANDS
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  let firstCategory = true;

  for (
    const cat of Object.keys(groups)
  ) {
    if (
      !groups[cat] ||
      groups[cat].length === 0
    ) {
      continue;
    }

    if (!firstCategory) {
      body +=
        `\n╠══════════════════════════════╣`;
    }

    const display =
      categoryDisplay[cat];

    body += `
║
║ ${categoryIcon(display)}
║ 『 𝐂𝐀𝐓𝐄𝐆𝐎𝐑𝐘 ➜ ${display} 』
║`;

    const randomCommands =
      shuffleCommands(
        groups[cat]
      );

    randomCommands.forEach(
      cmd => {
        body +=
          `\n║ ${randomIcon()} 𝐂𝐌𝐃 ➜ ${prefix}${cmd}`;
      }
    );

    firstCategory = false;
  }

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //               🦋 FOOTER
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  body += `
║
╠══════════════════════════════╣
║
║ 📊 𝐓𝐎𝐓𝐀𝐋 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒
║    ➜ ${commands.size}
║
║ ⚡ 𝐏𝐑𝐄𝐅𝐈𝐗
║    ➜ ${prefix}
║
║ 👑 𝐎𝐖𝐍𝐄𝐑
║    ➜ হৃদয় হাসান শান্ত
║
║ 👨‍💻 𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑
║    ➜ 𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐀𝐒𝐀𝐍 𝐒𝐇𝐀𝐍𝐓𝐎
║
╠══════════════════════════════╣
║
║ 💡 𝐇𝐎𝐖 𝐓𝐎 𝐔𝐒𝐄
║    ➜ ${prefix}help2 <command>
║
║ 🔎 𝐄𝐗𝐀𝐌𝐏𝐋𝐄
║    ➜ ${prefix}help2 info
║
║ 💎 𝐒𝐘𝐒𝐓𝐄𝐌
║    ➜ 𝐕𝟐 𝐄𝐌𝐎𝐉𝐈 𝐄𝐃𝐈𝐓𝐈𝐎𝐍
║
║ 🟢 𝐒𝐓𝐀𝐓𝐔𝐒
║    ➜ 𝐎𝐍𝐋𝐈𝐍𝐄
║
║ 🪽 𝐓𝐇𝐀𝐍𝐊𝐒
║    ➜ 𝐅𝐎𝐑 𝐔𝐒𝐈𝐍𝐆 𝐇𝐑𝐈𝐃𝐀𝐘 𝐁𝐎𝐓
║
╚══════════════════════════════╝`;

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //                📤 SEND
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  try {
    const {
      attachments,
      cleanup
    } = await getHelpImage();

    api.sendMessage(
      {
        body,
        attachment: attachments
      },
      threadID,
      (err, sent) => {
        cleanup();

        if (
          !err &&
          sent &&
          module.exports.config
            .envConfig
            .autoUnsend
        ) {
          setTimeout(
            () => {
              if (
                sent.messageID
              ) {
                api.unsendMessage(
                  sent.messageID
                );
              }
            },
            module.exports.config
              .envConfig
              .delayUnsend * 1000
          );
        }
      },
      messageID
    );
  } catch (error) {
    console.error(
      "[HELP2] Send Error:",
      error
    );

    api.sendMessage(
      body,
      threadID,
      messageID
    );
  }
};
