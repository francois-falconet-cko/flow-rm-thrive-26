/**
 * Sidebar translations for the demo.
 *
 * The English copy lives in index.html; every translatable node carries a
 * `data-i18n="key"` attribute (or `data-i18n-title` / `data-i18n-aria` for
 * those attributes). Switching to "fr" swaps in the strings below; switching
 * back to "en" restores whatever was in the markup on load.
 *
 * The language choice is remembered in localStorage so a reload keeps it.
 */
const I18n = (function () {
  const DEFAULT_LANG = "en";
  const STORAGE_KEY = "flowDemoLang";

  const STRINGS = {
    fr: {
      /* ---- Boost performance ---- */
      "boost.title": "Boostez la performance",
      "boost.lede":
        "Augmentez la conversion d'environ 5 % grâce à des moyens de paiement locaux intelligents, adaptés à chaque client. Acceptez les moyens de paiement du monde entier dès le départ. Flow optimise automatiquement selon la devise, l'appareil et bien plus encore.",
      "boost.stat1.label":
        "d'authentifications en moins avec Flow par rapport à l'API",
      "boost.stat2.label":
        "d'expirations 3DS en moins avec Flow par rapport à l'API",
      "boost.comingSoon": "Bientôt disponible",
      "boost.soon1":
        "Les marchands peuvent contrôler l'ordre d'affichage des moyens de paiement.",
      "boost.soon2":
        "Les acheteurs peuvent scanner leur carte pour saisir leurs informations plus rapidement.",
      "boost.tryLabel": "Testez différents scénarios de paiement",
      "boost.tryNote":
        "Essayez le checkout à droite. Changez de moyen de paiement, saisissez différentes informations et validez pour voir comment Flow gère les erreurs et répond en temps réel.",

      /* ---- Go global ---- */
      "global.title": "Passez à l'international en quelques clics",
      "global.lede":
        "Activez plus de 42 moyens de paiement locaux instantanément, sans écrire une ligne de code — avec une seule intégration.",
      "global.stat1.label":
        "Moyens de paiement triés et filtrés automatiquement selon la localisation de l'acheteur, la devise et l'appareil",
      "global.stat2.label":
        "Langues pour proposer des moyens de paiement locaux depuis une seule intégration",
      "global.comingSoon": "Nouveaux moyens de paiement bientôt disponibles",
      "global.soon2": "Open banking (paiement par virement) • Blik récurrent",
      "global.exploreLabel": "Découvrez les moyens de paiement locaux",

      /* ---- Brand it your way ---- */
      "brand.title": "Personnalisez à votre image",
      "brand.lede":
        "Un checkout qui vous ressemble. Personnalisez les polices, les couleurs, les bordures, les icônes et des dizaines d'autres propriétés pour refléter votre marque.",
      "brand.stat1.label":
        "Options de style configurables individuellement pour personnaliser",
      "brand.comingSoon": "Bientôt disponible",
      "brand.soon1": "Davantage d'options de personnalisation",
      "brand.samplesLabel": "Interagissez avec quelques exemples de thèmes",
      "customize.title": "Personnalisez le checkout en direct",
      "customize.reset": "Réinitialiser",
      "customize.orderLabel": "Ordonnez les moyens de paiement",
      "customize.orderHint":
        "Glissez une ligne — ou utilisez les flèches — pour définir paymentMethodOrder.",
      "customize.cardholderLabel": "Nom du titulaire",
      "customize.cardholder.top": "En haut",
      "customize.cardholder.bottom": "En bas",
      "customize.cardholder.hidden": "Masqué",
      "customize.payButtonLabel": "Bouton de paiement",
      "customize.payButton.show": "Afficher",
      "customize.payButton.hide": "Masquer",
      "customize.layoutLabel": "Mode de montage",
      "customize.layout.default": "Par défaut",
      "customize.layout.custom": "Divs séparées",
      "customize.layoutNote":
        "Chaque moyen de paiement est maintenant un composant dans sa propre div — glissez les en-têtes dans l'aperçu pour les réorganiser. Les moyens de paiement qui n'existent que dans l'accordéon (comme Klarna) ne sont pas affichés.",

      /* ---- A smarter way to pay ---- */
      "smarter.title": "Une façon plus intelligente de payer",
      "smarter.lede":
        "Remember Me permet aux acheteurs d'enregistrer leur carte une seule fois, puis de payer en quelques secondes sur tout le réseau Checkout.com — y compris lors de leur premier achat chez vous.",
      "smarter.stat1.value": "Jusqu'à 7 pts",
      "smarter.stat1.label":
        "Taux d'acceptation supérieur pour les acheteurs récurrents",
      "smarter.stat2.value": "9 sur 10",
      "smarter.stat2.label":
        "Des utilisateurs de Remember Me le réutilisent dès qu'ils le retrouvent",
      "smarter.comingSoon": "Bientôt disponible",
      "smarter.soon1":
        "Authentification biométrique pour un checkout récurrent encore plus rapide",
      "smarter.soon2":
        "Intégration Click to Pay. Les acheteurs accèdent à des cartes prêtes à l'emploi dès leur première visite",
      "smarter.enableLabel": "Activer Remember Me",
      "smarter.mode.checkbox": "Case à cocher",
      "smarter.mode.embedded": "Intégré",
      "smarter.journeyLabel": "Choisissez un parcours",
      "smarter.journey.new": "Nouveau client",
      "smarter.journey.returning": "Client récurrent",

      /* ---- Simplify compliance ---- */
      "compliance.title": "Simplifiez la conformité",
      "compliance.lede":
        "Respectez les standards de certification sans la charge associée. Flow capture et tokenise les données de carte dans des composants gérés par Checkout.com, garde le 3DS et les outils anti-fraude activés par défaut, et aide à réduire votre périmètre PCI — sans intégration supplémentaire.",
      "compliance.check1":
        "Conforme PCI DSS par conception — réduisez votre périmètre vers le SAQ A",
      "compliance.check2": "3D Secure et validation de carte prêts à l'emploi",
      "compliance.check3":
        "L'empreinte d'appareil détecte et prévient la fraude",
      "compliance.badge.pci.alt": "Conforme PCI DSS",
      "compliance.badge.encrypted": "Paiement chiffré",

      /* ---- Misc ---- */
      "aria.toggleMenu": "Afficher/masquer le menu",
      "aria.selectCountry": "Sélectionner un pays",
      "aria.selectTheme": "Sélectionner un thème",
      "country.pending": "%s — configuration de session bientôt disponible",
      "lang.label": "Langue",
    },
  };

  let currentLang = DEFAULT_LANG;
  const listeners = [];
  // Whatever the markup shipped with, so switching back to English is exact.
  const fallbacks = new Map();

  function originals(el, attr, read) {
    if (!fallbacks.has(el)) fallbacks.set(el, {});
    const store = fallbacks.get(el);
    if (!(attr in store)) store[attr] = read();
    return store[attr];
  }

  /** Translate `key`, falling back to English (i.e. to `fallback`). */
  function t(key, fallback) {
    const dict = STRINGS[currentLang];
    return (dict && dict[key]) || fallback || key;
  }

  function apply(root) {
    const scope = root || document;

    scope.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      const original = originals(el, "text", () => el.textContent);
      el.textContent = t(key, original);
    });

    scope.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.dataset.i18nTitle;
      const original = originals(el, "title", () => el.getAttribute("title"));
      el.setAttribute("title", t(key, original));
    });

    scope.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.dataset.i18nAria;
      const original = originals(el, "aria", () =>
        el.getAttribute("aria-label"),
      );
      el.setAttribute("aria-label", t(key, original));
    });

    scope.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      const key = el.dataset.i18nAlt;
      const original = originals(el, "alt", () => el.getAttribute("alt"));
      el.setAttribute("alt", t(key, original));
    });
  }

  function getLang() {
    return currentLang;
  }

  function setLang(lang) {
    const known = Boolean(STRINGS[lang]) || lang === DEFAULT_LANG;
    const next = known ? lang : DEFAULT_LANG;
    currentLang = next;

    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch (err) {
      /* private browsing — the choice just won't persist */
    }

    document.documentElement.lang = next === "fr" ? "fr" : "en";

    document.querySelectorAll("[data-lang]").forEach((btn) => {
      const active = btn.dataset.lang === next;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    apply();
    listeners.forEach((fn) => fn(next));
  }

  /** Run `fn` whenever the language changes (for JS-rendered copy). */
  function onChange(fn) {
    listeners.push(fn);
  }

  function storedLang() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && (STRINGS[saved] || saved === DEFAULT_LANG)) return saved;
    } catch (err) {
      /* ignore */
    }
    return DEFAULT_LANG;
  }

  function init() {
    document.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.addEventListener("click", () => setLang(btn.dataset.lang));
    });

    setLang(storedLang());
  }

  return { init, apply, setLang, getLang, onChange, t };
})();

window.I18n = I18n;
