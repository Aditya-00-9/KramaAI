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
    iframe.src = url;
    wrap.innerHTML = "";
    wrap.appendChild(iframe);
    wrap.hidden = false;
    wrap.classList.add("schedule-embed-wrap--active");
    var hint = document.getElementById("schedule-embed-browser-note");
    if (hint) hint.hidden = false;
  }

  function initSocialLinks() {
    var wrap = document.getElementById("footer-social");
    if (!wrap) return;
    var links = [
      { label: "LinkedIn", url: cfg.linkedInUrl },
      { label: "YouTube", url: cfg.youtubeUrl },
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

  applyScheduleLinks();
  initScheduleEmbed();
  initSocialLinks();

  var themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var on = document.body.classList.toggle("accent-soft");
      themeToggle.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

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

  if (demoForm && formFeedback) {
    demoForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!WEB3FORMS_ACCESS_KEY) {
        formFeedback.textContent =
          "We could not send your request right now. Please email sales@kramaai.com or use Schedule a call.";
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
      var company = (document.getElementById("form-company") || {}).value || "";
      var centers = (document.getElementById("form-centers") || {}).value || "";
      var appointmentDate = (document.getElementById("form-appointment-date") || {}).value || "";
      var appointmentTime = (document.getElementById("form-appointment-time") || {}).value || "";
      var context = (document.getElementById("form-context") || {}).value || "";

      var message =
        "Preferred demo appointment: " +
        (appointmentDate || "—") +
        (appointmentTime ? " at " + appointmentTime : "") +
        "\n\n" +
        "Organization: " +
        (company || "—") +
        "\n" +
        "Centers: " +
        (centers || "—") +
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
