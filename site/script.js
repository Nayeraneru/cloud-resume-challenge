/* ==========================================================
   Resume site — Nayera Shafik
   1. Apply the saved theme immediately (loaded in <head>)
   2. Theme toggle and active section in the nav
   3. Visitor counter (POST to API on page load)
   ========================================================== */

(function () {
  "use strict";

  var STORAGE_KEY = "theme";
  var THEME_COLORS = { light: "#F4F6F9", dark: "#0E1B33" };
  var root = document.documentElement;
  var darkQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function readSaved() {
    try {
      var value = localStorage.getItem(STORAGE_KEY);
      return value === "light" || value === "dark" ? value : null;
    } catch (e) {
      return null;
    }
  }

  function save(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      /* storage can be blocked; the theme still changes for this visit */
    }
  }

  function currentTheme() {
    var explicit = root.getAttribute("data-theme");
    if (explicit) return explicit;
    return darkQuery && darkQuery.matches ? "dark" : "light";
  }

  // 1. Runs before the page paints, so there is no flash of the wrong theme.
  var saved = readSaved();
  if (saved) root.setAttribute("data-theme", saved);

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.getElementById("theme-toggle");
    var themeMeta = document.querySelector('meta[name="theme-color"]');

    // 2a. Theme toggle
    function syncThemeUI() {
      var theme = currentTheme();
      if (toggle) toggle.textContent = theme === "dark" ? "Light mode" : "Dark mode";
      if (themeMeta) themeMeta.setAttribute("content", THEME_COLORS[theme]);
    }

    if (toggle) {
      toggle.hidden = false;
      toggle.addEventListener("click", function () {
        var next = currentTheme() === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        save(next);
        syncThemeUI();
      });
    }

    if (darkQuery) {
      var onSystemChange = function () {
        if (!readSaved() && !root.getAttribute("data-theme")) syncThemeUI();
      };
      if (darkQuery.addEventListener) darkQuery.addEventListener("change", onSystemChange);
      else if (darkQuery.addListener) darkQuery.addListener(onSystemChange);
    }

    syncThemeUI();

    // 2b. Mark the section in view in the top nav
    if ("IntersectionObserver" in window) {
      var links = Array.prototype.slice.call(document.querySelectorAll('.topbar nav a[href^="#"]'));
      var byId = {};
      links.forEach(function (link) {
        byId[link.getAttribute("href").slice(1)] = link;
      });

      function setCurrent(id) {
        links.forEach(function (link) {
          if (link === byId[id]) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      }

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) setCurrent(entry.target.id);
          });
        },
        { rootMargin: "-30% 0px -60% 0px" }
      );

      Object.keys(byId).forEach(function (id) {
        var section = document.getElementById(id);
        if (section) observer.observe(section);
      });
    }

    // ========================================================
    // 3. Visitor counter — POST to the API, show the result.
    //    Must run inside DOMContentLoaded: the <span> only
    //    exists after the browser has parsed the body.
    // ========================================================

    var COUNTER_API_URL =
      "https://6f6iqwa6jl.execute-api.eu-central-1.amazonaws.com/count";

    var countEl = document.getElementById("view-count");

    if (countEl) {
      fetch(COUNTER_API_URL, { method: "POST" })
        .then(function (response) {
          if (!response.ok) throw new Error("HTTP " + response.status);
          return response.json();
        })
        .then(function (data) {
          countEl.textContent = String(data.count);
        })
        .catch(function () {
          // If the API is down, the page itself must stay intact.
          countEl.textContent = "unavailable";
        });
    }
  });
})();