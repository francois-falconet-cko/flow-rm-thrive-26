/* global CountryConfig, FlowController, BrandConfig */

const SECTIONS = {
  boost: {
    eyebrow: "Boost Performance and Conversion",
    title: "Your Checkout, Upgraded",
    subtitle:
      "Lift conversion by ~5% with smart, local payment defaults for every customer",
    view: "boost",
  },
  smarter: {
    eyebrow: "A Smarter Way to Pay",
    title: "Payments That Think Ahead",
    subtitle:
      "Surface the right method at the right moment and keep every shopper moving",
    view: "boost",
  },
  brand: {
    eyebrow: "Brand It Your Way",
    title: "Your Checkout, Upgraded",
    subtitle:
      "Give every merchant their own look and feel, without rebuilding checkout from scratch",
    benefits: [
      "Apply your brand's colours, logo, and tone",
      "Keep Flow's accessible, tested checkout UX underneath",
    ],
    view: "brand",
  },
  global: {
    eyebrow: "Go Global in a Few Clicks",
    title: "One Flow, Many Markets",
    subtitle:
      "Launch local payment methods faster and meet customers where they already pay",
    view: "boost",
  },
  compliance: {
    eyebrow: "Easy Compliance",
    title: "Stay Ready, Stay Shipping",
    subtitle:
      "Keep pace with regional requirements while conversion stays front and center",
    view: "boost",
  },
};

let activeMerchantBrand = null;

function triggerToast(id) {
  const element = document.getElementById(id);
  element.classList.add("show");

  setTimeout(function () {
    element.classList.remove("show");
  }, 5000);
}

function benefitCheckSvg() {
  return `
    <span class="benefit-check" aria-hidden="true">
      <svg viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="10" fill="#1DB954" />
        <path
          d="M6 10.2l2.4 2.4L14 7.2"
          stroke="#fff"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
    </span>
  `;
}

function renderHeaderBenefits(benefits) {
  const list = document.getElementById("headerBenefits");
  if (!list) return;

  if (!benefits?.length) {
    list.hidden = true;
    list.innerHTML = "";
    return;
  }

  list.innerHTML = benefits
    .map(
      (text) =>
        `<li>${benefitCheckSvg()}<span>${text}</span></li>`,
    )
    .join("");
  list.hidden = false;
}

