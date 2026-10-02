"use strict";

const express = require("express");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const CONFIG_PATH = path.join(ROOT, "config.json");

function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error("config.json পাওয়া যায়নি।");
  }

  try {
    return JSON.parse(
      fs.readFileSync(CONFIG_PATH, "utf8")
    );
  } catch (err) {
    throw new Error("config.json সঠিক JSON নয়।");
  }
}

const config = loadConfig();

const app = express();
const PORT = Number(process.env.PORT || config.Port || 3000);

app.get("/", (req, res) => {
  res.json({
    status: "online",
    bot: "Hriday Bot",
    developer: config.Developer || "Unknown",
    node: process.version,
    uptime: Math.floor(process.uptime())
  });
});

app.get(
  config.Server?.HealthPath || "/health",
  (req, res) => {
    res.json({
      status: "ok",
      uptime: Math.floor(process.uptime()),
      memory: process.memoryUsage().rss
    });
  }
);

const server = app.listen(PORT, () => {
  console.log("╔════════════════════════════════════╗");
  console.log("║          HRIDAY BOT                 ║");
  console.log("╚════════════════════════════════════╝");
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🟢 Node.js: ${process.version}`);
  console.log(
    `👨‍💻 Developer: ${config.Developer || "Unknown"}`
  );
});

function shutdown(signal) {
  console.log(`\n⚠️ ${signal} received. Shutting down...`);

  server.close(() => {
    console.log("✅ Server stopped safely.");
    process.exit(0);
  });

  setTimeout(() => {
    process.exit(1);
  }, 10000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:");
  console.error(err);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:");
  console.error(err);
});

console.log("🚀 Hriday Bot starter চালু হয়েছে।");
console.log("ℹ️ Messenger/Facebook login adapter এখানে intentionally যোগ করা হয়নি।");
