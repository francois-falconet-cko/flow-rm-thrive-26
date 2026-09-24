/* global I18n */

/**
 * Live Flow customization controls for the "Brand it your way" slide.
 *
 * Everything here maps onto real CheckoutWebComponents options, so the demo
 * shows exactly what a merchant would write:
 *
 *   componentOptions: {
 *     flow: { paymentMethodOrder: ["googlepay", "card", "paypal", "klarna"] },
 *     card: { displayCardholderName: "top", showPayButton: true },
 *   }
 *
 * The mount layout is the one thing that is not an option object: "default"
 * mounts the single `flow` accordion, "custom" creates each payment method
 * component separately and mounts it into its own div.
 */
window.BrandCustomize = (() => {
  /**
   * The methods the picker can order. `paymentMethodOrder` ignores anything
   * the payment session does not return, so listing extras is harmless.
   * `standalone` marks the ones that can also be mounted on their own.
   */
  const PAYMENT_METHODS = [
    { id: "card", label: "Card", standalone: true },
    { id: "googlepay", label: "Google Pay", standalone: true },
    { id: "applepay", label: "Apple Pay", standalone: true },
    { id: "paypal", label: "PayPal", standalone: true },
    { id: "klarna", label: "Klarna", standalone: false },
  ];

  const DEFAULTS = {
    order: PAYMENT_METHODS.map((method) => method.id),
    cardholderName: "top",
    showPayButton: true,
    layout: "default",
  };

  const state = {
    order: DEFAULTS.order.slice(),
    cardholderName: DEFAULTS.cardholderName,
    showPayButton: DEFAULTS.showPayButton,
    layout: DEFAULTS.layout,
  };

  const listeners = [];
  let dragId = null;

  function getMethod(id) {
    return PAYMENT_METHODS.find((method) => method.id === id) || null;
  }

  function methodLabel(id) {
    const method = getMethod(id);
    return method ? method.label : id;
  }

  /* ---------------- Public state ---------------- */

  /**
   * The CheckoutWebComponents options these controls produce, plus the mount
   * layout FlowController needs. Merged over the brand's own flowOptions.
   */
  function getOverrides() {
    return {
      componentOptions: {
        flow: {
          paymentMethodOrder: state.order.slice(),
        },
        card: {
          displayCardholderName: state.cardholderName,
          showPayButton: state.showPayButton,
        },
      },
      layout: {
        mode: state.layout,
        // Only the components that can be mounted on their own, in the order
        // the picker is showing.
        components: state.order.filter((id) => getMethod(id)?.standalone),
      },
    };
  }

  function getState() {
    return { ...state, order: state.order.slice() };
  }

  function onChange(fn) {
    listeners.push(fn);
  }

  function emit() {
    render();
    listeners.forEach((fn) => fn(getOverrides()));
  }

  /* ---------------- Mutations ---------------- */

  function moveMethod(id, delta) {
    const from = state.order.indexOf(id);
    const to = from + delta;
    if (from < 0 || to < 0 || to >= state.order.length) return;

    state.order.splice(from, 1);
    state.order.splice(to, 0, id);
    emit();
  }

  /** Drop `id` onto `targetId`'s position (drag & drop, either direction). */
  function reorderTo(id, targetId) {
    if (!id || !targetId || id === targetId) return;

    const from = state.order.indexOf(id);
    const to = state.order.indexOf(targetId);
    if (from < 0 || to < 0) return;

    state.order.splice(from, 1);
    state.order.splice(to, 0, id);
    emit();
  }

  function setCardholderName(position) {
    if (!["top", "bottom", "hidden"].includes(position)) return;
    state.cardholderName = position;
    emit();
  }

  function setShowPayButton(show) {
    state.showPayButton = Boolean(show);
    emit();
  }

  function setLayout(mode) {
    if (mode !== "default" && mode !== "custom") return;
    state.layout = mode;
    emit();
  }

  function reset() {
    state.order = DEFAULTS.order.slice();
    state.cardholderName = DEFAULTS.cardholderName;
    state.showPayButton = DEFAULTS.showPayButton;
    state.layout = DEFAULTS.layout;
    emit();
  }

  /* ---------------- Rendering ---------------- */

  function t(key, fallback) {
    return window.I18n ? I18n.t(key, fallback) : fallback;
  }

  function buildMethodRow(id, index) {
    const method = getMethod(id);
    const row = document.createElement("li");
    row.className = "pm-row";
    row.dataset.method = id;
    row.draggable = true;

    const grip = document.createElement("span");
    grip.className = "pm-grip";
    grip.setAttribute("aria-hidden", "true");
    grip.textContent = "⠿";

    const position = document.createElement("span");
    position.className = "pm-index";
    position.textContent = String(index + 1);

    const label = document.createElement("span");
    label.className = "pm-label";
    label.textContent = method ? method.label : id;

    const code = document.createElement("code");
    code.className = "pm-code";
    code.textContent = id;

    const controls = document.createElement("span");
    controls.className = "pm-arrows";

    const up = document.createElement("button");
    up.type = "button";
    up.className = "pm-arrow";
    up.textContent = "↑";
    up.disabled = index === 0;
    up.setAttribute("aria-label", `Move ${methodLabel(id)} up`);
    up.addEventListener("click", () => moveMethod(id, -1));

    const down = document.createElement("button");
    down.type = "button";
    down.className = "pm-arrow";
    down.textContent = "↓";
    down.disabled = index === state.order.length - 1;
    down.setAttribute("aria-label", `Move ${methodLabel(id)} down`);
    down.addEventListener("click", () => moveMethod(id, 1));

    controls.append(up, down);

    // Drag & drop — the arrows above are the keyboard/fallback path.
    row.addEventListener("dragstart", (event) => {
      dragId = id;
      row.classList.add("is-dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", id);
    });

    row.addEventListener("dragend", () => {
      dragId = null;
      row.classList.remove("is-dragging");
      document
        .querySelectorAll(".pm-row.is-drop-target")
        .forEach((el) => el.classList.remove("is-drop-target"));
    });

    row.addEventListener("dragover", (event) => {
      if (!dragId || dragId === id) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      row.classList.add("is-drop-target");
    });

    row.addEventListener("dragleave", () => {
      row.classList.remove("is-drop-target");
    });

    row.addEventListener("drop", (event) => {
      event.preventDefault();
      row.classList.remove("is-drop-target");
      reorderTo(dragId || event.dataTransfer.getData("text/plain"), id);
    });

    row.append(grip, position, label, code, controls);
    return row;
  }

  function renderMethodList() {
    const list = document.getElementById("pmOrderList");
    if (!list) return;

    list.innerHTML = "";
    state.order.forEach((id, index) => {
      list.appendChild(buildMethodRow(id, index));
    });
  }

  /** The snippet under the controls — the code the merchant would ship. */
  function renderSnippet() {
    const snippet = document.getElementById("customizeSnippet");
    if (!snippet) return;

    const order = state.order.map((id) => `"${id}"`).join(", ");
    const lines = [
      "componentOptions: {",
      `  flow: { paymentMethodOrder: [${order}] },`,
      "  card: {",
      `    displayCardholderName: "${state.cardholderName}",`,
      `    showPayButton: ${state.showPayButton},`,
      "  },",
      "}",
    ];

    snippet.textContent = lines.join("\n");
  }

  function renderToggles() {
    document.querySelectorAll("[data-cardholder]").forEach((btn) => {
      const active = btn.dataset.cardholder === state.cardholderName;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    document.querySelectorAll("[data-paybutton]").forEach((btn) => {
      const active = (btn.dataset.paybutton === "true") === state.showPayButton;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    document.querySelectorAll("[data-layout]").forEach((btn) => {
      const active = btn.dataset.layout === state.layout;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    const note = document.getElementById("layoutNote");
    if (note) note.hidden = state.layout !== "custom";
  }

  function render() {
    renderMethodList();
    renderToggles();
    renderSnippet();
  }

  /* ---------------- Stage slots (custom layout) ---------------- */

  /**
   * Make the per-component divs in the preview draggable too, so the order
   * can be changed from either side. Called by FlowController every time the
   * slots are rebuilt (each remount), hence the re-wiring each pass.
   */
  function wireStageSlots(host) {
    if (!host) return;

    host.querySelectorAll("[data-component]").forEach((slot) => {
      const id = slot.dataset.component;
      const head = slot.querySelector(".flow-slot-head");
      if (!head) return;

      head.draggable = true;

      head.addEventListener("dragstart", (event) => {
        dragId = id;
        slot.classList.add("is-dragging");
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", id);
      });

      head.addEventListener("dragend", () => {
        dragId = null;
        slot.classList.remove("is-dragging");
      });

      slot.addEventListener("dragover", (event) => {
        if (!dragId || dragId === id) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        slot.classList.add("is-drop-target");
      });

      slot.addEventListener("dragleave", () => {
        slot.classList.remove("is-drop-target");
      });

      slot.addEventListener("drop", (event) => {
        event.preventDefault();
        slot.classList.remove("is-drop-target");
        reorderTo(dragId || event.dataTransfer.getData("text/plain"), id);
      });
    });
  }

  /* ---------------- Init ---------------- */

  function init() {
    document.querySelectorAll("[data-cardholder]").forEach((btn) => {
      btn.addEventListener("click", () => setCardholderName(btn.dataset.cardholder));
    });

    document.querySelectorAll("[data-paybutton]").forEach((btn) => {
      btn.addEventListener("click", () =>
        setShowPayButton(btn.dataset.paybutton === "true"),
      );
    });

    document.querySelectorAll("[data-layout]").forEach((btn) => {
      btn.addEventListener("click", () => setLayout(btn.dataset.layout));
    });

    document
      .getElementById("customizeReset")
      ?.addEventListener("click", () => reset());

    // Method labels are product names, so only the surrounding copy is
    // translated — but the list still needs a repaint to pick up aria labels.
    window.I18n?.onChange(() => render());

    render();
  }

  return {
    PAYMENT_METHODS,
    init,
    render,
    getOverrides,
    getState,
    onChange,
    wireStageSlots,
    methodLabel,
  };
})();
