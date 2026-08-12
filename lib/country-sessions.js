/**
 * Per-country Payment Session overrides for Checkout.com Flow.
 * Add a new entry here when wiring another flag button.
 *
 * Only fields that differ from the shared base need to be listed.
 * Nested objects are deep-merged on top of the base payload.
 *
 * @see https://api-reference.checkout.com/tag/Flow#operation/CreatePaymentSession
 */

const BASE_AMOUNT = 6540;

const BASE_PAYMENT_SESSION = {
  amount: BASE_AMOUNT,
  currency: "USD",
  payment_type: "Regular",
  reference: "ORD-THRIVE-DEMO",
  description: "Flow demo payment",
  billing_descriptor: {
    name: "Checkout Demo",
    city: "London",
  },
  customer: {
    email: "demo.shopper@example.com",
    name: "Demo Shopper",
  },
  shipping: {
    address: {
      address_line1: "123 Market Street",
      address_line2: "Suite 100",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      country: "US",
    },
    phone: {
      number: "4155552671",
      country_code: "+1",
    },
  },
  billing: {
    address: {
      address_line1: "123 Market Street",
      address_line2: "Suite 100",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      country: "US",
    },
    phone: {
      number: "4155552671",
      country_code: "+1",
    },
  },
  risk: {
    enabled: true,
  },
  success_url: "http://localhost:3001/?status=succeeded",
  failure_url: "http://localhost:3001/?status=failed",
  metadata: {
    demo: "thrive-flow",
  },
  processing_channel_id: "pc_7tqpcv74s6wupapsfzo3fsgutu",
  items: [
    {
      name: "Demo product",
      quantity: 1,
      unit_price: BASE_AMOUNT,
    },
  ],
};

/**
 * Country-specific overrides keyed by lowercase ISO 3166-1 alpha-2 code.
 * Start with US; extend this map country by country.
 */
const COUNTRY_SESSION_OVERRIDES = {
  us: {
    currency: "USD",
    payment_type: "Regular",
    processing_channel_id: "pc_7tqpcv74s6wupapsfzo3fsgutu",
    customer: {
      email: "us.shopper@example.com",
      name: "Alex Morgan",
    },
    billing: {
      address: {
        address_line1: "123 Market Street",
        address_line2: "Suite 100",
        city: "San Francisco",
        state: "CA",
        zip: "94105",
        country: "US",
      },
      phone: {
        number: "4155552671",
        country_code: "+1",
      },
    },
    shipping: {
      address: {
        address_line1: "123 Market Street",
        address_line2: "Suite 100",
        city: "San Francisco",
        state: "CA",
        zip: "94105",
        country: "US",
      },
      phone: {
        number: "4155552671",
        country_code: "+1",
      },
    },
    items: [
      {
        name: "Demo product",
        quantity: 1,
        unit_price: BASE_AMOUNT,
      },
    ],
  },

  ca: {
    currency: "CAD",
    payment_type: "Regular",
    processing_channel_id: "pc_jx7ges3jql2ufdp4iqxkicnymu",
    customer: {
      email: "ca.shopper@example.com",
      name: "Jordan Lee",
    },
    billing: {
      address: {
        address_line1: "100 Queen Street West",
        address_line2: "Floor 5",
        city: "Toronto",
        state: "ON",
        zip: "M5H 2N2",
        country: "CA",
      },
      phone: {
        number: "4165550199",
        country_code: "+1",
      },
    },
    shipping: {
      address: {
        address_line1: "100 Queen Street West",
        address_line2: "Floor 5",
        city: "Toronto",
        state: "ON",
        zip: "M5H 2N2",
        country: "CA",
      },
      phone: {
        number: "4165550199",
        country_code: "+1",
      },
    },
    items: [
      {
        name: "Demo product",
        quantity: 1,
        unit_price: BASE_AMOUNT,
      },
    ],
  },

  br: {
    currency: "BRL",
    payment_type: "Regular",
    processing_channel_id: "pc_cmen3vj7i6wevor7u5kmgcvytm",
    customer: {
      email: "br.shopper@example.com",
      name: "Ana Silva",
    },
    billing: {
      address: {
        address_line1: "Avenida Paulista 1000",
        address_line2: "Sala 12",
        city: "Sao Paulo",
        state: "SP",
        zip: "01310-100",
        country: "BR",
      },
      phone: {
        number: "11987654321",
        country_code: "+55",
      },
    },
    shipping: {
      address: {
        address_line1: "Avenida Paulista 1000",
        address_line2: "Sala 12",
        city: "Sao Paulo",
        state: "SP",
        zip: "01310-100",
        country: "BR",
      },
      phone: {
        number: "11987654321",
        country_code: "+55",
      },
    },
    items: [
      {
        name: "Demo product",
        quantity: 1,
        unit_price: BASE_AMOUNT,
      },
    ],
  },
};

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function deepMerge(base, override) {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override === undefined ? base : override;
  }

  const result = { ...base };

  for (const [key, value] of Object.entries(override)) {
    if (Array.isArray(value)) {
      result[key] = value.slice();
    } else if (isPlainObject(value) && isPlainObject(base[key])) {
      result[key] = deepMerge(base[key], value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

function getSupportedCountryCodes() {
  return Object.keys(COUNTRY_SESSION_OVERRIDES);
}

function isCountrySupported(countryCode) {
  return Boolean(COUNTRY_SESSION_OVERRIDES[normalizeCountryCode(countryCode)]);
}

function normalizeCountryCode(countryCode) {
  return String(countryCode || "")
    .trim()
    .toLowerCase();
}

/**
 * Build the Create Payment Session request body for a given country flag.
 * @param {string} countryCode - e.g. "us"
 * @returns {object}
 */
function buildPaymentSessionPayload(countryCode) {
  const code = normalizeCountryCode(countryCode);
  const overrides = COUNTRY_SESSION_OVERRIDES[code];

  if (!overrides) {
    const error = new Error(
      `No payment-session config for country "${countryCode}". ` +
        `Supported: ${getSupportedCountryCodes().join(", ") || "(none)"}`,
    );
    error.statusCode = 400;
    throw error;
  }

  return deepMerge(BASE_PAYMENT_SESSION, {
    ...overrides,
    metadata: {
      ...BASE_PAYMENT_SESSION.metadata,
      country: code.toUpperCase(),
    },
  });
}

module.exports = {
  BASE_AMOUNT,
  BASE_PAYMENT_SESSION,
  COUNTRY_SESSION_OVERRIDES,
  buildPaymentSessionPayload,
  getSupportedCountryCodes,
  isCountrySupported,
  normalizeCountryCode,
};
