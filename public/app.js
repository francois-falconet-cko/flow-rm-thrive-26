/* global CountryConfig, FlowController, BrandConfig */

/**
 * Demo shell: accordion menu on the left (1/3), Flow preview on the right (2/3).
 * Previews: "desktop" (grey merchant page + order summary), "mobile" (phone
 * frame) and "flow" (Flow alone, narrow, no merchant chrome). Flow itself is
 * mounted once and moved between the preview slots — the SDK is remounted
 * after each move.
 *
 * `preview` per section: "toggle" follows the Desktop/Mobile buttons, any
 * other value pins that preview while the section is open.
 */

const SECTIONS = {
  boost: { preview: "toggle", summary: "order", merchant: "TravelMe.com" },
  global: { preview: "flow" },
  brand: { preview: "desktop", summary: "brand" },
  smarter: { preview: "desktop", summary: "order", merchant: "TravelMe.com" },
  compliance: { preview: "flow", country: "us" },
};

const PREVIEW_SLOTS = {
  desktop: "flowSlotDesktop",
  mobile: "flowSlotMobile",
  flow: "flowSlotBare",
};

const PREVIEW_MOCKS = {
  desktop: "mockWeb",
  mobile: "mockMobile",
  flow: "mockFlow",
};

// Static demo order used by both previews.
// amountMinor mirrors BASE_AMOUNT in lib/country-sessions.js so the mock
// totals match the amount Flow charges.
const DEMO_ORDER = {
  amountMinor: 6540,
  title: "Dubai Trip",
  route: "JFX > LAX",
  legs: [
    { route: "LHR > DXB", time: "20:35 GMT", flight: "BA0105" },
    { route: "DXB > LHR", time: "13:10 GMT", flight: "BA0108" },
  ],
};

let activeSection = "boost";
// What the Desktop/Mobile buttons are set to…
let previewChoice = "desktop";
// …and what is actually on screen (a section can pin its own preview).
let previewMode = "desktop";
let activeMerchantBrand = null;
let brandAppearanceApplied = false;

function triggerToast(id) {
  const element = document.getElementById(id);
  element.classList.add("show");

  setTimeout(function () {
    element.classList.remove("show");
  }, 5000);
}

/* ---------------- Amount formatting ---------------- */

function currencyFractionDigits(currency) {
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
    }).resolvedOptions().maximumFractionDigits;
  } catch (error) {
    return 2;
  }
}

/**
 * Format the demo order amount in the selected market's currency and locale.
 */
function formattedAmount() {
  const country = FlowController.getActiveCountry() || CountryConfig.getDefault();
  const currency = country.currency || "USD";
  const digits = currencyFractionDigits(currency);
  const value = DEMO_ORDER.amountMinor / Math.pow(10, digits);

  try {
    return new Intl.NumberFormat(
      country.flowOptions?.locale?.replace("_", "-") || "en-US",
      { style: "currency", currency },
    ).format(value);
  } catch (error) {
    return `${currency} ${value.toFixed(digits)}`;
  }
}

/* ---------------- Previews ---------------- */

function orderSummaryHtml(amount) {
  const legs = DEMO_ORDER.legs
    .map(
      (leg) => `
        <div class="summary-leg">
          <span>${leg.route}</span>
          <span>${leg.time}</span>
        </div>
        <div class="summary-leg"><span class="summary-leg-code">${leg.flight}</span></div>
      `,
    )
    .join("");

  return `
    <p class="summary-title">Summary</p>
    <div class="summary-item">
      <span>${DEMO_ORDER.title}</span>
      <span>${amount}</span>
    </div>
    ${legs}
    <div class="summary-rule"></div>
    <div class="summary-total">
      <span>Total amount</span>
      <span>${amount}</span>
    </div>
  `;
}

function setMerchantLabels(name) {
  const webMerchant = document.getElementById("webMerchant");
  const mark = document.getElementById("phoneMerchantMark");
  const tld = document.getElementById("phoneMerchantTld");

  if (webMerchant) webMerchant.textContent = name;

  // "TravelMe.com" → blue "TravelMe" + dark ".com"
  const dotIndex = name.lastIndexOf(".");
  if (mark) mark.textContent = dotIndex > 0 ? name.slice(0, dotIndex) : name;
  if (tld) tld.textContent = dotIndex > 0 ? name.slice(dotIndex) : "";
}

