/* global CheckoutWebComponents */

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

const COUNTRIES = [
  { code: "us", name: "United States", currency: "USD" },
  { code: "ca", name: "Canada", currency: "CAD" },
  { code: "mx", name: "Mexico", currency: "MXN" },
  { code: "ae", name: "UAE", currency: "AED" },
  { code: "sa", name: "Saudi Arabia", currency: "SAR" },
  { code: "gb", name: "United Kingdom", currency: "GBP" },
  { code: "nl", name: "Netherlands", currency: "EUR" },
  { code: "de", name: "Germany", currency: "EUR" },
  { code: "sg", name: "Singapore", currency: "SGD" },
  { code: "es", name: "Spain", currency: "EUR" },
  { code: "jp", name: "Japan", currency: "JPY" },
  { code: "bh", name: "Bahrain", currency: "BHD" },
  { code: "hk", name: "Hong Kong", currency: "HKD" },
  { code: "pt", name: "Portugal", currency: "EUR" },
  { code: "qa", name: "Qatar", currency: "QAR" },
];

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
    // Force reflow so animation can replay
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

function selectCountry(country) {
  document.querySelectorAll(".country-btn").forEach((btn) => {
    const selected = btn.dataset.code === country.code;
    btn.classList.toggle("is-selected", selected);
    btn.setAttribute("aria-selected", String(selected));
  });

  document.getElementById("simCountry").textContent = country.name;
  document.getElementById("simCurrency").textContent = country.currency;

  // Hook reserved for upcoming country-driven Flow behavior
  document.dispatchEvent(
    new CustomEvent("country:selected", { detail: country }),
  );
}

function initCountries() {
  const grid = document.getElementById("countryGrid");
  if (!grid) return;

  COUNTRIES.forEach((country, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "country-btn" + (index === 0 ? " is-selected" : "");
    button.dataset.code = country.code;
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", index === 0 ? "true" : "false");

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
    button.addEventListener("click", () => selectCountry(country));
    grid.appendChild(button);
  });
}

async function initFlow() {
  const configResponse = await fetch("/config");
  const { publicKey } = await configResponse.json();

  if (!configResponse.ok || !publicKey) {
    console.error("Error loading checkout config");
    return;
  }

  const response = await fetch("/create-payment-sessions", { method: "POST" });
  const paymentSession = await response.json();

  if (!response.ok) {
    console.error("Error creating payment session", paymentSession);
    return;
  }

  const checkout = await CheckoutWebComponents({
    publicKey,
    environment: "sandbox",
    locale: "en-GB",
    paymentSession,
    onReady: () => {
      console.log("onReady");
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

  const flowComponent = checkout.create("flow");
  flowComponent.mount(document.getElementById("flow-container"));
}

initSidebar();
initNav();
initCountries();
initFlow();

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
