/**
 * Merchant brand demos for "Brand It Your Way".
 * Flow appearance is left unchanged for now — only the right-hand summary swaps.
 */
window.BrandConfig = (() => {
  const BRANDS = [
    {
      id: "go-deliver",
      name: "GO Deliver",
      accent: "#7B5CFF",
      icon: { letter: "G", bg: "#7B5CFF", color: "#fff" },
      summaryTitle: "Order summary",
      layout: "go-deliver",
    },
    {
      id: "travelme",
      name: "TravelMe",
      accent: "#2F6BFF",
      icon: { letter: "T", bg: "#2F6BFF", color: "#fff" },
      summaryTitle: "Trip summary",
      layout: "travelme",
    },
    {
      id: "pagoda",
      name: "Pagoda",
      accent: "#C6F000",
      icon: { letter: "P", bg: "#C6F000", color: "#111" },
      summaryTitle: "Transfer summary",
      layout: "pagoda",
    },
    {
      id: "solar",
      name: "Solar",
      accent: "#FF5A1F",
      icon: { letter: "S", bg: "#111", color: "#fff", border: "#fff" },
      summaryTitle: "Investment summary",
      layout: "solar",
    },
    {
      id: "pureglow",
      name: "Pureglow Lab",
      accent: "#111111",
      icon: { letter: "P", bg: "#fff", color: "#111" },
      summaryTitle: "Order summary",
      layout: "pureglow",
    },
    {
      id: "a7",
      name: "A7 Entertainment",
      accent: "#B44DFF",
      icon: { letter: "A7", bg: "#B44DFF", color: "#fff" },
      summaryTitle: "Order summary",
      layout: "a7",
    },
    {
      id: "walle",
      name: "WALLE",
      accent: "#111111",
      icon: { letter: "W", bg: "#111", color: "#fff", border: "#fff" },
      summaryTitle: "Order summary",
      layout: "walle",
    },
  ];

  const DEFAULT_BRAND_ID = "go-deliver";

  function getAll() {
    return BRANDS.slice();
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

  function renderPureglow(brand) {
    return `
      <div class="summary-card summary-card--soft">
        <div class="summary-line summary-line--item">
          <div>
            <p class="summary-strong">Linen Oversized Blazer</p>
            <p class="summary-muted">Ecru · Size S</p>
          </div>
          <span>€89.00</span>
        </div>
        <div class="summary-line summary-line--item">
          <div>
            <p class="summary-strong">Ribbed Modal Tank</p>
            <p class="summary-muted">Ivory · Size XS · Qty 2</p>
          </div>
          <span>€76.00</span>
        </div>
        <div class="summary-line summary-line--item">
          <div>
            <p class="summary-strong">Wide-Leg Trousers</p>
            <p class="summary-muted">Sand · Size S</p>
          </div>
          <span>€22.00</span>
        </div>
        <div class="summary-line">
          <span>Standard delivery · 3–5 days</span>
          <span class="summary-strong">FREE</span>
        </div>
        <button type="button" class="summary-promo">Add a promo code</button>
        <div class="summary-totals summary-totals--inset">
          <div class="summary-line"><span>Subtotal</span><span>€187.00</span></div>
          <div class="summary-line"><span>Delivery</span><span>Free</span></div>
          <div class="summary-total" style="--summary-accent:${brand.accent}">
            <span>Total</span><span>€187.00</span>
          </div>
        </div>
        <p class="summary-fine">Free returns: 30 days · Secure checkout · Carbon-neutral shipping</p>
      </div>
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
    pureglow: renderPureglow,
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