function renderPreviewContent() {
  const section = SECTIONS[activeSection] || SECTIONS.boost;
  const amount = formattedAmount();
  const isBrand = section.summary === "brand";
  const brand = activeMerchantBrand || BrandConfig.getDefault();
  const merchantName = isBrand
    ? brand.name
    : section.merchant || "TravelMe.com";

  setMerchantLabels(merchantName);

  const webAmount = document.getElementById("webAmount");
  if (webAmount) webAmount.textContent = amount;

  const phoneAmount = document.getElementById("phoneAmount");
  if (phoneAmount) phoneAmount.textContent = amount;

  const phoneRoute = document.getElementById("phoneRoute");
  if (phoneRoute) phoneRoute.textContent = DEMO_ORDER.route;

  const summary = document.getElementById("webSummary");
  if (!summary) return;

  if (isBrand) {
    summary.innerHTML = BrandConfig.renderSummary(brand);
    summary.dataset.brandId = brand.id;
    summary.style.setProperty("--summary-accent", brand.accent);

    summary.querySelectorAll("[data-walle-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        summary.querySelectorAll("[data-walle-mode]").forEach((item) => {
          item.classList.toggle("is-active", item === btn);
        });
      });
    });
    return;
  }

  delete summary.dataset.brandId;
  summary.style.removeProperty("--summary-accent");
  summary.innerHTML = orderSummaryHtml(amount);
}

/**
 * Zoom the visible preview out so it fits the viewport when it can.
 * Never clips: if the preview is still taller than the window (Flow grows as
 * the shopper opens payment methods), the page scrolls as usual.
 */
const MIN_PREVIEW_SCALE = 0.7;

function fitPreview() {
  const stage = document.getElementById("stage");
  const mock = document.getElementById(PREVIEW_MOCKS[previewMode]);
  if (!stage || !mock) return;

  // Below the desktop breakpoint the page stacks and scrolls normally.
  if (window.matchMedia("(max-width: 1024px)").matches) {
    stage.style.removeProperty("--mock-scale");
    return;
  }

  const rect = mock.getBoundingClientRect();
  if (rect.height <= 0) return;

  // getBoundingClientRect() is already zoomed, so divide it back out to get
  // the unzoomed height — that keeps this calculation stable across re-runs.
  const currentScale =
    parseFloat(stage.style.getPropertyValue("--mock-scale")) || 1;
  const natural = rect.height / currentScale;

  const reserved = parseFloat(getComputedStyle(stage).paddingBottom) || 0;
  const available =
    window.innerHeight - (rect.top + window.scrollY) - reserved;
  if (available <= 0) return;

  const scale = Math.min(1, Math.max(MIN_PREVIEW_SCALE, available / natural));

  // Only write when it actually moves, so the ResizeObserver settles.
  if (Math.abs(scale - currentScale) > 0.01) {
    stage.style.setProperty("--mock-scale", scale.toFixed(3));
  }
}

function initPreviewFit() {
  const schedule = () => window.requestAnimationFrame(fitPreview);

  if (typeof ResizeObserver === "function") {
    const observer = new ResizeObserver(schedule);
    Object.values(PREVIEW_MOCKS).forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
  }

  window.addEventListener("resize", schedule);
}

/** Move the Flow mount node into the visible preview. */
function moveFlowMount() {
  const mount = document.getElementById("flowMount");
  const slot = document.getElementById(PREVIEW_SLOTS[previewMode]);
  if (!mount || !slot || mount.parentElement === slot) return false;

  slot.appendChild(mount);
  return true;
}

function updatePreviewButtons() {
  document.querySelectorAll(".preview-btn[data-preview]").forEach((btn) => {
    const active = btn.dataset.preview === previewChoice;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", String(active));
  });
}

/** The preview the active section wants: its own, or the toggle's choice. */
function sectionPreview(sectionKey) {
  const preview = SECTIONS[sectionKey]?.preview || "desktop";
  return preview === "toggle" ? previewChoice : preview;
}

function applyPreview(mode, { force = false } = {}) {
  if (!PREVIEW_SLOTS[mode]) return;
  if (mode === previewMode && !force) return;

  previewMode = mode;

  const stage = document.getElementById("stage");
  if (stage) stage.dataset.preview = previewMode;

  updatePreviewButtons();
  fitPreview();

  // Flow's iframes do not survive a DOM move, so remount after relocating.
  if (moveFlowMount()) {
    FlowController.remountCurrent();
  }
}

/** Desktop/Mobile buttons — only the sections using "toggle" follow them. */
function setPreviewChoice(mode) {
  if (mode !== "desktop" && mode !== "mobile") return;

  previewChoice = mode;
  updatePreviewButtons();
  applyPreview(sectionPreview(activeSection));
}

