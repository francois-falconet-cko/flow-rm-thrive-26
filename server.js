require("dotenv").config();

const express = require("express");
const {
  getConfigResponse,
  createPaymentSessionResponse,
} = require("./lib/checkout-api");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

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
    const result = getConfigResponse();
    res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error(error.message);
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

app.post("/create-payment-sessions", async (req, res) => {
  try {
    const result = await createPaymentSessionResponse(
      req.body?.country,
      req.body?.variant,
      req.body?.journey,
    );
    res.status(result.statusCode).json(result.body);
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
