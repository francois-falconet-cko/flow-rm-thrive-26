/**
 * Owns Checkout.com Flow lifecycle: create session, init, mount, unmount, remount.
 */
window.FlowController = (() => {
  let publicKey = null;
  let paymentSession = null;
  let checkout = null;
  let flowComponent = null;
  let activeCountry = null;
  let lastMountOptions = null;
  let refreshQueue = Promise.resolve();

  const flowContainer = () => document.getElementById("flow-container");

  function apiUrl(path) {
    let base = window.RUNTIME_CONFIG?.API_BASE_URL || "";
    base = String(base).trim().replace(/^API_BASE_URL=/i, "").replace(/\/$/, "");

    if (base && !/^https?:\/\//i.test(base)) {
      console.error(
        "Invalid API_BASE_URL (must start with https://). Got:",
        base,
      );
      base = "";
    }

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${base}${normalizedPath}`;
  }

  function setLoading(isLoading) {
    const panel = document.getElementById("flowMount");
    if (!panel) return;
    panel.classList.toggle("is-loading", isLoading);
  }

  async function loadPublicKey() {
    if (publicKey) return publicKey;

    const response = await fetch(apiUrl("/config"));
    const payload = await response.json();

    if (!response.ok || !payload.publicKey) {
      throw new Error("Unable to load Checkout public key");
    }

    publicKey = payload.publicKey;
    return publicKey;
  }

  async function createPaymentSession(sessionKey) {
    const response = await fetch(apiUrl("/create-payment-sessions"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: sessionKey }),
    });

    const payload = await response.json();

    if (!response.ok) {
      const message =
        payload?.error ||
        payload?.message ||
        "Error creating payment session";
      throw new Error(message);
    }

    return payload;
  }

  function unmountFlow() {
    try {
      flowComponent?.unmount?.();
    } catch (error) {
      console.warn("Flow unmount warning:", error);
    }

    flowComponent = null;
    checkout = null;

    const container = flowContainer();
    if (container) container.innerHTML = "";
  }

  async function mountFlow(options, session) {
    const key = await loadPublicKey();
    const container = flowContainer();
    lastMountOptions = options;

    if (!container) {
      throw new Error("Missing #flow-container");
    }

    const {
      locale = "en-US",
      appearance,
      componentOptions,
      code = "flow",
      flowOptions = {},
    } = options || {};

    const {
      locale: _ignoredLocale,
      appearance: _ignoredAppearance,
      componentOptions: nestedComponentOptions,
      ...restFlowOptions
    } = flowOptions;

    checkout = await CheckoutWebComponents({
      publicKey: key,
      environment: "sandbox",
      locale: flowOptions.locale || locale,
      paymentSession: session,
      ...(appearance ? { appearance } : {}),
      ...(componentOptions || nestedComponentOptions
        ? { componentOptions: componentOptions || nestedComponentOptions }
        : {}),
      ...restFlowOptions,
      onReady: () => {
        console.log("Flow onReady", code);
      },
      onPaymentCompleted: (_component, paymentResponse) => {
        console.log("Create Payment with PaymentId: ", paymentResponse.id);
      },
      onChange: (component) => {
        console.log(
          `onChange() -> isValid: "${component.isValid()}" for "${component.type}"`,
        );
      },
      onError: (component, error) => {
        console.log("onError", error, "Component", component.type);
      },
    });

    flowComponent = checkout.create("flow");
    flowComponent.mount(container);
  }

  function countryMountOptions(country) {
    return {
      code: country?.code || "country",
      locale: country?.flowOptions?.locale || "en-US",
      flowOptions: country?.flowOptions || {},
    };
  }

  function brandMountOptions(brand) {
    return {
      code: brand?.id || "brand",
      locale: brand?.flowOptions?.locale || "en-US",
      appearance: brand?.appearance,
      componentOptions: brand?.flowOptions?.componentOptions,
      flowOptions: brand?.flowOptions || {},
    };
  }

  async function refreshWithNewSession(country) {
    if (!country.sessionKey) {
      throw new Error(
        `Country "${country.code}" has no sessionKey — add it in country-config.js and lib/country-sessions.js`,
      );
    }

    setLoading(true);
    try {
      unmountFlow();
      paymentSession = await createPaymentSession(country.sessionKey);
      await mountFlow(countryMountOptions(country), paymentSession);
      activeCountry = country;
    } finally {
      setLoading(false);
    }
  }

  async function remountFrontendOnly(country) {
    if (!paymentSession) {
      return refreshWithNewSession(country);
    }

    setLoading(true);
    try {
      unmountFlow();
      await mountFlow(countryMountOptions(country), paymentSession);
      activeCountry = country;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Remount Flow with the last used options — e.g. after the mount node moved
   * to another preview (desktop ↔ mobile). Keeps the same payment session.
   */
  function remountCurrent() {
    refreshQueue = refreshQueue
      .catch(() => {})
      .then(async () => {
        const country = activeCountry || window.CountryConfig.getDefault();

        if (!paymentSession || !lastMountOptions) {
          await refreshWithNewSession(country);
          return;
        }

        setLoading(true);
        try {
          unmountFlow();
          await mountFlow(lastMountOptions, paymentSession);
        } finally {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Flow remount failed:", error);
      });

    return refreshQueue;
  }

  /**
   * Remount Flow with a merchant brand appearance (same payment session).
   */
  function applyBrand(brand) {
    refreshQueue = refreshQueue
      .catch(() => {})
      .then(async () => {
        if (!brand) return;

        if (!paymentSession) {
          const fallbackCountry = window.CountryConfig.getDefault();
          await refreshWithNewSession(fallbackCountry);
        }

        setLoading(true);
        try {
          unmountFlow();
          await mountFlow(brandMountOptions(brand), paymentSession);
        } finally {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Brand Flow remount failed:", error);
      });

    return refreshQueue;
  }

  /**
   * Apply a country selection using the configured refresh strategy.
   */
  function selectCountry(country) {
    const mode = window.CountryConfig.getRefreshMode(activeCountry, country);

    refreshQueue = refreshQueue
      .catch(() => {})
      .then(async () => {
        if (mode === "session") {
          await refreshWithNewSession(country);
          return;
        }

        if (mode === "frontend") {
          await remountFrontendOnly(country);
          return;
        }

        activeCountry = country;
      })
      .catch((error) => {
        console.error("Flow refresh failed:", error);
      });

    return refreshQueue;
  }

  function getActiveCountry() {
    return activeCountry;
  }

  return {
    selectCountry,
    getActiveCountry,
    refreshWithNewSession,
    remountFrontendOnly,
    remountCurrent,
    applyBrand,
  };
})();