function initPreviewToggle() {
  document.querySelectorAll(".preview-btn[data-preview]").forEach((btn) => {
    btn.addEventListener("click", () => setPreviewChoice(btn.dataset.preview));
  });
}

/* ---------------- Accordion ---------------- */

function setSection(sectionKey, { initial = false } = {}) {
  if (!SECTIONS[sectionKey]) return;

  activeSection = sectionKey;

  const stage = document.getElementById("stage");
  if (stage) stage.dataset.section = sectionKey;

  document.querySelectorAll(".acc[data-section]").forEach((acc) => {
    const open = acc.dataset.section === sectionKey;
    acc.classList.toggle("is-open", open);
    acc
      .querySelector("[data-acc-toggle]")
      ?.setAttribute("aria-expanded", String(open));
  });

  const isBrand = SECTIONS[sectionKey].summary === "brand";

  // Move Flow into this section's preview before any appearance work below,
  // so the remount lands in the slot that is on screen.
  applyPreview(sectionPreview(sectionKey), { force: initial });

  if (!initial) {
    if (isBrand) {
      // Brand demos always start from the US payment-session baseline,
      // then remount Flow with the selected brand appearance.
      const brand = activeMerchantBrand || BrandConfig.getDefault();
      selectCountry(CountryConfig.getDefault());
      selectMerchantBrand(brand);
    } else if (brandAppearanceApplied) {
      // Drop the brand appearance when leaving the brand demo.
      brandAppearanceApplied = false;
      FlowController.remountFrontendOnly(
        FlowController.getActiveCountry() || CountryConfig.getDefault(),
      );
    }

    // Sections can pin the market they demo with (e.g. compliance → US).
    const pinned = SECTIONS[sectionKey].country;
    if (pinned && !isBrand) {
      selectCountry(CountryConfig.getByCode(pinned) || CountryConfig.getDefault());
    }
  }

  renderPreviewContent();
}

function initAccordion() {
  document.querySelectorAll(".acc[data-section]").forEach((acc) => {
    const head = acc.querySelector("[data-acc-toggle]");
    head?.addEventListener("click", () => {
      // One section open at a time; clicking the open one keeps it open.
      setSection(acc.dataset.section);

      const sidebar = document.getElementById("sidebar");
      const toggle = document.getElementById("sidebarToggle");
      if (window.matchMedia("(max-width: 1024px)").matches) {
        sidebar?.classList.remove("is-open");
        toggle?.setAttribute("aria-expanded", "false");
      }
    });
  });
}

