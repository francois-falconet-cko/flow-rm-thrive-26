const fetch = require("node-fetch");
const {
  buildPaymentSessionPayload,
  getSupportedCountryCodes,
  getSupportedJourneys,
  getSupportedVariants,
  isCountrySupported,
  isJourneySupported,
  isVariantSupported,
  normalizeCountryCode,
  normalizeJourney,
  normalizeVariant,
} = require("./country-sessions");

function getCheckoutKeys() {
  const publicKey = process.env.CHECKOUT_PUBLIC_KEY;
  const secretKey = process.env.CHECKOUT_SECRET_KEY;

  if (!publicKey || !secretKey) {
    const error = new Error(
      "Missing CHECKOUT_PUBLIC_KEY or CHECKOUT_SECRET_KEY environment variables",
    );
    error.statusCode = 500;
    throw error;
  }

  return { publicKey, secretKey };
}

function getConfigResponse() {
  const { publicKey } = getCheckoutKeys();
  return {
    statusCode: 200,
    body: {
      publicKey,
      supportedCountries: getSupportedCountryCodes(),
    },
  };
}

async function createPaymentSessionResponse(
  countryInput,
  variantInput,
  journeyInput,
) {
  const country = normalizeCountryCode(countryInput || "us");
  const variant = normalizeVariant(variantInput);
  const journey = normalizeJourney(journeyInput);

  if (!isCountrySupported(country)) {
    return {
      statusCode: 400,
      body: {
        error: `Unsupported country "${country}"`,
        supportedCountries: getSupportedCountryCodes(),
      },
    };
  }

  if (!isVariantSupported(variant)) {
    return {
      statusCode: 400,
      body: {
        error: `Unsupported processing-channel variant "${variant}"`,
        supportedVariants: getSupportedVariants(),
      },
    };
  }

  if (!isJourneySupported(journey)) {
    return {
      statusCode: 400,
      body: {
        error: `Unsupported shopper journey "${journey}"`,
        supportedJourneys: getSupportedJourneys(),
      },
    };
  }

  const { secretKey } = getCheckoutKeys();
  const payload = buildPaymentSessionPayload(country, variant, journey);

  const request = await fetch(
    "https://api.sandbox.checkout.com/payment-sessions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const parsedPayload = await request.json();

  return {
    statusCode: request.status,
    body: parsedPayload,
  };
}

module.exports = {
  getConfigResponse,
  createPaymentSessionResponse,
};
