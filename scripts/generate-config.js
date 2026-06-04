/**
 * Writes config.js from environment variables (Vercel build or local).
 * Set in Vercel: WEB3FORMS_ACCESS_KEY, SCHEDULE_CALL_URL,
 * SITE_URL, CONTACT_EMAIL, LINKEDIN_URL, INSTAGRAM_URL, YOUTUBE_URL, TWITTER_URL
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const out = path.join(root, "config.js");

const cfg = {
  web3formsAccessKey: process.env.WEB3FORMS_ACCESS_KEY || "",
  scheduleCallUrl: process.env.SCHEDULE_CALL_URL || "",
  siteUrl: (process.env.SITE_URL || "https://www.kramaai.com").replace(/\/$/, ""),
  contactEmail: process.env.CONTACT_EMAIL || "hello@kramaai.com",
  linkedInUrl: process.env.LINKEDIN_URL || "",
  instagramUrl: process.env.INSTAGRAM_URL || "",
  youtubeUrl: process.env.YOUTUBE_URL || "",
  twitterUrl: process.env.TWITTER_URL || "",
};

const body =
  "/* Auto-generated — do not edit. Set env vars in Vercel or copy config.example.js locally. */\n" +
  "window.KRAMA_CONFIG = " +
  JSON.stringify(cfg, null, 2) +
  ";\n";

fs.writeFileSync(out, body, "utf8");
console.log("Wrote config.js (" + Object.keys(cfg).join(", ") + ")");
