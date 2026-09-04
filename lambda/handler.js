const {
  getConfigResponse,
  createPaymentSessionResponse,
} = require("../lib/checkout-api");

const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function isOriginAllowed(origin) {
  if (!origin) return true;
  if (ALLOWED_ORIGINS.length === 0) return true;
  return ALLOWED_ORIGINS.includes(origin);
}

function corsHeaders(origin) {
  if (!origin || !isOriginAllowed(origin)) {
    return {
      "Content-Type": "application/json",
    };
  }

  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function parseBody(event) {
  if (!event.body) return {};

  const raw = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf8")
    : event.body;

  try {
    return JSON.parse(raw);
  } catch (_error) {
    return {};
  }
}

function normalizePath(event) {
  const rawPath = event.rawPath || event.path || "/";
  return rawPath.replace(/\/+$/, "") || "/";
}

function response(statusCode, body, origin) {
  return {
    statusCode,
    headers: corsHeaders(origin),
    body: typeof body === "string" ? body : JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || "";
  const method =
    event.requestContext?.http?.method || event.httpMethod || "GET";
  const path = normalizePath(event);

  if (method === "OPTIONS") {
    return response(204, "", origin);
  }

  try {
    if (method === "GET" && path === "/health") {
      return response(200, { status: "ok" }, origin);
    }

    if (method === "GET" && path === "/config") {
      const result = getConfigResponse();
      return response(result.statusCode, result.body, origin);
    }

    if (method === "POST" && path === "/create-payment-sessions") {
      const body = parseBody(event);
      const result = await createPaymentSessionResponse(
        body.country,
        body.variant,
      );
      return response(result.statusCode, result.body, origin);
    }

    return response(
      404,
      {
        error: `Route not found: ${method} ${path}`,
      },
      origin,
    );
  } catch (error) {
    console.error("Lambda handler error:", error);
    return response(
      error.statusCode || 500,
      { error: error.message || "Internal server error" },
      origin,
    );
  }
};
