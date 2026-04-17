(function () {
  "use strict";

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
})();

