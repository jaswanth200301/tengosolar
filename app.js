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
    // Communities we sponsor. Add an entry per group. Only add groups that have agreed in writing. url must start with https://
    sponsored: [
      { name: "Clashers Union", description: "An online community for Clash of Clans players.", url: "https://clashersunion.tengosolar.com" }
    ],
    // Public read-only access to the sponsors list. The anon/publishable key is designed to be public; NEVER put the service_role key here.
    supabase: { url: "https://opojsqomgshxhtumagss.supabase.co", anonKey: "" },
    launch: "", // optional. Leave empty for now. Later e.g. "2027" or "March 2027"; it then appears on the site.
    form: { open: true, functionUrl: "https://opojsqomgshxhtumagss.supabase.co/functions/v1/quick-function", turnstileSiteKey: "0x4AAAAAAF8aTUc9Fv2iti_c", ideasUrl: "https://opojsqomgshxhtumagss.supabase.co/functions/v1/submit-idea" },
    // Calculator assumptions. ALL UNVERIFIED planning values: confirm with installer data and official sources before launch.
    calc: { asOf: "2026-11-12", yieldKwhPerKwDay: 4, costPerKw: 66667 /* from the Rs 2 lakh 3 kW price */, degradationPerYear: 0.005, tariffGrowthPerYear: 0, years: 15, sqftPerKw: 100,
      subsidySource: "MNRE PM Surya Ghar guidelines, checked 12 Nov 2026" },
    assumptions: { tariffSlabs: null, sunHours: null, costPerKw: null, subsidy: null }
  };
  // Telugu strings are drafts: TODO_REVIEW by a native Telugu speaker before publishing.
  var T = {
    en: { home: "Home", about: "About", services: "Services", faq: "FAQ", ideas: "Ideas", sponsored: "Sponsored", cta: "Get a free quote", lang: "తెలుగు",
      privacy: "Privacy Policy", terms: "Terms", contact: "Contact details: coming soon",
      grievance: "Grievance and data-request contact: to be named before launch",
      scope: "Residential and small commercial installations only.", contactLabel: "Contact:", grievanceLabel: "Grievance and data requests:" },
    te: { home: "హోమ్", about: "మా గురించి", services: "సేవలు", faq: "తరచుగా అడిగే ప్రశ్నలు", ideas: "ఆలోచనలు", sponsored: "స్పాన్సర్డ్", cta: "ఉచిత కోట్ పొందండి", lang: "English",
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

  function launchLine() { return CONFIG.launch ? "We are launching in " + CONFIG.launch + "." : "We are getting ready to launch."; }
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

  var TIERS = ["gold", "silver", "bronze"];
  function sponsorHref(u, name) {
    try {
      var x = new URL(u); if (x.protocol !== "https:") return null;
      x.searchParams.set("utm_source", "tengosolar"); x.searchParams.set("utm_medium", "sponsored");
      x.searchParams.set("utm_campaign", String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
      return x.toString();
    } catch (e) { return null; }
  }
  function Sponsors() {
    var a = useState(null), list = a[0], setList = a[1], b = useState(false), err = b[0], setErr = b[1];
    useEffect(function () {
      var S = CONFIG.supabase; if (!S.url || !S.anonKey) { setList([]); return; }
      fetch(S.url + "/rest/v1/sponsors?select=id,name,logo_url,tagline,link_url,tier", { headers: { apikey: S.anonKey } })
        .then(function (r) { if (!r.ok) throw new Error("x"); return r.json(); })
        .then(function (d) { d.sort(function (p, q) { var i = TIERS.indexOf(p.tier), j = TIERS.indexOf(q.tier); return (i < 0 ? 9 : i) - (j < 0 ? 9 : j) || String(p.name).localeCompare(q.name); }); setList(d); })
        .catch(function () { setErr(true); setList([]); });
    }, []);
    if (list === null) return P("Loading...", "note");
    if (err) return P("Sponsored partners are unavailable right now.", "note");
    if (!list.length) return P("No sponsored partners at the moment.", "note");
    return h("div", { className: "grid" }, list.map(function (x) {
      var href = sponsorHref(x.link_url, x.name), logo = /^https:\/\//.test(x.logo_url || "") ? x.logo_url : null;
      return h("div", { className: "card", key: x.id }, h("span", { className: "tag" }, "Sponsored"),
        logo ? h("img", { src: logo, alt: x.name + " logo", loading: "lazy", className: "spl" }) : null,
        h("h3", null, x.name), x.tagline ? P(x.tagline) : null,
        href ? h("a", { href: href, target: "_blank", rel: "sponsored noopener noreferrer" }, "Visit website") : null);
    }));
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
      var sc = document.createElement("script"); sc.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"; sc.async = true; sc.setAttribute("data-ts", "1"); sc.addEventListener("load", draw); document.head.appendChild(sc);
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
    if (status === "ok") return h("div", { className: "card", role: "status" }, h("h3", null, "Thank you"), P("We have noted your interest and will contact you when we begin operations" + (CONFIG.launch ? " (expected " + CONFIG.launch + ")" : "") + "."));
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
        h("span", null, "I agree to be contacted by Tengo Solar about my interest and when it begins operations, and I accept the ", h("a", { href: "#/privacy" }, "Privacy Notice"), ".")),
      h("div", { ref: box }),
      msg ? h("p", { role: "alert", className: "err" }, msg) : null,
      h("button", { className: "btn", type: "submit", disabled: !token || status === "sending" }, status === "sending" ? "Sending..." : "Register interest"));
  }

  var SECTORS = [["energy", "Energy and solar"], ["home", "Home and living"], ["education", "Education"], ["health", "Health"], ["agri", "Agriculture"], ["transport", "Transport"], ["tech", "Technology"], ["other", "Something else"]];
  var ERRMSG = { invalid_input: "Please check your details and try again.", captcha_failed: "Spam check failed. Please try again.", rate_limited: "Too many submissions. Please try again later.", error: "Something went wrong. Please try again." };
  function IdeaForm() {
    var s = useState("idle"), status = s[0], setStatus = s[1], tk = useState(""), token = tk[0], setToken = tk[1], box = useRef(null);
    useEffect(function () {
      function draw() { if (box.current && window.turnstile && !box.current.hasChildNodes()) window.turnstile.render(box.current, { sitekey: F.turnstileSiteKey, callback: setToken, "expired-callback": function () { setToken(""); } }); }
      if (window.turnstile) { draw(); return; }
      var sc = document.querySelector("script[data-ts]") || document.createElement("script");
      if (!sc.src) { sc.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"; sc.async = true; sc.setAttribute("data-ts", "1"); document.head.appendChild(sc); }
      sc.addEventListener("load", draw);
    }, []);
    function send(e) {
      e.preventDefault(); if (status === "sending") return;
      var f = new FormData(e.target), body = {};
      f.forEach(function (v, k) { body[k] = v; });
      body.consent = f.get("consent") === "on"; body.turnstileToken = token; setStatus("sending");
      fetch(F.ideasUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (x) { setStatus(x.ok ? "ok" : (x.j && x.j.error) || "error"); if (!x.ok && window.turnstile) { window.turnstile.reset(); setToken(""); } })
        .catch(function () { setStatus("error"); });
    }
    if (status === "ok") return h("div", { className: "card", role: "status" }, h("h3", null, "Thank you"), P("We received your idea. We read every submission, but cannot reply to each one."));
    var msg = ERRMSG[status];
    function fld(label, name, extra, el) { return h("label", { className: "fld" }, label, h(el || "input", Object.assign({ name: name }, extra))); }
    return h("form", { className: "qform", onSubmit: send },
      h("label", { className: "fld" }, "Area", h("select", { name: "sector" }, SECTORS.map(function (o) { return h("option", { key: o[0], value: o[0] }, o[1]); }))),
      fld("Idea title", "title", { required: true, maxLength: 120 }),
      fld("Describe the problem and your idea", "body", { required: true, maxLength: 2000, rows: 6 }, "textarea"),
      fld("Your name (optional)", "name", { maxLength: 120, autoComplete: "name" }),
      fld("Email, if you want us to reach you (optional)", "email", { type: "email", maxLength: 254, autoComplete: "email" }),
      h("input", { name: "website", tabIndex: -1, autoComplete: "off", "aria-hidden": "true", className: "hp" }),
      h("label", { className: "chk" }, h("input", { type: "checkbox", name: "consent", required: true }),
        h("span", null, "This idea is mine to share. I understand Tengo Solar may use it without payment or obligation to me, and I accept the ", h("a", { href: "#/privacy" }, "Privacy Notice"), ".")),
      h("div", { ref: box }),
      msg ? h("p", { role: "alert", className: "err" }, msg) : null,
      h("button", { className: "btn", type: "submit", disabled: !token || status === "sending" }, status === "sending" ? "Sending..." : "Send idea"));
  }
  function QuoteBlock() {
    return F.open && F.functionUrl && F.turnstileSiteKey ? h("div", null, P("We are not taking installation bookings yet." + (CONFIG.launch ? " Expected start: " + CONFIG.launch + ". Dates may change." : " We will contact you when we open."), "note"), h(QuoteForm)) : P("The quote form opens soon, once our privacy policy is live.");
  }

  var Pages = {
    home: function () {
      return [
        h("div", { className: "hero", key: "a" }, h("div", { className: "wrap" },
          h("h1", null, "Cut your power bill with rooftop solar."),
          P("Homes and small businesses in " + CONFIG.region.name + ". " + launchLine() + " Register your interest and we will contact you as soon as we begin installations."),
          h(