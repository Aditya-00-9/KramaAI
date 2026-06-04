(function () {
  "use strict";

  var cfg = (typeof window !== "undefined" && window.KRAMA_CONFIG) || {};
  var WEB3FORMS_ACCESS_KEY = cfg.web3formsAccessKey || "";
  var SCHEDULE_CALL_URL = cfg.scheduleCallUrl || "";

  function applyScheduleLinks() {
    document.querySelectorAll("a[data-schedule-call]").forEach(function (link) {
      var fallback =
        link.getAttribute("data-schedule-fallback") || link.getAttribute("href") || "#schedule";
      if (SCHEDULE_CALL_URL && SCHEDULE_CALL_URL.trim()) {
        link.href = SCHEDULE_CALL_URL.trim();
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      } else {
        link.href = fallback.charAt(0) === "#" ? fallback : "#schedule";
        link.removeAttribute("target");
        link.removeAttribute("rel");
      }
    });
  }

  function calendlyEmbedSrc(url) {
    try {
      var parsed = new URL(url);
      if (parsed.hostname.indexOf("calendly.com") === -1) return url;
      if (!parsed.searchParams.has("embed_type")) {
        parsed.searchParams.set("embed_type", "Inline");
      }
      return parsed.toString();
    } catch (e) {
      return url;
    }
  }

  function initScheduleEmbed() {
    var wrap = document.getElementById("schedule-embed");
    if (!wrap || !SCHEDULE_CALL_URL || !SCHEDULE_CALL_URL.trim()) return;
    var url = SCHEDULE_CALL_URL.trim();
    if (url.indexOf("calendly.com") === -1) return;
    var iframe = document.createElement("iframe");
    iframe.className = "schedule-embed-iframe";
    iframe.title = "Pick a time — Calendly";
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.src = calendlyEmbedSrc(url);
    wrap.innerHTML = "";
    wrap.appendChild(iframe);
    wrap.hidden = false;
    wrap.classList.add("schedule-embed-wrap--active");
    var hint = document.getElementById("schedule-embed-browser-note");
    if (hint) hint.hidden = false;
    document.querySelectorAll(".schedule-fallback-actions").forEach(function (el) {
      el.hidden = true;
    });
  }

  function initSocialLinks() {
    var wrap = document.getElementById("footer-social");
    if (!wrap) return;
    var links = [
      { label: "LinkedIn", url: cfg.linkedInUrl },
      { label: "Instagram", url: cfg.instagramUrl },
      { label: "Twitter / X", url: cfg.twitterUrl },
    ].filter(function (item) {
      return item.url && String(item.url).trim();
    });
    if (!links.length) {
      wrap.hidden = true;
      return;
    }
    wrap.innerHTML = "";
    links.forEach(function (item) {
      var a = document.createElement("a");
      a.href = item.url.trim();
      a.textContent = item.label;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      wrap.appendChild(a);
    });
  }

  function initContactEmails() {
    var email = (cfg.contactEmail || "hello@kramaai.com").trim();
    document.querySelectorAll("[data-contact-email]").forEach(function (el) {
      var prefix = el.getAttribute("data-contact-prefix") || "";
      el.href = "mailto:" + email + (prefix ? "?subject=" + encodeURIComponent(prefix) : "");
      if (el.hasAttribute("data-contact-text")) {
        el.textContent = email;
      }
    });
  }

  function initRoiCalculator() {
    var locationsEl = document.getElementById("roi-locations");
    var hoursEl = document.getElementById("roi-hours");
    var rateEl = document.getElementById("roi-rate");
    var outputEl = document.getElementById("roi-output");
    if (!locationsEl || !hoursEl || !rateEl || !outputEl) return;

    var locationsVal = document.getElementById("roi-locations-val");
    var hoursVal = document.getElementById("roi-hours-val");
    var rateVal = document.getElementById("roi-rate-val");

    function formatMoney(n) {
      return "$" + Math.round(n).toLocaleString("en-US");
    }

    function update() {
      var locations = Number(locationsEl.value) || 1;
      var hours = Number(hoursEl.value) || 1;
      var rate = Number(rateEl.value) || 10;
      if (locationsVal) locationsVal.textContent = String(locations);
      if (hoursVal) hoursVal.textContent = String(hours);
      if (rateVal) rateVal.textContent = formatMoney(rate);

      var monthlySpend = locations * hours * rate * 4.33;
      var lowSave = monthlySpend * 0.6;
      var highSave = monthlySpend * 0.8;
      outputEl.innerHTML =
        "<p>You are spending approximately <strong>" +
        formatMoney(monthlySpend) +
        "</strong>/month on manual admin work across your team.</p>" +
        "<p>KramaAI customers report recovering <strong>60–80%</strong> of that time. Your estimated monthly savings: <strong>" +
        formatMoney(lowSave) +
        " – " +
        formatMoney(highSave) +
        "</strong>.</p>";
    }

    [locationsEl, hoursEl, rateEl].forEach(function (el) {
      el.addEventListener("input", update);
    });
    update();
  }

  applyScheduleLinks();
  initScheduleEmbed();
  initSocialLinks();
  initContactEmails();
  initRoiCalculator();

  var menuToggle = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".nav");
  var navShell = document.querySelector(".nav-shell");
  var headerActions = document.querySelector(".header-actions");

  if (menuToggle && nav && headerActions) {
    menuToggle.addEventListener("click", function () {
      var isOpen = menuToggle.classList.toggle("is-open");
      nav.classList.toggle("is-open", isOpen);
      headerActions.classList.toggle("is-open", isOpen);
      if (navShell) navShell.classList.toggle("is-open", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    nav.addEventListener("click", function (event) {
      if (event.target.tagName === "A" && menuToggle.classList.contains("is-open")) {
        menuToggle.click();
      }
    });
  }

  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    var button = item.querySelector(".faq-question");
    if (!button) return;
    button.addEventListener("click", function () {
      var isOpen = item.classList.toggle("is-open");
      if (!isOpen) return;
      faqItems.forEach(function (other) {
        if (other !== item) other.classList.remove("is-open");
      });
    });
  });

  var demoForm = document.getElementById("demo-request-form");
  var formFeedback = document.getElementById("form-feedback");
  var submitBtn = document.getElementById("form-submit-btn");

  document.querySelectorAll("[data-form-prefill]").forEach(function (link) {
    link.addEventListener("click", function () {
      var subject = link.getAttribute("data-form-prefill") || "";
      var ctx = document.getElementById("form-context");
      if (ctx && subject) {
        ctx.value = "Inquiry: " + subject;
      }
    });
  });

  if (demoForm && formFeedback) {
    demoForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!WEB3FORMS_ACCESS_KEY) {
        formFeedback.textContent =
          "We could not send your request right now. Please email " +
          (cfg.contactEmail || "hello@kramaai.com") +
          " or book a demo on the calendar.";
        formFeedback.classList.remove("form-feedback--ok");
        formFeedback.classList.add("form-feedback--err");
        return;
      }

      var honeypot = demoForm.querySelector('input[name="botcheck"]');
      if (honeypot && honeypot.value) {
        return;
      }

      var name = (document.getElementById("form-name") || {}).value || "";
      var email = (document.getElementById("form-email") || {}).value || "";
      var centerType = (document.getElementById("form-center-type") || {}).value || "";
      var centers = (document.getElementById("form-centers") || {}).value || "";
      var currentSoftware = (document.getElementById("form-current-software") || {}).value || "";
      var context = (document.getElementById("form-context") || {}).value || "";

      var message =
        "Center type: " +
        (centerType || "—") +
        "\n" +
        "Locations: " +
        (centers || "—") +
        "\n" +
        "Current software: " +
        (currentSoftware || "—") +
        "\n\n" +
        "Notes:\n" +
        (context || "—");

      if (submitBtn) {
        submitBtn.disabled = true;
      }
      formFeedback.textContent = "Sending…";
      formFeedback.classList.remove("form-feedback--ok", "form-feedback--err");

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: "KramaAI — New demo / appointment request",
          name: name,
          email: email,
          message: message,
          botcheck: "",
        }),
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          if (result.ok && result.data && result.data.success) {
            formFeedback.textContent =
              "Thanks — we received your request and will confirm your demo time by email.";
            formFeedback.classList.add("form-feedback--ok");
            demoForm.reset();
          } else {
            formFeedback.textContent =
              (result.data && result.data.message) ||
              "Something went wrong. Please try again or email sales@kramaai.com.";
            formFeedback.classList.add("form-feedback--err");
          }
        })
        .catch(function () {
          formFeedback.textContent = "Network error. Please try again shortly.";
          formFeedback.classList.add("form-feedback--err");
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
          }
        });
    });
  }
})();
