(function () {
  "use strict";

  /** Paste your free key from https://web3forms.com — emails go to the address you verify there. */
  var WEB3FORMS_ACCESS_KEY = "";

  /**
   * Public booking URL (Calendly, Cal.com, Google Appointment Schedules, etc.).
   * Example: https://calendly.com/your-name/30min
   * Leave empty: "Schedule a call" links scroll to #schedule on the homepage instead.
   */
  var SCHEDULE_CALL_URL = "";

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

  applyScheduleLinks();
  initScheduleEmbed();

  // Accent / theme toggle (cosmetic)
  var themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var on = document.body.classList.toggle("accent-soft");
      themeToggle.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  // Mobile navigation toggle
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

  // FAQ accordion
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    var button = item.querySelector(".faq-question");
    if (!button) return;
    button.addEventListener("click", function () {
      var isOpen = item.classList.toggle("is-open");
      if (!isOpen) return;
      // Close others
      faqItems.forEach(function (other) {
        if (other !== item) other.classList.remove("is-open");
      });
    });
  });

  // Contact / demo request → Web3Forms (email notification to owner)
  var demoForm = document.getElementById("demo-request-form");
  var formFeedback = document.getElementById("form-feedback");
  var submitBtn = document.getElementById("form-submit-btn");

  if (demoForm && formFeedback) {
    demoForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!WEB3FORMS_ACCESS_KEY) {
        formFeedback.textContent =
          "Add your Web3Forms access key in script.js (WEB3FORMS_ACCESS_KEY) to enable email notifications.";
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
              (result.data && result.data.message) || "Something went wrong. Please try again or email us directly.";
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

