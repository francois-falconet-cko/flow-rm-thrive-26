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
  const COUNTRIES = [
    {
      code: "us",
      name: "United States",
      currency: "USD",
      sessionKey: "us",
      flowOptions: { locale: "en-US" },
    },
    {
      code: "ca",
      name: "Canada",
      currency: "CAD",
      sessionKey: "ca",
      flowOptions: { locale: "en-CA" },
    },
    {
      code: "br",
      name: "Brazil",
      currency: "BRL",
      sessionKey: "br",
      flowOptions: { locale: "pt-PT" },
    },
    {
      code: "ae",
      name: "UAE",
      currency: "AED",
      sessionKey: "ae",
      flowOptions: { locale: "ar" },
    },
    {
      code: "sa",
      name: "Saudi Arabia",
      currency: "SAR",
      sessionKey: null,
      flowOptions: { locale: "en-SA" },
    },
    {
      code: "gb",
      name: "United Kingdom",
      currency: "GBP",
      sessionKey: null,
      flowOptions: { locale: "en-GB" },
    },
    {
      code: "nl",
      name: "Netherlands",
      currency: "EUR",
      sessionKey: null,
      flowOptions: { locale: "nl-NL" },
    },
    {
      code: "de",
      name: "Germany",
      currency: "EUR",
      sessionKey: null,
      flowOptions: { locale: "de-DE" },
    },
    {
      code: "sg",
      name: "Singapore",
      currency: "SGD",
      sessionKey: null,
      flowOptions: { locale: "en-SG" },
    },
    {
      code: "es",
      name: "Spain",
      currency: "EUR",
      sessionKey: null,
      flowOptions: { locale: "es-ES" },
    },
    {
      code: "jp",
      name: "Japan",
      currency: "JPY",
      sessionKey: null,
      flowOptions: { locale: "ja-JP" },
    },
    {
      code: "bh",
      name: "Bahrain",
      currency: "BHD",
      sessionKey: null,
      flowOptions: { locale: "en-BH" },
    },
    {
      code: "hk",
      name: "Hong Kong",
      currency: "HKD",
      sessionKey: null,
      flowOptions: { locale: "en-HK" },
    },
    {
      code: "pt",
      name: "Portugal",
      currency: "EUR",
      sessionKey: null,
      flowOptions: { locale: "pt-PT" },
    },
    {
      code: "qa",
      name: "Qatar",
      currency: "QAR",
      sessionKey: null,
      flowOptions: { locale: "en-QA" },
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

    const sessionChanged = toCountry.sessionKey !== fromCountry?.sessionKey;
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
