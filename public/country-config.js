/**
 * Frontend country catalog for the flag grid + Flow refresh strategy.
 *
 * sessionKey  → when set, selecting this flag creates a new Payment Session
 *               using the matching key in lib/country-sessions.js
 * flowOptions → CheckoutWebComponents options applied on (re)mount
 *
 * Refresh rules (handled by FlowController):
 * - sessionKey changes      → new backend session + init + mount
 * - only flowOptions change → unmount + remount with same paymentSession
 * - neither changes         → UI label update only
 */
window.CountryConfig = (() => {
  /**
   * `short` is the 2-letter label shown on the picker button.
   * Order here is the order rendered in the grid.
   */
  const COUNTRIES = [
    {
      code: "us",
      short: "US",
      name: "United States",
      currency: "USD",
      sessionKey: "us",
      flowOptions: { locale: "en-US" },
    },
    {
      code: "gb",
      short: "UK",
      name: "United Kingdom",
      currency: "GBP",
      sessionKey: "gb",
      flowOptions: { locale: "en" },
    },
    {
      code: "fr",
      short: "FR",
      name: "France",
      currency: "EUR",
      sessionKey: null,
      flowOptions: { locale: "fr" },
    },
    {
      code: "nl",
      short: "NL",
      name: "Netherlands",
      currency: "EUR",
      sessionKey: "nl",
      flowOptions: { locale: "nl" },
    },
    {
      code: "de",
      short: "DE",
      name: "Germany",
      currency: "EUR",
      sessionKey: "de",
      flowOptions: { locale: "de" },
    },
    {
      code: "ae",
      short: "AE",
      name: "UAE",
      currency: "AED",
      sessionKey: "ae",
      flowOptions: { locale: "ar" },
    },
    {
      code: "sg",
      short: "SG",
      name: "Singapore",
      currency: "SGD",
      sessionKey: null,
      flowOptions: { locale: "en-SG" },
    },
    {
      code: "hk",
      short: "HK",
      name: "Hong Kong",
      currency: "HKD",
      sessionKey: null,
      flowOptions: { locale: "en-HK" },
    },
    {
      code: "es",
      short: "ES",
      name: "Spain",
      currency: "EUR",
      sessionKey: "es",
      flowOptions: { locale: "es" },
    },
    {
      code: "pt",
      short: "PT",
      name: "Portugal",
      currency: "EUR",
      sessionKey: "pt",
      flowOptions: { locale: "pt" },
    },
    {
      code: "jp",
      short: "JP",
      name: "Japan",
      currency: "JPY",
      sessionKey: null,
      flowOptions: { locale: "ja-JP" },
    },
    {
      code: "sa",
      short: "SA",
      name: "Saudi Arabia",
      currency: "SAR",
      sessionKey: "sa",
      flowOptions: { locale: "ar" },
    },
    {
      code: "bh",
      short: "BH",
      name: "Bahrain",
      currency: "BHD",
      sessionKey: null,
      flowOptions: { locale: "en-BH" },
    },
    {
      code: "qa",
      short: "QA",
      name: "Qatar",
      currency: "QAR",
      sessionKey: null,
      flowOptions: { locale: "en-QA" },
    },
    {
      code: "ca",
      short: "CA",
      name: "Canada",
      currency: "CAD",
      sessionKey: "ca",
      flowOptions: { locale: "en-CA" },
    },
    {
      code: "au",
      short: "AU",
      name: "Australia",
      currency: "AUD",
      sessionKey: null,
      flowOptions: { locale: "en-AU" },
    },
  ];

  const DEFAULT_COUNTRY_CODE = "us";

  function getAll() {
    return COUNTRIES.slice();
  }

  function getByCode(code) {
    return COUNTRIES.find((country) => country.code === code) || null;
  }

  function getDefault() {
    return getByCode(DEFAULT_COUNTRY_CODE) || COUNTRIES[0];
  }

  function flowOptionsFingerprint(flowOptions) {
    return JSON.stringify(flowOptions || {});
  }

  /**
   * Decide how Flow should refresh when moving from → to a country.
   * @returns {"session" | "frontend" | "ui"}
   */
  function getRefreshMode(fromCountry, toCountry) {
    if (!toCountry) return "ui";

    // Not wired yet — update labels only until sessionKey is set
    if (!toCountry.sessionKey) return "ui";

    // A different country *or* a different processing-channel variant (the
    // Remember Me demos) both need a brand new payment session.
    const sessionChanged =
      toCountry.sessionKey !== fromCountry?.sessionKey ||
      (toCountry.sessionVariant || null) !== (fromCountry?.sessionVariant || null);
    if (sessionChanged) return "session";

    const flowChanged =
      flowOptionsFingerprint(toCountry.flowOptions) !==
      flowOptionsFingerprint(fromCountry?.flowOptions);

    if (flowChanged) return "frontend";

    return "ui";
  }

  return {
    DEFAULT_COUNTRY_CODE,
    getAll,
    getByCode,
    getDefault,
    getRefreshMode,
  };
})();
