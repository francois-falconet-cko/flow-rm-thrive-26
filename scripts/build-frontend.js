#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const publicDir = path.join(rootDir, "public");

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

for (const entry of fs.readdirSync(publicDir)) {
  fs.cpSync(path.join(publicDir, entry), path.join(distDir, entry), {
    recursive: true,
  });
}

function normalizeApiBaseUrl(raw) {
  let value = String(raw || "")
    .trim()
    .replace(/^API_BASE_URL=/i, "")
    .replace(/\/$/, "");

  if (value && !/^https?:\/\//i.test(value)) {
    console.warn(
      `Ignoring invalid API_BASE_URL (must start with https://): ${value}`,
    );
    return "";
  }

  return value;
}

const apiBaseUrl = normalizeApiBaseUrl(process.env.API_BASE_URL);

const runtimeConfig = `/**
 * Generated at build time — do not edit by hand.
 */
window.RUNTIME_CONFIG = {
  API_BASE_URL: ${JSON.stringify(apiBaseUrl)},
};
`;

fs.writeFileSync(path.join(distDir, "runtime-config.js"), runtimeConfig);

console.log(`Built dist/ with API_BASE_URL=${apiBaseUrl || "(same origin)"}`);
