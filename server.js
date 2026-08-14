require("dotenv").config();

const express = require("express");
const fetch = require("node-fetch");
const {
  buildPaymentSessionPayload,
  getSupportedCountryCodes,
  isCountrySupported,
  normalizeCountryCode,
} = require("./lib/country-sessions");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const PUBLIC_KEY = process.env.CHECKOUT_PUBLIC_KEY;
const SECRET_KEY = process.env.CHECKOUT_SECRET_KEY;
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function assertCheckoutKeys() {
  if (!PUBLIC_KEY || !SECRET_KEY) {
    const error = new Error(
      "Missing CHECKOUT_PUBLIC_KEY or CHECKOUT_SECRET_KEY environment variables",
    );
    error.statusCode = 500;
    throw error;
  }
}

function isOriginAllowed(origin) {
  if (!origin) return true;
  if (ALLOWED_ORIGINS.length === 0) return true;
  return ALLOWED_ORIGINS.includes(origin);
}

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && isOriginAllowed(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  return next();
});

app.use(express.static("public"));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/config", (_req, res) => {
  try {
    assertCheckoutKeys();
    res.json({
      publicKey: PUBLIC_KEY,
      supportedCountries: getSupportedCountryCodes(),
    });
  } catch (error) {
    console.error(error.message);
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

app.post("/create-payment-sessions", async (req, res) => {
  const country = normalizeCountryCode(req.body?.country || "us");

  if (!isCountrySupported(country)) {
    return res.status(400).json({
      error: `Unsupported country "${country}"`,
      supportedCountries: getSupportedCountryCodes(),
    });
  }

  try {
    assertCheckoutKeys();
    const payload = buildPaymentSessionPayload(country);

    const request = await fetch(
      "https://api.sandbox.checkout.com/payment-sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    const parsedPayload = await request.json();
    res.status(request.status).send(parsedPayload);
  } catch (error) {
    console.error("Failed to create payment session:", error);
    res.status(error.statusCode || 500).json({
      error: error.message || "Failed to create payment session",
    });
  }
});

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Node server listening on port ${PORT}`),
);
