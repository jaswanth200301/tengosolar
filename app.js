(function () {
  var h = React.createElement, useState = React.useState, useEffect = React.useEffect, useRef = React.useRef;

  // ===== EDIT HERE. Everything below is an UNVERIFIED placeholder until sourced and dated. =====
  var CONFIG = {
    packages: [
      { kw: 3, from: 200000, equipment: "To be confirmed" },
      { kw: 2, from: null, equipment: "To be confirmed" },
      { kw: 5, from: null, equipment: "To be confirmed" },
      { kw: 10, from: null, equipment: "To be confirmed" }
    ],
    region: { name: "Andhra Pradesh", discoms: ["APSPDCL", "APCPDCL", "APEPDCL"], nodal: "NREDCAP" },
    // Quote form stays closed until the privacy policy is live. Fill the two values, then set open: true.
    // Public contact addresses (safe to publish). Fill in once Email Routing works, e.g. hello@yourdomain.in
    contact: { email: "contact@tengosolar.com", grievanceEmail: "contact@tengosolar.com" },
    form: { open: false, functionUrl: "https://opojsqomgshxhtumagss.supabase.co/functions/v1/quick-function", turnstileSiteKey: "0x4AAAAAAF8aTUc9Fv2iti_c" },
    // Calculator assumptions. ALL UNVERIFIED planning values: confirm with installer data and official sources before launch.
    calc: { asOf: "2026-11-12", yieldKwhPerKwDay: 4, costPerKw: 66667 /* from the Rs 2 lakh 3 kW price */, degradationPerYear: 0.005, tariffGrowthPerYear: 0, years: 15, sqftPerKw: 100,
      subsidySource: "MNRE PM Surya Ghar guidelines, checked 12 Nov 2026" },
    assumptions: { tariffSlabs: null, sunHours: null, costPerKw: null, subsidy: null }
  };
  // Telugu strings are drafts: TODO_REVIEW by a native Telugu speaker before publishing.
  var T = {
    en: { home: "Home", about: "About", services: "Services", faq: "FAQ", sponsored: "Sponsored", cta: "Get a free quote", lang: "తెలుగు",
      privacy: "Privacy Policy", terms: "Terms", contact: "Contact details: coming soon",
      grievance: "Grievance and data-request contact: to be named before launch",
      scope: "Residential and small commercial installations only.", contactLabel: "Contact:", grievanceLabel: "Grievance and data requests:" },
    te: { home: "హోమ్", about: "మా గురించి", services: "సేవలు", faq: "తరచుగా అడిగే ప్రశ్నలు", sponsored: "స్పాన్సర్డ్", cta: "ఉచిత కోట్ పొందండి", lang: "English",
      privacy: "గోప్యతా విధానం", terms: "నిబంధనలు", contact: "సంప్రదింపు వివరాలు త్వరలో",
      grievance: "ఫిర్యాదు మరియు డేటా అభ్యర్థన సంప్రదింపు: ప్రారంభానికి ముందు ప్రకటిస్తాం",
      scope: "గృహ మరియు చిన్న వాణిజ్య ఇన్‌స్టాలేషన్లు మాత్రమే.", contactLabel: "సంప్రదింపు:", grievanceLabel: "ఫిర్యాదులు మరియు డేటా అభ్యర్థనలు:" }
  };
  var inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

  // Only render a mailto link for a plain, well-formed address.
  function Mail(label, addr, fallback) {
    return /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(addr || "")
      ? h("p", null, label + " ", h("a", { href: "mailto:" + addr }, addr)) : P(fallback);
  }

  var C = CONFIG.calc;
  function subsidyFor(kw) { if (kw <= 0) return 0; if (kw >= 3) return 78000; if (kw <= 2) return Math.round(30000 * kw); return Math.round(60000 + 18000 * (kw - 2)); }
  function num(v) { var n = parseFloat(v); return isFinite(n) && n > 0 ? n : 0; }
  function estimate(units, bill) {
    if (!units || !bill || units > 5000 || bill > 500000) return null;
    var rate = bill / units, need = units / (C.yieldKwhPerKwDay * 30);
    var kw = Math.max(1, Math.ceil(need * 2) / 2), big = kw > 10; if (big) kw = 10;
    var offset = Math.min(units, kw * C.yieldKwhPerKwDay * 30), annual = offset * rate * 12, cost = kw * C.costPerKw, sub = subsidyFor(kw);
    var series = [], cum = 0;
    for (var y = 1; y <= C.years; y++) { cum += annual * Math.pow(1 - C.degradationPerYear, y - 1) * Math.pow(1 + C.tariffGrowthPerYear, y - 1); series.push(cum - cost); }
    return { rate: rate, kw: kw, big: big, annual: annual, cost: cost, sub: sub, payback: annual > 0 ? cost / annual : 0, paybackSub: annual > 0 ? (cost - sub) / annual : 0, series: series };
  }
  function Chart(p) {
    var s = p.series, W = 300, H = 150, pad = 24, lo = Math.min.apply(null, s.concat([0])), hi = Math.max.apply(null, s.concat([0]));
    var x = function (i) { return pad + i * (W - pad - 6) / (s.length - 1); }, y = function (v) { return H - pad - (v - lo) / ((hi - lo) || 1) * (H - pad - 8); };
    var pts = s.map(function (v, i) { return x(i) + "," + y(v); }).join(" ");
    return h("svg", { className: "chart", viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Cumulative savings minus system cost over " + s.length + " years" },
      h("line", { x1: pad, x2: W - 6, y1: y(0), y2: y(0), stroke: "#98a2b3", strokeDasharray: "4 3" }),
      h("polyline", { points: pts, fill: "none", stroke: "#ff5a1f", strokeWidth: 3 }),
      h("text", { x: pad, y: H - 6, fontSize: 10, fill: "#475467" }, "Year 1"), h("text", { x: W - 40, y: H - 6, fontSize: 10, fill: "#475467" }, "Year " + s.length),
      h("text", { x: pad + 4, y: 12, fontSize: 10, fill: "#475467" }, "Above the dashed line = system has paid for itself"));
  }
  function BillCalc() {
    var a = useState(""), units = a[0], setUnits = a[1], b = useState(""), bill = b[0], setBill = b[1];
    var r = estimate(num(units), num(bill));
    return h("div", { className: "card calc" }, h("h3", null, "Bill analyzer"),
      h("label", { className: "fld" }, "Units used in a month (kWh, from your bill)", h("input", { inputMode: "decimal", value: units, onChange: function (e) { setUnits(e.target.value); } })),
      h("label", { className: "fld" }, "Amount paid that month (INR)", h("input", { inputMode: "decimal", value: bill, onChange: function (e) { setBill(e.target.value); } })),
      r ? h("div", { className: "res", role: "status" },
        h("p", null, "Suggested system: ", h("b", null, r.kw + " kW"), " (roof space about " + Math.round(r.kw * C.sqftPerKw) + " sq ft)."),
        r.big ? P("Your usage is above 10 kW worth. Contact us for a larger system.", "note") : null,
        h("p", null, "Your average rate: ", h("b", null, inr.format(r.rate) + " per unit")),
        h("p", null, "Estimated yearly saving: ", h("b", null, inr.format(Math.round(r.annual)))),
        h("p", null, "Indicative system cost: ", h("b", null, inr.format(Math.round(r.cost)))),
        h("p", null, "Payback without subsidy: ", h("b", null, r.payback.toFixed(1) + " years")),
        h("p", null, "If a subsidy applied (" + inr.format(r.sub) + "): ", h("b", null, r.paybackSub.toFixed(1) + " years")),
        h(Chart, { series: r.series }),
        P("Conservative estimate: it uses your average rate, though solar usually offsets your most expensive units first.", "note"))
      : P("Enter both numbers from one electricity bill. Max 5,000 units and Rs 5,00,000.", "note"));
  }
  function SubsidyCheck() {
    var a = useState("home"), prop = a[0], setProp = a[1], b = useState("own"), roof = b[0], setRoof = b[1], c = useState("no"), prior = c[0], setPrior = c[1];
    var out = prop !== "home" ? "PM Surya Ghar covers residential households only, so a small business is not covered by this scheme."
      : prior === "yes" ? "A property generally gets one subsidy, so you may not be eligible again."
      : roof !== "own" ? "You usually need the right to use the roof. Check with your DISCOM."
      : "You may be eligible. Eligibility is decided by the scheme and your DISCOM.";
    function sel(label, val, set, opts) { return h("label", { className: "fld" }, label, h("select", { value: val, onChange: function (e) { set(e.target.value); } }, opts.map(function (o) { return h("option", { key: o[0], value: o[0] }, o[1]); }))); }
    return h("div", { className: "card calc" }, h("h3", null, "Subsidy checker"),
      sel("Property", prop, setProp, [["home", "Home or apartment"], ["small_commercial", "Small business"]]),
      sel("Roof", roof, setRoof, [["own", "I own or control the roof"], ["rented", "Rented or shared"]]),
      sel("Earlier solar subsidy on this property?", prior, setPrior, [["no", "No"], ["yes", "Yes"], ["unsure", "Not sure"]]),
      h("p", { role: "status" }, h("b", null, out)),
      P("Central subsidy for homes: Rs 30,000 for 1 kW, Rs 60,000 for 2 kW, Rs 78,000 for 3 kW or more. Source: " + C.subsidySource + ". It is paid after installation and inspection.", "note"),
      P("The subsidy needs an MNRE-empanelled installer. Tengo Solar is not empanelled yet, so we cannot process subsidy applications at this time.", "note"));
  }
  function Sec(p) { return h("section", { className: p.alt ? "alt" : "", id: p.id }, h("div", { className: "wrap" }, p.children)); }
  function P(text, cls) { return h("p", { className: cls || "" }, text); }


  var F = CONFIG.form;
  function QuoteForm() {
    var s = useState("idle"), status = s[0], setStatus = s[1];
    var tk = useState(""), token = tk[0], setToken = tk[1];
    var dt = useState(""), det = dt[0], setDet = dt[1];
    var box = useRef(null);
    useEffect(function () {
      function draw() { if (box.current && window.turnstile && !box.current.hasChildNodes()) window.turnstile.render(box.current, { sitekey: F.turnstileSiteKey, callback: setToken, "expired-callback": function () { setToken(""); } }); }
      if (window.turnstile) { draw(); return; }
      var sc = document.createElement("script"); sc.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"; sc.async = true; sc.onload = draw; document.head.appendChild(sc);
    }, []);
    function send(e) {
      e.preventDefault(); if (status === "sending") return;
      var f = new FormData(e.target), body = {};
      f.forEach(function (v, k) { body[k] = v; });
      body.consent = f.get("consent") === "on"; body.turnstileToken = token;
      setStatus("sending");
      fetch(F.functionUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (x) { setDet(x.j && x.j.codes ? x.j.codes.join(", ") : ""); setStatus(x.ok ? "ok" : (x.j && x.j.error) || "error"); if (!x.ok && window.turnstile) { window.turnstile.reset(); setToken(""); } })
        .catch(function () { setStatus("error"); });
    }
    if (status === "ok") return h("div", { className: "card", role: "status" }, h("h3", null, "Thank you"), P("We received your request and will call you soon."));
    var msg = { invalid_input: "Please check the highlighted details and try again.", captcha_failed: "Spam check failed. Please try again.", rate_limited: "Too many requests. Please try again later.", error: "Something went wrong. Please try again or contact us." }[status];
    if (status === "captcha_failed" && det) msg += " Code: " + det;
    function fld(label, name, extra, el) { return h("label", { className: "fld" }, label, h(el || "input", Object.assign({ name: name }, extra))); }
    return h("form", { className: "qform", onSubmit: send, noValidate: false },
      fld("Name", "name", { required: true, maxLength: 120, autoComplete: "name" }),
      fld("Phone", "phone", { required: true, type: "tel", autoComplete: "tel" }),
      fld("Email (optional)", "email", { type: "email", maxLength: 254, autoComplete: "email" }),
      fld("Address or area", "address", { maxLength: 500 }),
      h("label", { className: "fld" }, "Property type", h("select", { name: "property_type" },
        h("option", { value: "home" }, "Independent home"), h("option", { value: "apartment" }, "Apartment"),
        h("option", { value: "small_commercial" }, "Small business"), h("option", { value: "other" }, "Other"))),
      fld("Average monthly bill (INR)", "monthly_bill_inr", { type: "number", min: 0, max: 10000000, inputMode: "numeric" }),
      fld("Message (optional)", "message", { maxLength: 2000, rows: 3 }, "textarea"),
      h("input", { name: "website", tabIndex: -1, autoComplete: "off", "aria-hidden": "true", className: "hp" }),
      h("label", { className: "chk" }, h("input", { type: "checkbox", name: "consent", required: true }),
        h("span", null, "I agree to be contacted about my quote and accept the ", h("a", { href: "#/privacy" }, "Privacy Policy"), ".")),
      h("div", { ref: box }),
      msg ? h("p", { role: "alert", className: "err" }, msg) : null,
      h("button", { className: "btn", type: "submit", disabled: !token || status === "sending" }, status === "sending" ? "Sending..." : "Get a free quote"));
  }
  function QuoteBlock() {
    return F.open && F.functionUrl && F.turnstileSiteKey ? h(QuoteForm) : P("The quote form opens soon, once our privacy policy is live.");
  }

  var Pages = {
    home: function () {
      return [
        h("div", { className: "hero", key: "a" }, h("div", { className: "wrap" },
          h("h1", null, "Cut your power bill with rooftop solar."),
          P("Homes and small businesses in " + CONFIG.region.name + ". We survey your roof, design the system and install it."),
          h("button", { className: "btn", onClick: function () { document.getElementById("quote").scrollIntoView(); } }, "Get a free quote"))),
        h(Sec, { key: "b" }, h("h2", null, "How it works"), h("div", { className: "grid" },
          [["1. Tell us your bill", "Share your monthly bill and roof details."],
           ["2. We survey and quote", "We check your roof and send a clear quote."],
           ["3. We install", "We install, then guide you through net metering."]].map(function (s) {
            return h("div", { className: "card", key: s[0] }, h("h3", null, s[0]), P(s[1])); }))),
        h(Sec, { alt: true, key: "c" }, h("h2", null, "Our credentials"),
          P("We are a new company. We will list our licences and completed installations here as we earn them.")),
        h(Sec, { id: "quote", key: "d" }, h("h2", null, "Get a free quote"), h(QuoteBlock))
      ];
    },
    about: function () {
      return h(Sec, null, h("h2", null, "About Tengo Solar"), P("Company story and team: to be written."),
        h("h2", null, "Contact"), Mail("Email:", CONFIG.contact.email, "Address, phone, hours and map link: to be added."),
        h("h2", null, "Customer reviews"), P("Real reviews will appear here, with each customer's written consent."));
    },
    services: function () {
      return [h(Sec, { key: "a" }, h("h2", null, "Solar packages"),
        P("Residential and small commercial systems. Battery storage, EV chargers and maintenance to follow."),
        h("div", { className: "grid" }, CONFIG.packages.map(function (k) {
          return h("div", { className: "card", key: k.kw }, h("h3", null, k.kw + " kW"),
            h("div", { className: "price" }, k.from ? "From " + inr.format(k.from) : "Price to be confirmed"), P(k.equipment, "note")); })),
        P("Placeholder prices. Final package prices will be confirmed before launch.", "note")),
        h(Sec, { alt: true, key: "b" }, h("h2", null, "Calculators"), h(BillCalc), h(SubsidyCheck),
          P("Estimates only, not a quote. Savings are never guaranteed. Assumptions: " + C.yieldKwhPerKwDay + " units per kW per day, " + inr.format(C.costPerKw) + " per kW indicative cost, " + (C.degradationPerYear * 100) + "% yearly panel decline, no tariff rise. Last reviewed " + C.asOf + ".", "note")),
        h(Sec, { key: "c" }, h("h2", null, "Get a free quote"), h(QuoteBlock))];
    },
    faq: function () {
      var q = [["How much does rooftop solar cost?", "Answer pending: needs verified, dated figures for Andhra Pradesh."],
               ["What subsidy is available?", "Answer pending: to be taken from official MNRE and PM Surya Ghar sources."],
               ["How does net metering work?", "Answer pending: to be confirmed with the local DISCOM."]];
      return h(Sec, null, h("h2", null, "Frequently asked questions"),
        q.map(function (x) { return h("details", { key: x[0] }, h("summary", null, x[0]), P(x[1])); }));
    },
    sponsored: function () {
      return h(Sec, null, h("h2", null, "Sponsored partners"),
        h("p", null, h("span", { className: "tag" }, "Sponsored"), " Partner listings will appear here. Sponsors never receive customer data."));
    },
    privacy: function () { return h(Sec, null, h("h2", null, "Privacy Policy"), P("Draft pending lawyer review. The quote form stays closed until this is published.")); },
    terms: function () { return h(Sec, null, h("h2", null, "Terms"), P("Draft pending lawyer review.")); }
  };

  function route() { var r = (location.hash || "").replace(/^#\/?/, ""); return Pages[r] ? r : "home"; }

  function App() {
    var s1 = useState(route()), page = s1[0], setPage = s1[1];
    var s2 = useState(function () { try { return localStorage.getItem("lang") === "te" ? "te" : "en"; } catch (e) { return "en"; } }), lang = s2[0], setLang = s2[1];
    useEffect(function () {
      function on() { setPage(route()); window.scrollTo(0, 0); }
      window.addEventListener("hashchange", on); return function () { window.removeEventListener("hashchange", on); };
    }, []);
    useEffect(function () { document.documentElement.lang = lang; }, [lang]);
    var t = T[lang];
    function toggle() { var n = lang === "en" ? "te" : "en"; try { localStorage.setItem("lang", n); } catch (e) {} setLang(n); }
    var nav = ["home", "about", "services", "faq", "sponsored"].map(function (k) {
      return h("a", { key: k, href: "#/" + k, "aria-current": k === page ? "page" : undefined }, t[k]); });
    return h("div", null,
      h("a", { className: "skip", href: "#main", onClick: function (e) { e.preventDefault(); document.getElementById("main").focus(); } }, "Skip to content"),
      h("header", { className: "site" }, h("div", { className: "wrap" },
        h("a", { className: "brand", href: "#/home" }, h("img", { src: "logo.png", alt: "", width: 40, height: 40 }), "Tengo Solar"),
        h("nav", { className: "main", "aria-label": "Main" }, nav),
        h("button", { className: "lang", type: "button", "aria-label": "Language", onClick: toggle }, t.lang))),
      h("main", { id: "main", tabIndex: -1 }, Pages[page]()),
      h("footer", { className: "site" }, h("div", { className: "wrap" },
        Mail(t.contactLabel, CONFIG.contact.email, t.contact), Mail(t.grievanceLabel, CONFIG.contact.grievanceEmail, t.grievance),
        h("p", null, h("a", { href: "#/privacy" }, t.privacy), " | ", h("a", { href: "#/terms" }, t.terms)),
        P(t.scope, "note"))));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(h(App));
})();
