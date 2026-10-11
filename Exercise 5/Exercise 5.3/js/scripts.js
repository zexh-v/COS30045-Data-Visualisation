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

    document.addEventListener("click", function (event) {
      if (navLinks.classList.contains("open")) {
        if (!navLinks.contains(event.target) && !navToggle.contains(event.target)) {
          navLinks.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      }
    });
  }

  // ---- Smooth Navigation & Scrollspy for Section Anchors ----
  var navLinksItems = document.querySelectorAll(".nav-links a[href^='#']");
  var sections = document.querySelectorAll("main section[id]");

  // Update active navigation pill based on scroll position
  function updateActiveNavLink() {
    var scrollPosition = window.scrollY + 140; // offset below sticky header

    var currentSectionId = "";
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute("id");
      }
    });

    navLinksItems.forEach(function (link) {
      if (currentSectionId && link.getAttribute("href") === "#" + currentSectionId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // Handle smooth scroll clicks on navigation buttons
  navLinksItems.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var targetId = this.getAttribute("href");
      var targetSection = document.querySelector(targetId);

      if (targetSection) {
        event.preventDefault();

        // Close mobile nav menu if open
        if (navLinks && navLinks.classList.contains("open")) {
          navLinks.classList.remove("open");
          if (navToggle) navToggle.setAttribute("aria-expanded", "false");
        }

        // Scroll so the badge and heading are positioned right below the header
        var header = document.querySelector(".site-header");
        var headerHeight = header ? header.offsetHeight : 72;
        var targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - (headerHeight + 16);

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });

        // Set active link immediately
        navLinksItems.forEach(function (l) { l.classList.remove("active"); });
        link.classList.add("active");

        // Update URL hash without jumping
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });

});
