/**
 * Owns Checkout.com Flow lifecycle: create session, init, mount, unmount, remount.
 */
window.FlowController = (() => {
  let publicKey = null;
  let paymentSession = null;
  let checkout = null;
  let flowComponent = null;
  let activeCountry = null;
  let refreshQueue = Promise.resolve();

  const flowContainer = () => document.getElementById("flow-container");

  function apiUrl(path) {
    const base = (window.RUNTIME_CONFIG?.API_BASE_URL || "").replace(/\/$/, "");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${base}${normalizedPath}`;
  }

  function setLoading(isLoading) {
    const panel = document.querySelector(".flow-panel");
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

  async function mountFlow(country, session) {
    const key = await loadPublicKey();
    const container = flowContainer();

    if (!container) {
      throw new Error("Missing #flow-container");
    }

    const { locale = "en-US", ...restFlowOptions } = country.flowOptions || {};

    checkout = await CheckoutWebComponents({
      publicKey: key,
      environment: "sandbox",
      locale,
      paymentSession: session,
      ...restFlowOptions,
      onReady: () => {
        console.log("Flow onReady", country.code);
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
      await mountFlow(country, paymentSession);
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
      await mountFlow(country, paymentSession);
      activeCountry = country;
    } finally {
      setLoading(false);
    }
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
  };
})();
