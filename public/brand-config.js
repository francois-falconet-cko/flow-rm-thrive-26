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
      icon: { letter: "G", bg: "#7B5CFF", color: "#fff" },
      iconImg: LOGOS.goDeliver,
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
      icon: { letter: "T", bg: "#2F6BFF", color: "#fff" },
      iconImg: LOGOS.travelMe,
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
      icon: { letter: "P", bg: "#C6F000", color: "#111" },
      iconImg: LOGOS.pagoda,
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
      icon: { letter: "S", bg: "#111", color: "#fff", border: "#fff" },
      iconImg: LOGOS.solar,
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
      icon: { letter: "A7", bg: "#B44DFF", color: "#fff" },
      iconImg: LOGOS.a7,
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
      icon: { letter: "W", bg: "#111", color: "#fff", border: "#fff" },
      iconImg: LOGOS.walle,
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

  return {
    DEFAULT_BRAND_ID,
    getAll,
    getById,
    getDefault,
  };
})();