function setSectionView(view) {
  const boostContext = document.getElementById("boostContext");
  const brandContext = document.getElementById("brandContext");
  const brandToolbar = document.getElementById("brandToolbar");

  const isBrand = view === "brand";

  if (boostContext) boostContext.hidden = isBrand;
  if (brandContext) brandContext.hidden = !isBrand;
  if (brandToolbar) brandToolbar.hidden = !isBrand;

  document.body.classList.toggle("is-brand-view", isBrand);
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

function setSection(sectionKey) {
  const section = SECTIONS[sectionKey];
  if (!section) return;

  const header = document.getElementById("contentHeader");
  const grid = document.getElementById("contentGrid");
  const eyebrow = document.getElementById("sectionEyebrow");
  const title = document.getElementById("sectionTitle");
  const subtitle = document.getElementById("sectionSubtitle");
  const toolbar = document.getElementById("brandToolbar");

  header.classList.add("is-switching");
  grid.classList.add("is-switching");
  toolbar?.classList.add("is-switching");

  window.setTimeout(() => {
    eyebrow.textContent = section.eyebrow;
    title.textContent = section.title;
    subtitle.textContent = section.subtitle;
    grid.dataset.section = sectionKey;
    renderHeaderBenefits(section.benefits);
    setSectionView(section.view);

    if (section.view === "brand") {
      selectMerchantBrand(activeMerchantBrand || BrandConfig.getDefault());
    }

    header.classList.remove("is-switching");
    grid.classList.remove("is-switching");
    toolbar?.classList.remove("is-switching");
    header.style.animation = "none";
    grid.style.animation = "none";
    void header.offsetWidth;
    header.style.animation = "";
    grid.style.animation = "";
  }, 160);

  document.querySelectorAll(".nav-btn[data-section]").forEach((btn) => {
    const active = btn.dataset.section === sectionKey;
    btn.classList.toggle("is-active", active);
    if (active) {
      btn.setAttribute("aria-current", "page");
    } else {
      btn.removeAttribute("aria-current");
    }
  });

  const sidebar = document.getElementById("sidebar");
  const toggle = document.getElementById("sidebarToggle");
  if (sidebar?.classList.contains("is-open")) {
    sidebar.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  }
}

function initNav() {
  document.querySelectorAll(".nav-btn[data-section]").forEach((btn) => {
    btn.addEventListener("click", () => setSection(btn.dataset.section));
  });
}

function updateCountryUi(country) {
  document.querySelectorAll(".country-btn").forEach((btn) => {
    const selected = btn.dataset.code === country.code;
    btn.classList.toggle("is-selected", selected);
    btn.setAttribute("aria-selected", String(selected));
  });

  document.getElementById("simCountry").textContent = country.name;
  document.getElementById("simCurrency").textContent = country.currency;
}

async function selectCountry(country) {
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

    if (!country.sessionKey) {
      button.title = "Session config coming soon for this market";
      button.classList.add("is-pending");
    }

    const flag = document.createElement("img");
    flag.className = "country-flag";
    flag.src = `https://flagcdn.com/w40/${country.code}.png`;
    flag.srcset = `https://flagcdn.com/w80/${country.code}.png 2x`;
    flag.alt = "";
    flag.width = 22;
    flag.height = 22;
    flag.loading = "lazy";

    const label = document.createElement("span");
    label.textContent = country.name;

    button.append(flag, label);
    button.addEventListener("click", () => {
      selectCountry(country);
    });
    grid.appendChild(button);
  });
}

function iconStyle(icon) {
  const border = icon.border ? `border:1.5px solid ${icon.border};` : "";
  return `background:${icon.bg};color:${icon.color};${border}`;
}

function selectMerchantBrand(brand) {
  if (!brand) return;

  activeMerchantBrand = brand;

  document.querySelectorAll(".merchant-brand-btn").forEach((btn) => {
    const selected = btn.dataset.brandId === brand.id;
    btn.classList.toggle("is-selected", selected);
    btn.setAttribute("aria-selected", String(selected));
  });

  const simBrand = document.getElementById("simBrand");
  if (simBrand) simBrand.textContent = brand.name;

  const brandContext = document.getElementById("brandContext");
  if (brandContext) {
    brandContext.innerHTML = BrandConfig.renderSummary(brand);
    brandContext.dataset.brandId = brand.id;
    brandContext.style.setProperty("--brand-accent", brand.accent);

    brandContext.querySelectorAll("[data-walle-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        brandContext.querySelectorAll("[data-walle-mode]").forEach((item) => {
          item.classList.toggle("is-active", item === btn);
        });
      });
    });
  }

  // Appearance customization for Flow will be wired later
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
    button.className =
      "merchant-brand-btn" + (isDefault ? " is-selected" : "");
    button.dataset.brandId = brand.id;
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", isDefault ? "true" : "false");

    const icon = document.createElement("span");
    icon.className = "merchant-brand-icon";
    icon.style.cssText = iconStyle(brand.icon);
    icon.textContent = brand.icon.letter;
    icon.setAttribute("aria-hidden", "true");

    const label = document.createElement("span");
    label.textContent = brand.name;

    button.append(icon, label);
    button.addEventListener("click", () => selectMerchantBrand(brand));
    grid.appendChild(button);
  });

  activeMerchantBrand = defaultBrand;
}

async function boot() {
  initSidebar();
  initNav();
  initCountries();
  initMerchantBrands();

  const defaultCountry = CountryConfig.getDefault();
  updateCountryUi(defaultCountry);
  await FlowController.selectCountry(defaultCountry);
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
