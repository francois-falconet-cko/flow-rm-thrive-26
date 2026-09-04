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

  ae: {
    currency: "AED",
    payment_type: "Regular",
    processing_channel_id: "pc_vuvz273nbk5efdstxob2mk3yse",
    customer: {
      email: "ae.shopper@example.com",
      name: "Omar Al Farsi",
      summary: {
        registration_date: "2023-05-01",
        first_transaction_date: "2023-07-01",
        last_payment_date: "2023-08-01",
        total_order_count: 15,
        last_payment_amount: 500,
        is_premium_customer: true,
        is_returning_customer: true,
        lifetime_value: 5000,
      },
    },
    billing: {
      address: {
        address_line1: "Olaya Street, Building 12",
        city: "Riyadh",
        zip: "11432",
        country: "AE",
      },
      phone: {
        number: "501234567",
        country_code: "+966",
      },
    },
    shipping: {
      address: {
        address_line1: "Ulaya Dist., P.O.Box: 5665",
        city: "Riyadh",
        zip: "11432",
        country: "AE",
      },
      phone: {
        number: "501234567",
        country_code: "+966",
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

  sa: {
    currency: "SAR",
    payment_type: "Regular",
    processing_channel_id: "pc_vuvz273nbk5efdstxob2mk3yse",
    customer: {
      email: "sa.shopper@example.com",
      name: "Omar Al Farsi",
      summary: {
        registration_date: "2023-05-01",
        first_transaction_date: "2023-07-01",
        last_payment_date: "2023-08-01",
        total_order_count: 15,
        last_payment_amount: 500,
        is_premium_customer: true,
        is_returning_customer: true,
        lifetime_value: 5000,
      },
    },
    billing: {
      address: {
        address_line1: "Olaya Street, Building 12",
        city: "Riyadh",
        zip: "11432",
        country: "SA",
      },
      phone: {
        number: "501234567",
        country_code: "+966",
      },
    },
    shipping: {
      address: {
        address_line1: "Ulaya Dist., P.O.Box: 5665",
        city: "Riyadh",
        zip: "11432",
        country: "SA",
      },
      phone: {
        number: "501234567",
        country_code: "+966",
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

  gb: {
    currency: "GBP",
    payment_type: "Regular",
    processing_channel_id: "pc_mfvsc6aeff4elmgartdk3ovn2i",
    customer: {
      email: "gb.shopper@example.com",
      name: "Jamie Cole",
    },
    billing: {
      address: {
        address_line1: "123 High Street",
        city: "London",
        zip: "SW1A 1AA",
        country: "GB",
      },
      phone: {
        number: "2079460958",
        country_code: "+44",
      },
    },
    shipping: {
      address: {
        address_line1: "123 High Street",
        city: "London",
        zip: "SW1A 1AA",
        country: "GB",
      },
      phone: {
        number: "2079460958",
        country_code: "+44",
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

  nl: {
    currency: "EUR",
    payment_type: "Regular",
    processing_channel_id: "pc_anuu7qlqknnujm3olh3ajsqs5q",
    customer: {
      email: "nl.shopper@example.com",
      name: "Sanne de Vries",
    },
    billing: {
      address: {
        address_line1: "Damrak 70",
        city: "Amsterdam",
        zip: "1012 LM",
        country: "NL",
      },
      phone: {
        number: "612345678",
        country_code: "+31",
      },
    },
    shipping: {
      address: {
        address_line1: "Damrak 70",
        city: "Amsterdam",
        zip: "1012 LM",
        country: "NL",
      },
      phone: {
        number: "612345678",
        country_code: "+31",
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

  de: {
    currency: "EUR",
    payment_type: "Regular",
    processing_channel_id: "pc_anuu7qlqknnujm3olh3ajsqs5q",
    customer: {
      email: "de.shopper@example.com",
      name: "Lena Müller",
    },
    billing: {
      address: {
        address_line1: "Friedrichstrasse 100",
        city: "Berlin",
        zip: "10117",
        country: "DE",
      },
      phone: {
        number: "3012345678",
        country_code: "+49",
      },
    },
    shipping: {
      address: {
        address_line1: "Friedrichstrasse 100",
        city: "Berlin",
        zip: "10117",
        country: "DE",
      },
      phone: {
        number: "3012345678",
        country_code: "+49",
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

  es: {
    currency: "EUR",
    payment_type: "Regular",
    processing_channel_id: "pc_anuu7qlqknnujm3olh3ajsqs5q",
    customer: {
      email: "es.shopper@example.com",
      name: "Lucia Garcia",
    },
    billing: {
      address: {
        address_line1: "Calle Gran Via 28",
        city: "Madrid",
        zip: "28013",
        country: "ES",
      },
      phone: {
        number: "612345678",
        country_code: "+34",
      },
    },
    shipping: {
      address: {
        address_line1: "Calle Gran Via 28",
        city: "Madrid",
        zip: "28013",
        country: "ES",
      },
      phone: {
        number: "612345678",
        country_code: "+34",
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

  pt: {
    currency: "EUR",
    payment_type: "Regular",
    processing_channel_id: "pc_anuu7qlqknnujm3olh3ajsqs5q",
    customer: {
      email: "pt.shopper@example.com",
      name: "Miguel Santos",
    },
    billing: {
      address: {
        address_line1: "Avenida da Liberdade 100",
        city: "Lisbon",
        zip: "1250-096",
        country: "PT",
      },
      phone: {
        number: "912345678",
        country_code: "+351",
      },
    },
    shipping: {
      address: {
        address_line1: "Avenida da Liberdade 100",
        city: "Lisbon",
        zip: "1250-096",
        country: "PT",
      },
      phone: {
        number: "912345678",
        country_code: "+351",
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

/**
 * Alternative processing channels a session can be created on, on top of the
 * country config. Used by the Remember Me demos: same US session, different
 * channel per presentation mode.
 */
const PROCESSING_CHANNEL_VARIANTS = {
  "rm-checkbox": "pc_g27bmypp5ryetnywyfdyzyczkm",
  "rm-embedded": "pc_nkzprmxd5r6uvhklbuq5xdnsh4",
};

function normalizeVariant(variant) {
  return String(variant || "")
    .trim()
    .toLowerCase();
}

function isVariantSupported(variant) {
  const key = normalizeVariant(variant);
  return key === "" || Boolean(PROCESSING_CHANNEL_VARIANTS[key]);
}

function getSupportedVariants() {
  return Object.keys(PROCESSING_CHANNEL_VARIANTS);
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

function getAppBaseUrl() {
  const fromEnv = process.env.APP_BASE_URL || process.env.PUBLIC_URL;
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }

  const port = process.env.PORT || 3000;
  return `http://localhost:${port}`;
}

/**
 * Build the Create Payment Session request body for a given country flag.
 * @param {string} countryCode - e.g. "us"
 * @param {string} [variant] - processing-channel variant, e.g. "rm-checkbox"
 * @returns {object}
 */
function buildPaymentSessionPayload(countryCode, variant) {
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

  const variantKey = normalizeVariant(variant);
  const variantChannel = PROCESSING_CHANNEL_VARIANTS[variantKey];

  if (variantKey && !variantChannel) {
    const error = new Error(
      `Unknown processing-channel variant "${variant}". ` +
        `Supported: ${getSupportedVariants().join(", ")}`,
    );
    error.statusCode = 400;
    throw error;
  }

  const baseUrl = getAppBaseUrl();

  return deepMerge(BASE_PAYMENT_SESSION, {
    ...overrides,
    // A variant swaps only the processing channel; the country config stands.
    ...(variantChannel ? { processing_channel_id: variantChannel } : {}),
    success_url: `${baseUrl}/?status=succeeded`,
    failure_url: `${baseUrl}/?status=failed`,
    metadata: {
      ...BASE_PAYMENT_SESSION.metadata,
      country: code.toUpperCase(),
      ...(variantKey ? { variant: variantKey } : {}),
    },
  });
}

module.exports = {
  BASE_AMOUNT,
  BASE_PAYMENT_SESSION,
  COUNTRY_SESSION_OVERRIDES,
  PROCESSING_CHANNEL_VARIANTS,
  buildPaymentSessionPayload,
  getSupportedCountryCodes,
  getSupportedVariants,
  isCountrySupported,
  isVariantSupported,
  normalizeCountryCode,
  normalizeVariant,
};