function initSidebar() {
  const sidebar = document.getElementById("sidebar");
  const toggle = document.getElementById("sidebarToggle");
  if (!sidebar || !toggle) return;

  toggle.addEventListener("click", () => {
    const open = sidebar.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

/* ---------------- Countries ---------------- */

function updateCountryUi(country) {
  document.querySelectorAll(".country-btn").forEach((btn) => {
    const selected = btn.dataset.code === country.code;
    btn.classList.toggle("is-selected", selected);
    btn.setAttribute("aria-selected", String(selected));
  });

  const simCountry = document.getElementById("simCountry");
  const simCurrency = document.getElementById("simCurrency");
  if (simCountry) simCountry.textContent = country.name;
  if (simCurrency) simCurrency.textContent = country.currency;
}

async function selectCountry(country) {
  updateCountryUi(country);
  await FlowController.selectCountry(country);
  renderPreviewContent();
}

function initCountries() {
  const grid = document.getElementById("countryGrid");
  if (!grid) return;

  const countries = CountryConfig.getAll();
  const defaultCountry = CountryConfig.getDefault();

  countries.forEach((country) => {
    const button = document.createElement("button");
    const isDefault = country.code === defaultCountry.code;
    button.type = "button";
    button.className = "country-btn" + (isDefault ? " is-selected" : "");
    button.dataset.code = country.code;
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", isDefault ? "true" : "false");

    if (country.sessionKey) {
      button.title = country.name;
    } else {
      button.title = `${country.name} — session config coming soon`;
      button.classList.add("is-pending");
    }

    const flag = document.createElement("img");
    flag.className = "country-flag";
    flag.src = `https://flagcdn.com/w40/${country.code}.png`;
    flag.srcset = `https://flagcdn.com/w80/${country.code}.png 2x`;
    flag.alt = "";
    flag.width = 22;
    flag.height = 16;
    flag.loading = "lazy";

    const label = document.createElement("span");
    label.textContent = country.short || country.code.toUpperCase();
    button.setAttribute("aria-label", country.name);

    button.append(flag, label);
    button.addEventListener("click", () => {
      selectCountry(country);
    });
    grid.appendChild(button);
  });
}

/* ---------------- Merchant brands ---------------- */

function iconStyle(icon) {
  const border = icon.border ? `border:1.5px solid ${icon.border};` : "";
  return `background:${icon.bg};color:${icon.color};${border}`;
}

function selectMerchantBrand(brand) {
  if (!brand) return;

  activeMerchantBrand = brand;
  brandAppearanceApplied = true;

  document.querySelectorAll(".merchant-brand-btn").forEach((btn) => {
    const selected = btn.dataset.brandId === brand.id;
    btn.classList.toggle("is-selected", selected);
    btn.setAttribute("aria-selected", String(selected));
  });

  const simBrand = document.getElementById("simBrand");
  if (simBrand) simBrand.textContent = brand.name;

  renderPreviewContent();

  // Remount Flow with this brand's appearance (same payment session)
  FlowController.applyBrand(brand);
}

function initMerchantBrands() {
  const grid = document.getElementById("merchantBrandGrid");
  if (!grid) return;

  const brands = BrandConfig.getAll();
  const defaultBrand = BrandConfig.getDefault();

  brands.forEach((brand) => {
    const button = document.createElement("button");
    const isDefault = brand.id === defaultBrand.id;
    button.type = "button";
    button.className = "merchant-brand-btn" + (isDefault ? " is-selected" : "");
    button.dataset.brandId = brand.id;
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", isDefault ? "true" : "false");

    const icon = document.createElement("span");
    icon.className = "merchant-brand-icon";
    icon.style.cssText = iconStyle(brand.icon);
    icon.textContent = brand.icon.letter;
    icon.setAttribute("aria-hidden", "true");

    const wordmark = brand.wordmark || { text: brand.name };
    const label = document.createElement("span");
    label.className =
      "merchant-brand-word" +
      (wordmark.spaced ? " is-spaced" : "") +
      (wordmark.small ? " is-small" : "");
    if (wordmark.font) label.style.fontFamily = wordmark.font;
    if (wordmark.color) label.style.color = wordmark.color;
    label.textContent = wordmark.text;

    if (wordmark.suffix) {
      const suffix = document.createElement("span");
      suffix.className = "merchant-brand-word-suffix";
      suffix.textContent = wordmark.suffix;
      label.appendChild(suffix);
    }

    button.title = brand.name;
    button.append(icon, label);
    button.addEventListener("click", () => selectMerchantBrand(brand));
    grid.appendChild(button);
  });

  activeMerchantBrand = defaultBrand;
}

/* ---------------- Boot ---------------- */

async function boot() {
  initSidebar();
  initAccordion();
  initPreviewToggle();
  initPreviewFit();
  initCountries();
  initMerchantBrands();

  // Boost Performance + Desktop + United States is the default demo state.
  // ?section= and ?preview= let a stage demo open on a given slide.
  const params = new URLSearchParams(window.location.search);
  const startSection = SECTIONS[params.get("section")]
    ? params.get("section")
    : "boost";
  previewChoice = params.get("preview") === "mobile" ? "mobile" : "desktop";
  previewMode = sectionPreview(startSection);

  // Park the Flow mount in the active slot before the first mount so the
  // preview switch never triggers a duplicate payment session on load.
  moveFlowMount();
  const stage = document.getElementById("stage");
  if (stage) stage.dataset.preview = previewMode;
  updatePreviewButtons();

  // Create the US session first: the section handlers below decide how to
  // refresh Flow from the country that is already active.
  const defaultCountry = CountryConfig.getDefault();
  updateCountryUi(defaultCountry);
  await FlowController.selectCountry(defaultCountry);

  // The brand slide needs its appearance applied, so it boots non-initial.
  setSection(startSection, { initial: startSection !== "brand" });
  renderPreviewContent();
  fitPreview();
}

boot();

const urlParams = new URLSearchParams(window.location.search);
const paymentStatus = urlParams.get("status");
const paymentId = urlParams.get("cko-payment-id");

if (paymentStatus === "succeeded") {
  triggerToast("successToast");
}

if (paymentStatus === "failed") {
  triggerToast("failedToast");
}

if (paymentId) {
  console.log("Create Payment with PaymentId: ", paymentId);
}
