document.addEventListener("DOMContentLoaded", function () {

  // ---- Footer: current year ----
  var yearSpan = document.getElementById("currentYear");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ---- Dark / Light Theme Toggle ----
  var themeToggle = document.getElementById("themeToggle");
  var themeToggleText = themeToggle ? themeToggle.querySelector(".theme-toggle-text") : null;

  function updateThemeUI(theme) {
    var isDark = theme === "dark";
    if (themeToggle) {
      themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
      themeToggle.setAttribute("title", isDark ? "Switch to light theme" : "Switch to dark theme");
      themeToggle.setAttribute("aria-pressed", isDark ? "true" : "false");
    }
    if (themeToggleText) {
      themeToggleText.textContent = isDark ? "Dark" : "Light";
    }
  }

  function setTheme(theme, savePreference) {
    document.documentElement.setAttribute("data-theme", theme);
    if (savePreference) {
      try {
        localStorage.setItem("theme", theme);
      } catch (err) {
        console.warn("localStorage unavailable:", err);
      }
    }
    updateThemeUI(theme);
  }

  // Sync initial UI state based on current theme attribute or saved/system preference
  var currentTheme = document.documentElement.getAttribute("data-theme") || (function () {
    try {
      var saved = localStorage.getItem("theme");
      if (saved) return saved;
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    } catch (e) {}
    return "light";
  })();

  setTheme(currentTheme, false);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var activeTheme = document.documentElement.getAttribute("data-theme") || "light";
      var nextTheme = activeTheme === "dark" ? "light" : "dark";
      setTheme(nextTheme, true);
    });
  }

  // Listen for system theme changes if user has not manually set a preference
  if (window.matchMedia) {
    var colorSchemeMedia = window.matchMedia("(prefers-color-scheme: dark)");
    colorSchemeMedia.addEventListener("change", function (e) {
      try {
        if (!localStorage.getItem("theme")) {
          setTheme(e.matches ? "dark" : "light", false);
        }
      } catch (err) {}
    });
  }

  // ---- Mobile navigation toggle ----
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close mobile nav when clicking outside
    document.addEventListener("click", function (event) {
      if (navLinks.classList.contains("open")) {
        if (!navLinks.contains(event.target) && !navToggle.contains(event.target)) {
          navLinks.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      }
    });
  }

  // ---- FAQ accordion (Home page) ----
  var faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(function (item) {
    var button = item.querySelector(".faq-question");

    button.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");

      // Close all other FAQ items first (single-open accordion behaviour)
      faqItems.forEach(function (otherItem) {
        otherItem.classList.remove("open");
        otherItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });

      // Re-open the clicked item if it was not already open
      if (!isOpen) {
        item.classList.add("open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

});
// Interactive Appliance Energy Calculator (Televisions page)
// Demonstrates: event handling, DOM reading/writing,
// client-side calculation, and input validation.

document.addEventListener("DOMContentLoaded", function () {

  var form = document.getElementById("calcForm");
  if (!form) return; // Only run on the Televisions page

  var applianceSelect = document.getElementById("applianceSelect");
  var wattInput = document.getElementById("wattInput");
  var hoursInput = document.getElementById("hoursInput");
  var priceInput = document.getElementById("priceInput");

  var wattError = document.getElementById("wattError");
  var hoursError = document.getElementById("hoursError");
  var priceError = document.getElementById("priceError");

  var resetBtn = document.getElementById("resetBtn");

  var resultsPlaceholder = document.getElementById("resultsPlaceholder");
  var resultsList = document.getElementById("resultsList");
  var resDaily = document.getElementById("resDaily");
  var resMonthly = document.getElementById("resMonthly");
  var resYearly = document.getElementById("resYearly");
  var resCostMonthly = document.getElementById("resCostMonthly");
  var resCostYearly = document.getElementById("resCostYearly");

  // ---- When a preset model is chosen, populate the wattage field ----
  applianceSelect.addEventListener("change", function () {
    var val = applianceSelect.value;

    if (val === "" ) {
      return;
    }

    if (val === "custom") {
      wattInput.value = "";
      wattInput.focus();
      return;
    }

    wattInput.value = val;
  });

  // ---- Validation helpers ----
  function clearErrors() {
    wattError.textContent = "";
    hoursError.textContent = "";
    priceError.textContent = "";
  }

  function validateInputs(watts, hours, price) {
    var valid = true;

    if (isNaN(watts) || watts <= 0) {
      wattError.textContent = "Please enter a valid wattage greater than 0.";
      valid = false;
    }

    if (isNaN(hours) || hours < 0 || hours > 24) {
      hoursError.textContent = "Please enter hours of use between 0 and 24.";
      valid = false;
    }

    if (isNaN(price) || price < 0) {
      priceError.textContent = "Please enter a valid electricity price (0 or more).";
      valid = false;
    }

    return valid;
  }

  // ---- Calculation + dynamic DOM update ----
  function calculate(watts, hours, priceCentsPerKwh) {
    var dailyKwh = (watts * hours) / 1000;
    var monthlyKwh = dailyKwh * 30;
    var yearlyKwh = dailyKwh * 365;

    var priceDollarsPerKwh = priceCentsPerKwh / 100;
    var costMonthly = monthlyKwh * priceDollarsPerKwh;
    var costYearly = yearlyKwh * priceDollarsPerKwh;

    resDaily.textContent = dailyKwh.toFixed(3) + " kWh";
    resMonthly.textContent = monthlyKwh.toFixed(2) + " kWh";
    resYearly.textContent = yearlyKwh.toFixed(1) + " kWh";
    resCostMonthly.textContent = "$" + costMonthly.toFixed(2);
    resCostYearly.textContent = "$" + costYearly.toFixed(2);

    resultsPlaceholder.hidden = true;
    resultsList.hidden = false;
  }

  // ---- Form submit handler ----
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors();

    var watts = parseFloat(wattInput.value);
    var hours = parseFloat(hoursInput.value);
    var price = parseFloat(priceInput.value);

    if (!validateInputs(watts, hours, price)) {
      resultsPlaceholder.hidden = false;
      resultsPlaceholder.textContent = "Please fix the highlighted fields above and try again.";
      resultsList.hidden = true;
      return;
    }

    calculate(watts, hours, price);
  });

  // ---- Reset handler ----
  resetBtn.addEventListener("click", function () {
    form.reset();
    clearErrors();
    resultsList.hidden = true;
    resultsPlaceholder.hidden = false;
    resultsPlaceholder.textContent = "Enter your appliance details and press Calculate to see results here.";
  });

});