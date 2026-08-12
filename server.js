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

app.use(express.static("public"));
app.use(express.json());

const PUBLIC_KEY = process.env.CHECKOUT_PUBLIC_KEY;
const SECRET_KEY = process.env.CHECKOUT_SECRET_KEY;

if (!PUBLIC_KEY || !SECRET_KEY) {
  throw new Error(
    "Missing CHECKOUT_PUBLIC_KEY or CHECKOUT_SECRET_KEY in .env",
  );
}

app.get("/config", (_req, res) => {
  res.json({
    publicKey: PUBLIC_KEY,
    supportedCountries: getSupportedCountryCodes(),
  });
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

app.listen(3001, () =>
  console.log("Node server listening on port 3001: http://localhost:3001/"),
);
