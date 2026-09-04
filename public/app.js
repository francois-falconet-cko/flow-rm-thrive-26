/* global CountryConfig, FlowController, BrandConfig */

/**
 * Demo shell: timeline menu on the left (2/5), Flow preview on the right (3/5).
 * Previews: "desktop" (Flow at 500px) and "mobile" (Flow at 374px). Flow itself
 * is mounted once and moved between the preview slots — the SDK is remounted
 * after each move.
 *
 * `preview` per section: "toggle" follows the Desktop/Mobile buttons, any
 * other value pins that preview while the section is open.
 */

const SECTIONS = {
  boost: { preview: "toggle" },
  global: { preview: "toggle" },
  brand: { preview: "toggle", brandThemes: true },
  smarter: { preview: "toggle", rememberMe: true },
  compliance: { preview: "toggle", country: "us" },
};

const PREVIEW_SLOTS = {
  desktop: "flowSlotDesktop",
  mobile: "flowSlotMobile",
};

const PREVIEW_MOCKS = {
  desktop: "mockWeb",
  mobile: "mockMobile",
};

/**
 * Remember Me presentation modes. Both stay on the US session (USD, en-US);
 * only the processing channel differs, via `sessionVariant` — the keys map to
 * PROCESSING_CHANNEL_VARIANTS in lib/country-sessions.js.
 */
function rmMode(variant) {
  const us = CountryConfig.getDefault();
  return { ...us, code: variant, sessionVariant: variant };
}

const RM_VARIANTS = {
  checkbox: "rm-checkbox",
  embedded: "rm-embedded",
};

let activeSection = "boost";
// What the Desktop/Mobile buttons are set to…
let previewChoice = "desktop";
// …and what is actually on screen (a section can pin its own preview).
let previewMode = "desktop";
let activeMerchantBrand = null;
let brandAppearanceApplied = false;
// Which Remember Me mode is selected, and whether its session is live.
let activeRmMode = "checkbox";
let rmSessionApplied = false;
// The flag the shopper picked, so we can restore it after a Remember Me demo.
let selectedCountry = null;

function triggerToast(id) {
  const element = document.getElementById(id);
  element.classList.add("show");

  setTimeout(function () {
    element.classList.remove("show");
  }, 5000);
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

  // Keep the preview inside the stage panel: reserve the panel's own bottom
  // padding plus the viewport padding that frames the mock.
  const viewport = document.querySelector(".stage-viewport");
  const reserved =
    (parseFloat(getComputedStyle(stage).paddingBottom) || 0) +
    (viewport ? parseFloat(getComputedStyle(viewport).paddingBottom) || 0 : 0);
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

  const isBrand = Boolean(SECTIONS[sectionKey].brandThemes);
  const isRememberMe = Boolean(SECTIONS[sectionKey].rememberMe);

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
    } else if (isRememberMe) {
      // Remember Me runs on its own processing channel per mode.
      brandAppearanceApplied = false;
      selectRmMode(activeRmMode);
    } else {
      if (brandAppearanceApplied) {
        // Drop the brand appearance when leaving the brand demo.
        brandAppearanceApplied = false;
        FlowController.remountFrontendOnly(
          FlowController.getActiveCountry() || CountryConfig.getDefault(),
        );
      } else if (rmSessionApplied) {
        // Back off the Remember Me channel onto the selected market.
        selectCountry(selectedCountry || CountryConfig.getDefault());
      }

      // Sections can pin the market they demo with (e.g. compliance → US).
      const pinned = SECTIONS[sectionKey].country;
      if (pinned) {
        selectCountry(
          CountryConfig.getByCode(pinned) || CountryConfig.getDefault(),
        );
      }
    }
  }
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
}

async function selectCountry(country) {
  selectedCountry = country;
  rmSessionApplied = false;
  updateCountryUi(country);
  await FlowController.selectCountry(country);
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

/* ---------------- Remember Me ---------------- */

function updateRmModeUi(mode) {
  document.querySelectorAll("[data-rm-mode]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.rmMode === mode);
  });
}

/**
 * Load Flow on the Remember Me processing channel for this mode.
 * Each mode has its own channel, so this always needs a fresh session.
 */
async function selectRmMode(mode) {
  const variant = RM_VARIANTS[mode];
  if (!variant) return;

  activeRmMode = mode;
  rmSessionApplied = true;
  updateRmModeUi(mode);

  await FlowController.applySession(rmMode(variant));
}

function initRememberMe() {
  document.querySelectorAll("[data-rm-mode]").forEach((btn) => {
    btn.addEventListener("click", () => selectRmMode(btn.dataset.rmMode));
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

    // A brand mark can be a file (`iconImg`, e.g. "logos/pagoda.svg"), inline
    // SVG (`iconSvg`), or fall back to the coloured letter tile.
    const icon = document.createElement("span");
    icon.setAttribute("aria-hidden", "true");
    if (brand.iconImg) {
      icon.className = "merchant-brand-icon merchant-brand-icon--mark";
      const img = document.createElement("img");
      img.src = brand.iconImg;
      img.alt = "";
      icon.appendChild(img);
    } else if (brand.iconSvg) {
      icon.className = "merchant-brand-icon merchant-brand-icon--mark";
      icon.innerHTML = brand.iconSvg;
    } else {
      icon.className = "merchant-brand-icon";
      icon.style.cssText = iconStyle(brand.icon);
      icon.textContent = brand.icon.letter;
    }

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
  initRememberMe();

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
  selectedCountry = defaultCountry;
  updateCountryUi(defaultCountry);
  await FlowController.selectCountry(defaultCountry);

  // The brand and Remember Me slides need their own session/appearance, so
  // they boot non-initial to run their section handler.
  setSection(startSection, {
    initial: startSection !== "brand" && startSection !== "smarter",
  });
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
