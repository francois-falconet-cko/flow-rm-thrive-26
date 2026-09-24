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
  // Every component currently mounted: the single `flow` accordion in the
  // default layout, or one entry per payment method in the custom layout.
  let mountedComponents = [];
  let slotsRenderedHook = null;

  const flowContainer = () => document.getElementById("flow-container");
  const customContainer = () => document.getElementById("flow-custom");

  /**
   * Payment methods that can be created and mounted as their own component,
   * each into its own div. Anything else only exists inside the accordion.
   */
  const STANDALONE_COMPONENTS = {
    card: { label: "Card", divId: "div-card" },
    googlepay: { label: "Google Pay", divId: "div-googlepay" },
    applepay: { label: "Apple Pay", divId: "div-applepay" },
    paypal: { label: "PayPal", divId: "div-paypal" },
  };

  // Whether Flow is currently rendered. Flips to true on the SDK's onReady and
  // back to false on unmount, so callers can show UI only alongside Flow.
  let flowMounted = false;
  const mountListeners = new Set();

  function setFlowMounted(value) {
    if (flowMounted === value) return;
    flowMounted = value;
    mountListeners.forEach((listener) => listener(flowMounted));
  }

  /**
   * Subscribe to Flow appearing/disappearing. Fires immediately with the
   * current state so callers do not need a separate initial read.
   */
  function onMountedChange(listener) {
    mountListeners.add(listener);
    listener(flowMounted);
    return () => mountListeners.delete(listener);
  }

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

  /**
   * @param {string} sessionKey - country key, e.g. "us"
   * @param {string} [variant] - processing-channel variant, e.g. "rm-checkbox"
   * @param {string} [journey] - shopper journey, "new" or "returning"
   */
  async function createPaymentSession(sessionKey, variant, journey) {
    const requestBody = {
      country: sessionKey,
      ...(variant ? { variant } : {}),
      ...(journey ? { journey } : {}),
    };

    console.log("Create payment session", requestBody);

    const response = await fetch(apiUrl("/create-payment-sessions"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
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
    mountedComponents.forEach((component) => {
      try {
        component?.unmount?.();
      } catch (error) {
        console.warn("Flow unmount warning:", error);
      }
    });

    mountedComponents = [];
    flowComponent = null;
    checkout = null;
    setFlowMounted(false);

    const container = flowContainer();
    if (container) container.innerHTML = "";

    const custom = customContainer();
    if (custom) custom.innerHTML = "";
  }

  /** One bordered, labelled div per component — the point of the demo. */
  function buildSlot(name, meta) {
    const slot = document.createElement("div");
    slot.className = "flow-slot-card";
    slot.dataset.component = name;

    const head = document.createElement("div");
    head.className = "flow-slot-head";

    const grip = document.createElement("span");
    grip.className = "flow-slot-grip";
    grip.setAttribute("aria-hidden", "true");
    grip.textContent = "⠿";

    const label = document.createElement("span");
    label.className = "flow-slot-name";
    label.textContent = meta.label;

    const divId = document.createElement("code");
    divId.className = "flow-slot-id";
    divId.textContent = `#${meta.divId}`;

    head.append(grip, label, divId);

    const body = document.createElement("div");
    body.className = "flow-slot-body";
    body.id = meta.divId;

    slot.append(head, body);
    return slot;
  }

  function markSlotUnavailable(slot, message) {
    slot.classList.add("is-unavailable");
    const body = slot.querySelector(".flow-slot-body");
    if (body) body.textContent = message;
  }

  /**
   * Create each payment method as its own component and mount it into its own
   * div, in the given order. Components the browser or session cannot offer
   * (Apple Pay off Safari, for instance) keep their div but say so.
   */
  async function mountCustomComponents(names) {
    const host = customContainer();
    if (!host) {
      throw new Error("Missing #flow-custom");
    }

    host.innerHTML = "";

    for (const name of names) {
      const meta = STANDALONE_COMPONENTS[name];
      if (!meta) continue;

      const slot = buildSlot(name, meta);
      host.appendChild(slot);
      const body = slot.querySelector(".flow-slot-body");

      try {
        const component = checkout.create(name);

        const available =
          typeof component.isAvailable === "function"
            ? await component.isAvailable()
            : true;

        if (!available) {
          markSlotUnavailable(slot, "Not available in this browser or session");
          continue;
        }

        await component.mount(body);
        mountedComponents.push(component);
      } catch (error) {
        console.warn(`Could not mount "${name}" component:`, error);
        markSlotUnavailable(slot, "Could not be mounted");
      }
    }

    slotsRenderedHook?.(host);
  }

  /** Show the container the active layout mounts into, hide the other. */
  function applyLayoutVisibility(isCustom) {
    const container = flowContainer();
    const custom = customContainer();
    if (container) container.hidden = isCustom;
    if (custom) custom.hidden = !isCustom;
  }

  async function mountFlow(options, session) {
    const key = await loadPublicKey();
    lastMountOptions = options;

    const {
      locale = "en-US",
      appearance,
      componentOptions,
      code = "flow",
      flowOptions = {},
      layout,
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
        setFlowMounted(true);
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

    const isCustom = layout?.mode === "custom";
    applyLayoutVisibility(isCustom);

    if (isCustom) {
      await mountCustomComponents(layout.components || []);
      return;
    }

    const container = flowContainer();
    if (!container) {
      throw new Error("Missing #flow-container");
    }

    flowComponent = checkout.create("flow");
    flowComponent.mount(container);
    mountedComponents = [flowComponent];
  }

  function countryMountOptions(country) {
    return {
      code: country?.code || "country",
      locale: country?.flowOptions?.locale || "en-US",
      flowOptions: country?.flowOptions || {},
    };
  }

  /**
   * Merge the brand's own componentOptions with the live customization
   * controls. Overrides win per option, and `card` is merged key by key so a
   * brand's `displayCardholderName` is only replaced if the control sets one.
   */
  function mergeComponentOptions(base, extra) {
    if (!base && !extra) return undefined;

    const merged = { ...(base || {}) };

    Object.entries(extra || {}).forEach(([key, value]) => {
      merged[key] =
        value && typeof value === "object" && !Array.isArray(value)
          ? { ...(merged[key] || {}), ...value }
          : value;
    });

    return merged;
  }

  function brandMountOptions(brand, overrides) {
    return {
      code: brand?.id || "brand",
      locale: brand?.flowOptions?.locale || "en-US",
      appearance: brand?.appearance,
      componentOptions: mergeComponentOptions(
        brand?.flowOptions?.componentOptions,
        overrides?.componentOptions,
      ),
      flowOptions: brand?.flowOptions || {},
      layout: overrides?.layout,
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
      paymentSession = await createPaymentSession(
        country.sessionKey,
        country.sessionVariant,
        country.sessionJourney,
      );
      // Publish the active country before mounting: anything queued behind us
      // reads it to decide what to remount, and must not see the old one.
      activeCountry = country;
      await mountFlow(countryMountOptions(country), paymentSession);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Queued entry point for creating a session outside the country picker —
   * e.g. the Remember Me modes, which reuse the US session on another
   * processing channel. Serialising through refreshQueue keeps it from
   * interleaving with preview remounts.
   */
  function applySession(country) {
    refreshQueue = refreshQueue
      .catch(() => {})
      .then(() => refreshWithNewSession(country))
      .catch((error) => {
        console.error("Flow session refresh failed:", error);
      });

    return refreshQueue;
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
  function applyBrand(brand, overrides) {
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
          await mountFlow(brandMountOptions(brand, overrides), paymentSession);
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

  /**
   * Called with the custom-layout host every time its slots are rebuilt, so
   * the drag & drop handlers can be re-attached to the fresh nodes.
   */
  function onCustomSlotsRendered(fn) {
    slotsRenderedHook = fn;
  }

  return {
    selectCountry,
    getActiveCountry,
    onMountedChange,
    onCustomSlotsRendered,
    // refreshWithNewSession stays private: it does not queue, so callers must
    // go through applySession() to avoid interleaving with preview remounts.
    applySession,
    remountFrontendOnly,
    remountCurrent,
    applyBrand,
  };
})();
