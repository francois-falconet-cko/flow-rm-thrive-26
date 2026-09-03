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

  /**
   * Brand marks exported from the marketing Figma file (public/logos/).
   * TravelMe keeps its inline mark until the export lands.
   */
  const MARKS = {
    // Paper plane: white upper wing + #003DAC lower fold (per the Figma spec)
    travelMe: `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M23.4 0.8 0.6 11.9l9.6 5.1z" fill="#FFFFFF" />
        <path d="M10.2 17 23.2 12.2 5.2 23.4z" fill="#003DAC" />
      </svg>`,
  };

  const LOGOS = {
    goDeliver: "logos/go-deliver.svg",
    pagoda: "logos/pagoda.svg",
    solar: "logos/solar.svg",
    a7: "logos/a7.svg",
    walle: "logos/walle.svg",
  };

  function fontStyles(fontFamily) {
    return {
      button: {
        fontFamily,
        fontSize: "16px",
        fontWeight: 700,
        letterSpacing: 0,
        lineHeight: "24px",
      },
      label: {
        fontFamily,
        fontSize: "14px",
        fontWeight: 500,
        letterSpacing: 0,
        lineHeight: "20px",
      },
      subheading: {
        fontFamily,
        fontSize: "16px",
        fontWeight: 700,
        letterSpacing: 0,
        lineHeight: "24px",
      },
      footnote: {
        fontFamily,
        fontSize: "13px",
        fontWeight: 400,
        letterSpacing: 0,
        lineHeight: "18px",
      },
      input: {
        fontFamily,
        fontSize: "16px",
        fontWeight: 400,
        letterSpacing: 0,
        lineHeight: "24px",
      },
    };
  }

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
        colorAction: "#7B5CFF",
        colorBackground: "#FFFFFF",
        colorBorder: "#E6E6E6",
        colorDisabled: "#BDBDBD",
        colorError: "#E5484D",
        colorFormBackground: "#FFFFFF",
        colorFormBorder: "#D0D0D0",
        colorInverse: "#FFFFFF",
        colorOutline: "#7B5CFF",
        colorPrimary: "#111111",
        colorSecondary: "#6F6F6F",
        colorSuccess: "#1DB954",
        borderRadius: ["6px", "6px"],
        ...fontStyles(FONTS.goDeliver),
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
      iconSvg: MARKS.travelMe,
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
        colorAction: "#2F6BFF",
        colorBackground: "#FFFFFF",
        colorBorder: "#E6E6E6",
        colorDisabled: "#BDBDBD",
        colorError: "#E5484D",
        colorFormBackground: "#FFFFFF",
        colorFormBorder: "#D0D0D0",
        colorInverse: "#FFFFFF",
        colorOutline: "#2F6BFF",
        colorPrimary: "#111111",
        colorSecondary: "#6F6F6F",
        colorSuccess: "#1DB954",
        borderRadius: ["6px", "6px"],
        ...fontStyles(FONTS.travelMe),
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
        colorAction: "#C6F000",
        colorBackground: "#181818",
        colorBorder: "#3A3A3A",
        colorDisabled: "#5A5A5A",
        colorError: "#FF5A5A",
        colorFormBackground: "#111111",
        colorFormBorder: "#3A3A3A",
        colorInverse: "#111111",
        colorOutline: "#C6F000",
        colorPrimary: "#FFFFFF",
        colorSecondary: "#A0A0A0",
        colorSuccess: "#C6F000",
        borderRadius: ["6px", "6px"],
        ...fontStyles(FONTS.pagoda),
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
        colorAction: "#FF5A1F",
        colorBackground: "#121212",
        colorBorder: "#3A3A3A",
        colorDisabled: "#5A5A5A",
        colorError: "#FF5A5A",
        colorFormBackground: "#1A1A1A",
        colorFormBorder: "#3A3A3A",
        colorInverse: "#FFFFFF",
        colorOutline: "#FF5A1F",
        colorPrimary: "#FFFFFF",
        colorSecondary: "#A0A0A0",
        colorSuccess: "#2ECC71",
        borderRadius: ["4px", "4px"],
        ...fontStyles(FONTS.solar),
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
        colorAction: "#B44DFF",
        colorBackground: "#121212",
        colorBorder: "#333333",
        colorDisabled: "#5A5A5A",
        colorError: "#FF5A5A",
        colorFormBackground: "#1A1A1A",
        colorFormBorder: "#333333",
        colorInverse: "#FFFFFF",
        colorOutline: "#B44DFF",
        colorPrimary: "#FFFFFF",
        colorSecondary: "#A0A0A0",
        colorSuccess: "#2ECC71",
        borderRadius: ["4px", "4px"],
        ...fontStyles(FONTS.a7),
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
        colorAction: "#111111",
        colorBackground: "#FFFFFF",
        colorBorder: "#E6E6E6",
        colorDisabled: "#BDBDBD",
        colorError: "#E5484D",
        colorFormBackground: "#FFFFFF",
        colorFormBorder: "#CCCCCC",
        colorInverse: "#FFFFFF",
        colorOutline: "#111111",
        colorPrimary: "#111111",
        colorSecondary: "#6F6F6F",
        colorSuccess: "#1DB954",
        borderRadius: ["4px", "4px"],
        ...fontStyles(FONTS.walle),
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
