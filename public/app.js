/* global CheckoutWebComponents, CountryConfig, FlowController */

const SECTIONS = {
  boost: {
    eyebrow: "Boost Performance and Conversion",
    title: "Your Checkout, Upgraded",
    subtitle:
      "Lift conversion by ~5% with smart, local payment defaults for every customer",
  },
  smarter: {
    eyebrow: "A Smarter Way to Pay",
    title: "Payments That Think Ahead",
    subtitle:
      "Surface the right method at the right moment and keep every shopper moving",
  },
  brand: {
    eyebrow: "Brand It Your Way",
    title: "Make Checkout Yours",
    subtitle:
      "Match your brand voice across every payment experience without rebuilding the stack",
  },
  global: {
    eyebrow: "Go Global in a Few Clicks",
    title: "One Flow, Many Markets",
    subtitle:
      "Launch local payment methods faster and meet customers where they already pay",
  },
  compliance: {
    eyebrow: "Easy Compliance",
    title: "Stay Ready, Stay Shipping",
    subtitle:
      "Keep pace with regional requirements while conversion stays front and center",
  },
};

function triggerToast(id) {
  const element = document.getElementById(id);
  element.classList.add("show");

  setTimeout(function () {
    element.classList.remove("show");
  }, 5000);
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

  header.classList.add("is-switching");
  grid.classList.add("is-switching");

  window.setTimeout(() => {
    eyebrow.textContent = section.eyebrow;
    title.textContent = section.title;
    subtitle.textContent = section.subtitle;
    grid.dataset.section = sectionKey;

    header.classList.remove("is-switching");
    grid.classList.remove("is-switching");
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

async function boot() {
  initSidebar();
  initNav();
  initCountries();

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
