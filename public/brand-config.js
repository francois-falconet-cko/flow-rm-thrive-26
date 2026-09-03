/**
 * Merchant brand demos for "Brand It Your Way".
 * Each brand can define a Flow `appearance` (+ optional flowOptions).
 * @see https://www.checkout.com/docs/payments/accept-payments/accept-a-payment-on-your-website/customize-your-flow-integration
 */
window.BrandConfig = (() => {
  const FALLBACK_SANS =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  const FALLBACK_MONO =
    'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

  // Distinct typeface per merchant brand (Flow appearance.fontFamily)
  const FONTS = {
    goDeliver: `"Nunito", ${FALLBACK_SANS}`,
    travelMe: `"Manrope", ${FALLBACK_SANS}`,
    pagoda: `"Space Grotesk", ${FALLBACK_SANS}`,
    solar: `"JetBrains Mono", ${FALLBACK_MONO}`,
    a7: `"Source Code Pro", ${FALLBACK_MONO}`,
    walle: `"Chakra Petch", ${FALLBACK_SANS}`,
  };

  // Brand marks exported from the marketing Figma file.
  const LOGOS = {
    travelMe: "logos/travelme.svg",
    goDeliver: "logos/go-deliver.svg",
    pagoda: "logos/pagoda.svg",
    solar: "logos/solar.svg",
    a7: "logos/a7.svg",
    walle: "logos/walle.svg",
  };

  const BRANDS = [
    {
      id: "go-deliver",
      wordmark: { text: "Go Deliver", font: FONTS.goDeliver },
      name: "GO Deliver",
      accent: "#7B5CFF",
      icon: { letter: "G", bg: "#7B5CFF", color: "#fff" },
      iconImg: LOGOS.goDeliver,
      summaryTitle: "Order summary",
      layout: "go-deliver",
      flowOptions: {
        locale: "en-US",
        componentOptions: {
          card: {
            displayCardholderName: "top",
          },
        },
      },
      appearance: {
        "colorAction": "#901AFF",
        "colorBackground": "#0A0A0C",
        "colorBorder": "#B1B1B1",
        "colorDisabled": "#B1B1B1",
        "colorError": "#DC2342",
        "colorFormBackground": "#FFFFFF",
        "colorFormBorder": "#B1B1B1",
        "colorInverse": "#FFFFFF",
        "colorOutline": "#901AFF",
        "colorPrimary": "#FFFFFF",
        "colorSecondary": "#9C9D9B",
        "colorSuccess": "#2ECC71",
        "button": {
          "fontFamily": "Manrope, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Arial, sans-serif",
          "fontSize": "16px",
          "fontWeight": 700,
          "letterSpacing": "0px",
          "lineHeight": "24px"
        },
        "footnote": {
          "fontFamily": "Manrope, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Arial, sans-serif",
          "fontSize": "14px",
          "fontWeight": 400,
          "letterSpacing": "0px",
          "lineHeight": "20px"
        },
        "input": {
          "fontFamily": "Arial, Helvetica, sans-serif",
          "fontSize": "16px",
          "fontWeight": 400,
          "letterSpacing": "0px",
          "lineHeight": "24px"
        },
        "label": {
          "fontFamily": "Manrope, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Arial, sans-serif",
          "fontSize": "14px",
          "fontWeight": 400,
          "letterSpacing": "0px",
          "lineHeight": "20px"
        },
        "subheading": {
          "fontFamily": "Manrope, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Arial, sans-serif",
          "fontSize": "16px",
          "fontWeight": 700,
          "letterSpacing": "0px",
          "lineHeight": "24px"
        },
        "borderRadius": [
          "15px",
          "15px"
        ],
      },
    },
    {
      id: "travelme",
      wordmark: {
        text: "TravelMe",
        suffix: ".com",
        color: "#2F6BFF",
        font: FONTS.travelMe,
      },
      name: "TravelMe",
      accent: "#2F6BFF",
      icon: { letter: "T", bg: "#2F6BFF", color: "#fff" },
      iconImg: LOGOS.travelMe,
      summaryTitle: "Trip summary",
      layout: "travelme",
      flowOptions: {
        locale: "en-US",
        componentOptions: {
          card: {
            displayCardholderName: "top",
          },
        },
      },
      appearance: {
        "colorAction": "#2C6BFF",
        "colorBackground": "#0c0a0a",
        "colorBorder": "#B1B1B1",
        "colorDisabled": "#B1B1B1",
        "colorError": "#DC2342",
        "colorFormBackground": "#FFFFFF",
        "colorFormBorder": "#B1B1B1",
        "colorInverse": "#F9F9FB",
        "colorOutline": "#8DBBFF",
        "colorPrimary": "#F9F9FB",
        "colorSecondary": "#68686C",
        "colorSuccess": "#2ECC71",
        "button": {
          "fontFamily": "DM Sans, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Arial, sans-serif",
          "fontSize": "16px",
          "fontWeight": 700,
          "letterSpacing": "0px",
          "lineHeight": "24px"
        },
        "footnote": {
          "fontFamily": "DM Sans, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Arial, sans-serif",
          "fontSize": "14px",
          "fontWeight": 400,
          "letterSpacing": "0px",
          "lineHeight": "20px"
        },
        "input": {
          "fontFamily": "Arial, Helvetica, sans-serif",
          "fontSize": "16px",
          "fontWeight": 400,
          "letterSpacing": "0px",
          "lineHeight": "24px"
        },
        "label": {
          "fontFamily": "DM Sans, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Arial, sans-serif",
          "fontSize": "14px",
          "fontWeight": 400,
          "letterSpacing": "0px",
          "lineHeight": "20px"
        },
        "subheading": {
          "fontFamily": "DM Sans, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Arial, sans-serif",
          "fontSize": "16px",
          "fontWeight": 700,
          "letterSpacing": "0px",
          "lineHeight": "24px"
        },
        "borderRadius": [
          "4px",
          "4px"
        ],
      },
    },
    {
      id: "pagoda",
      wordmark: { text: "pagoda", font: FONTS.pagoda },
      name: "Pagoda",
      accent: "#C6F000",
      icon: { letter: "P", bg: "#C6F000", color: "#111" },
      iconImg: LOGOS.pagoda,
      summaryTitle: "Transfer summary",
      layout: "pagoda",
      flowOptions: {
        locale: "en-US",
        componentOptions: {
          card: {
            displayCardholderName: "top",
          },
        },
      },
      appearance: {
        "colorAction": "#B3FF1A",
        "colorBackground": "#181818",
        "colorBorder": "#B1B1B1",
        "colorDisabled": "#B1B1B1",
        "colorError": "#DC2342",
        "colorFormBackground": "#FFFFFF",
        "colorFormBorder": "#B1B1B1",
        "colorInverse": "#FFFFFF",
        "colorOutline": "#B3FF1A",
        "colorPrimary": "#181818",
        "colorSecondary": "#68686C",
        "colorSuccess": "#2ECC71",
        "button": {
          "fontFamily": "Righteous, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Arial, sans-serif",
          "fontSize": "16px",
          "fontWeight": 400,
          "letterSpacing": "0px",
          "lineHeight": "24px"
        },
        "footnote": {
          "fontFamily": "Righteous, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Arial, sans-serif",
          "fontSize": "14px",
          "fontWeight": 400,
          "letterSpacing": "0px",
          "lineHeight": "20px"
        },
        "input": {
          "fontFamily": "Arial, Helvetica, sans-serif",
          "fontSize": "16px",
          "fontWeight": 400,
          "letterSpacing": "0px",
          "lineHeight": "24px"
        },
        "label": {
          "fontFamily": "Righteous, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Arial, sans-serif",
          "fontSize": "14px",
          "fontWeight": 400,
          "letterSpacing": "0px",
          "lineHeight": "20px"
        },
        "subheading": {
          "fontFamily": "Righteous, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Arial, sans-serif",
          "fontSize": "16px",
          "fontWeight": 400,
          "letterSpacing": "0px",
          "lineHeight": "24px"
        },
        "borderRadius": [
          "16px",
          "16px"
        ],
      },
    },
    {
      id: "solar",
      wordmark: { text: "SOLAR", font: FONTS.solar, spaced: true },
      name: "Solar",
      accent: "#FF5A1F",
      icon: { letter: "S", bg: "#111", color: "#fff", border: "#fff" },
      iconImg: LOGOS.solar,
      summaryTitle: "Investment summary",
      layout: "solar",
      flowOptions: {
        locale: "en-US",
        componentOptions: {
          card: {
            displayCardholderName: "top",
          },
        },
      },
      appearance: {
        "colorAction": "#FF4903",
        "colorBackground": "#0A0A0C",
        "colorBorder": "#68686C",
        "colorDisabled": "#68686C",
        "colorError": "#DC2342",
        "colorFormBackground": "#1F1F1F",
        "colorFormBorder": "#68686C",
        "colorInverse": "#0A0A0C",
        "colorOutline": "#FF4903",
        "colorPrimary": "#F9F9FB",
        "colorSecondary": "#68686C",
        "colorSuccess": "#2ECC71",
        "button": {
          "fontFamily": "Audiowide, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Arial, sans-serif",
          "fontSize": "16px",
          "fontWeight": 400,
          "letterSpacing": "0px",
          "lineHeight": "24px"
        },
        "footnote": {
          "fontFamily": "Audiowide, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Arial, sans-serif",
          "fontSize": "14px",
          "fontWeight": 400,
          "letterSpacing": "0px",
          "lineHeight": "20px"
        },
        "input": {
          "fontFamily": "Arial, Helvetica, sans-serif",
          "fontSize": "16px",
          "fontWeight": 400,
          "letterSpacing": "0px",
          "lineHeight": "24px"
        },
        "label": {
          "fontFamily": "Audiowide, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Arial, sans-serif",
          "fontSize": "14px",
          "fontWeight": 400,
          "letterSpacing": "0px",
          "lineHeight": "20px"
        },
        "subheading": {
          "fontFamily": "Audiowide, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Arial, sans-serif",
          "fontSize": "16px",
          "fontWeight": 400,
          "letterSpacing": "0px",
          "lineHeight": "24px"
        },
        "borderRadius": [
          "8px",
          "9px"
        ],
      },
    },
    {
      id: "a7",
      wordmark: { text: "A7 Entertainment", font: FONTS.a7, small: true },
      name: "A7 Entertainment",
      accent: "#B44DFF",
      icon: { letter: "A7", bg: "#B44DFF", color: "#fff" },
      iconImg: LOGOS.a7,
      summaryTitle: "Order summary",
      layout: "a7",
      flowOptions: {
        locale: "en-US",
        componentOptions: {
          card: {
            displayCardholderName: "top",
          },
        },
      },
      appearance: {
         "colorAction": "#AA00FF",
        "colorBackground": "#0A0A0C",
        "colorBorder": "#68686C",
        "colorDisabled": "#64646E",
        "colorError": "#FF3300",
        "colorFormBackground": "#1F1F1F",
        "colorFormBorder": "#68686C",
        "colorInverse": "#0A0A0C",
        "colorOutline": "#AA00FF",
        "colorPrimary": "#F9F9FB",
        "colorSecondary": "#828388",
        "colorSuccess": "#2ECC71",
        "button": {
          "fontFamily": "Space Grotesk, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Arial, sans-serif",
          "fontSize": "16px",
          "fontWeight": 700,
          "letterSpacing": "0px",
          "lineHeight": "24px"
        },
        "footnote": {
          "fontFamily": "Space Grotesk, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Arial, sans-serif",
          "fontSize": "14px",
          "fontWeight": 400,
          "letterSpacing": "0px",
          "lineHeight": "20px"
        },
        "input": {
          "fontFamily": "Arial, Helvetica, sans-serif",
          "fontSize": "16px",
          "fontWeight": 400,
          "letterSpacing": "0px",
          "lineHeight": "24px"
        },
        "label": {
          "fontFamily": "Space Grotesk, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Arial, sans-serif",
          "fontSize": "14px",
          "fontWeight": 500,
          "letterSpacing": "0px",
          "lineHeight": "20px"
        },
        "subheading": {
          "fontFamily": "Space Grotesk, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Arial, sans-serif",
          "fontSize": "16px",
          "fontWeight": 700,
          "letterSpacing": "0px",
          "lineHeight": "24px"
        },
        "borderRadius": [
          "8px",
          "8px"
        ],
      },
    },
    {
      id: "walle",
      wordmark: { text: "WALLE", font: FONTS.walle, spaced: true },
      name: "WALLE",
      accent: "#111111",
      icon: { letter: "W", bg: "#111", color: "#fff", border: "#fff" },
      iconImg: LOGOS.walle,
      summaryTitle: "Order summary",
      layout: "walle",
      flowOptions: {
        locale: "en-US",
        componentOptions: {
          card: {
            displayCardholderName: "top",
          },
        },
      },
      appearance: {
        "colorAction": "#FFFFFF",
      "colorBackground": "#000000",
      "colorBorder": "#9C9D9B",
      "colorDisabled": "#9C9D9B",
      "colorError": "#DC2342",
      "colorFormBackground": "#DDDDDD",
      "colorFormBorder": "#9C9D9B",
      "colorInverse": "#000000",
      "colorOutline": "#9C9D9B",
      "colorPrimary": "#9C9D9B",
      "colorSecondary": "#9C9D9B",
      "colorSuccess": "#2ECC71",
      "button": {
        "fontFamily": "Syne, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Arial, sans-serif",
        "fontSize": "16px",
        "fontWeight": 700,
        "letterSpacing": "0px",
        "lineHeight": "24px"
      },
      "footnote": {
        "fontFamily": "Syne, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Arial, sans-serif",
        "fontSize": "14px",
        "fontWeight": 400,
        "letterSpacing": "0px",
        "lineHeight": "20px"
      },
      "input": {
        "fontFamily": "Arial, Helvetica, sans-serif",
        "fontSize": "16px",
        "fontWeight": 400,
        "letterSpacing": "0px",
        "lineHeight": "24px"
      },
      "label": {
        "fontFamily": "Syne, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Arial, sans-serif",
        "fontSize": "14px",
        "fontWeight": 600,
        "letterSpacing": "0px",
        "lineHeight": "20px"
      },
      "subheading": {
        "fontFamily": "Syne, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Arial, sans-serif",
        "fontSize": "16px",
        "fontWeight": 700,
        "letterSpacing": "0px",
        "lineHeight": "24px"
      },
      "borderRadius": [
        "0px",
        "0px"
      ],
      },
    },
  ];

  const DEFAULT_BRAND_ID = "travelme";

  // Order the theme picker renders in (marketing deck order)
  const DISPLAY_ORDER = [
    "travelme",
    "walle",
    "go-deliver",
    "pagoda",
    "a7",
    "solar",
  ];

  function getAll() {
    return BRANDS.slice().sort(
      (a, b) => DISPLAY_ORDER.indexOf(a.id) - DISPLAY_ORDER.indexOf(b.id),
    );
  }

  function getById(id) {
    return BRANDS.find((brand) => brand.id === id) || null;
  }

  function getDefault() {
    return getById(DEFAULT_BRAND_ID) || BRANDS[0];
  }

  function changeLink(accent) {
    return `<button type="button" class="summary-change" style="--summary-accent:${accent}">Change</button>`;
  }

  function totals(rows, totalLabel, totalValue, accent) {
    const lines = rows
      .map(
        ([label, value]) =>
          `<div class="summary-line"><span>${label}</span><span>${value}</span></div>`,
      )
      .join("");

    return `
      <div class="summary-totals">
        ${lines}
        <div class="summary-total" style="--summary-accent:${accent}">
          <span>${totalLabel}</span><span>${totalValue}</span>
        </div>
      </div>
    `;
  }

  function renderGoDeliver(brand) {
    return `
      <p class="summary-heading">${brand.summaryTitle}</p>
      <div class="summary-card">
        <div class="summary-card-top">
          <div>
            <p class="summary-strong">Sat 11 July</p>
            <p class="summary-muted">Delivery · Standard</p>
            <p class="summary-body">49 Croft Lane, Royston, Barnsley<br />South Yorkshire S71 4RE</p>
            <p class="summary-body">6 pm to 7 pm</p>
            <p class="summary-fine">Order by 5:40pm, Thurs 9 July</p>
          </div>
          ${changeLink(brand.accent)}
        </div>
      </div>
      <div class="summary-card">
        <div class="summary-card-top">
          <div>
            <p class="summary-strong">24 items in your trolley</p>
            <p class="summary-muted">Substitutions accepted</p>
          </div>
          ${changeLink(brand.accent)}
        </div>
      </div>
      ${totals(
        [
          ["Shopping total", "£89.70"],
          ["Delivery Cost", "£3.50"],
        ],
        "Total",
        "£93.20",
        brand.accent,
      )}
    `;
  }

  function renderTravelMe(brand) {
    return `
      <p class="summary-heading">${brand.summaryTitle}</p>
      <div class="summary-card summary-card--dark">
        <div class="summary-card-top">
          <div>
            <p class="summary-strong">Sat 11 July</p>
            <p class="summary-body">London → Paris</p>
          </div>
          ${changeLink(brand.accent)}
        </div>
      </div>
      <div class="summary-card summary-card--dark">
        <p class="summary-strong">LHR → CDG</p>
        <p class="summary-muted">Economy · 1 Adult</p>
        <p class="summary-body">Departs 09:15 · Arrives 11:40</p>
        <p class="summary-fine">Check-in opens Mon 7 July from 00:15</p>
      </div>
      <div class="summary-card summary-card--dark">
        <div class="summary-card-top">
          <div>
            <p class="summary-strong">1 Adult passenger</p>
            <p class="summary-muted">Hand luggage included</p>
          </div>
          ${changeLink(brand.accent)}
        </div>
      </div>
      ${totals(
        [
          ["Flight", "£89.70"],
          ["Booking fee", "£3.50"],
        ],
        "Total",
        "£93.20",
        brand.accent,
      )}
    `;
  }

  function renderPagoda(brand) {
    return `
      <p class="summary-heading" style="color:${brand.accent}">${brand.summaryTitle}</p>
      <div class="summary-card summary-card--dark">
        <div class="summary-card-top">
          <div>
            <p class="summary-strong">Sending to Maria Santos</p>
            <p class="summary-muted">Philippines · Instant</p>
            <p class="summary-body">Recipient gets PHP 6,221.43 at 1 GBP = 69.40 PHP</p>
            <p class="summary-fine">Arrives in seconds</p>
          </div>
          ${changeLink(brand.accent)}
        </div>
      </div>
      <div class="summary-card summary-card--dark">
        <div class="summary-card-top">
          <div>
            <p class="summary-strong">Wallet to wallet</p>
            <p class="summary-muted">No hidden fees · Regulated by FCA</p>
          </div>
          ${changeLink(brand.accent)}
        </div>
      </div>
      <div class="summary-totals">
        <p class="summary-muted">Total deducted</p>
        <div class="summary-line"><span>You send</span><span>£89.70</span></div>
        <div class="summary-line"><span>Transfer fee</span><span>£3.50</span></div>
        <div class="summary-total" style="--summary-accent:${brand.accent}">
          <span>Total</span><span>£93.20</span>
        </div>
      </div>
    `;
  }

  function renderSolar(brand) {
    return `
      <p class="summary-heading">${brand.summaryTitle}</p>
      <div class="summary-card summary-card--dark">
        <div class="summary-card-top">
          <p class="summary-strong">Growth Portfolio</p>
          ${changeLink(brand.accent)}
        </div>
        <p class="summary-muted">Monthly · 1st of each month</p>
        <p class="summary-body">Global equities · Medium risk</p>
        <p class="summary-body">Instant execution · Real-time pricing</p>
        <p class="summary-fine">Next Investment: 1 Aug 2023</p>
      </div>
      <div class="summary-card summary-card--dark">
        <p class="summary-strong">Solar ISA Account</p>
        <p class="summary-muted">Annual allowance remaining: £19,500</p>
      </div>
      ${totals(
        [
          ["Investment amount", "£500.00"],
          ["Platform fee", "£0.00"],
        ],
        "Total",
        "£500.00",
        brand.accent,
      )}
    `;
  }

  function renderA7(brand) {
    return `
      <p class="summary-heading" style="color:${brand.accent}">${brand.summaryTitle}</p>
      <div class="summary-receipt">
        <div class="summary-line summary-line--item">
          <div>
            <p class="summary-strong">Apex Realms: Season 24 Battle Pass</p>
            <p class="summary-muted">Instant digital delivery</p>
          </div>
          <span>$9.90</span>
        </div>
        <div class="summary-line summary-line--item">
          <div>
            <p class="summary-strong">A7 Tokens — 2,000 Pack</p>
            <p class="summary-muted">In-game currency · Apex Realms</p>
          </div>
          <span>$10.90</span>
        </div>
        <div class="summary-line summary-line--item">
          <div>
            <p class="summary-strong">A7 Championship Entry — Finals</p>
            <p class="summary-muted">eSports bet · Prize pool eligible</p>
          </div>
          <span>$35.00</span>
        </div>
        <p class="summary-note" style="color:${brand.accent}">
          Friendly fraud protection active · Chargeback guarantee
        </p>
        <div class="summary-totals">
          <div class="summary-line"><span>Subtotal</span><span>$54.90</span></div>
          <div class="summary-line"><span>Platform fee</span><span>$0.50</span></div>
          <div class="summary-total" style="--summary-accent:${brand.accent}">
            <span>Total</span><span>$55.40</span>
          </div>
        </div>
        <p class="summary-fine">Gateway uptime: 99.99% · Launch-load resilient</p>
      </div>
    `;
  }

  function renderWalle(brand) {
    return `
      <p class="summary-heading">${brand.summaryTitle}</p>
      <div class="summary-toggle" role="tablist" aria-label="WALLE mode">
        <button type="button" class="summary-toggle-btn is-active" data-walle-mode="buy">Buy crypto</button>
        <button type="button" class="summary-toggle-btn" data-walle-mode="withdraw">Withdraw</button>
      </div>
      <div class="summary-card summary-card--dark">
        <p class="summary-strong">Ethereum</p>
        <p class="summary-muted">1 ETH = €2,847.52</p>
        <p class="summary-body">0.1758 ETH · You receive</p>
      </div>
      ${totals(
        [
          ["You pay", "€500.00"],
          ["WALLE fee (0.99%)", "€4.99"],
          ["Network fee", "€2.50"],
        ],
        "Total",
        "€507.49",
        brand.accent,
      )}
      <div class="summary-card summary-card--soft summary-card--compact">
        <p class="summary-strong">KYC Verified · Compliance active</p>
        <p class="summary-fine">Daily limit: €10,000 · Remaining: €9,500 · FCA regulated</p>
      </div>
    `;
  }

  const LAYOUTS = {
    "go-deliver": renderGoDeliver,
    travelme: renderTravelMe,
    pagoda: renderPagoda,
    solar: renderSolar,
    a7: renderA7,
    walle: renderWalle,
  };

  function renderSummary(brand) {
    const renderer = LAYOUTS[brand.layout];
    if (!renderer) return "";
    return renderer(brand);
  }

  return {
    DEFAULT_BRAND_ID,
    getAll,
    getById,
    getDefault,
    renderSummary,
  };
})();
