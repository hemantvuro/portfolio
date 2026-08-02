// Tiny progressive-enhancement JS: mobile nav toggle + subtle scroll reveals.
(function () {
  "use strict";

  // Mobile nav
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) links.classList.remove("open");
    });
  }

  // Scroll reveals
  var revealables = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !revealables.length) {
    revealables.forEach(function (el) { el.classList.add("in"); });
    return;
  }
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  revealables.forEach(function (el) { io.observe(el); });

  // Lightbox: click a case-study image (or any .zoomable) to view it enlarged.
  var zoomables = document.querySelectorAll(".cs-cover img, figure.shot img, .zoomable");
  if (zoomables.length) {
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.innerHTML = '<button class="lb-close" aria-label="Close">\u00d7</button><img alt="" />';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector("img");

    function openLb(src, alt) {
      lbImg.src = src;
      lbImg.alt = alt || "";
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function closeLb() {
      lb.classList.remove("open");
      document.body.style.overflow = "";
    }

    zoomables.forEach(function (img) {
      img.classList.add("zoomable");
      img.addEventListener("click", function () { openLb(img.currentSrc || img.src, img.alt); });
    });
    lb.addEventListener("click", closeLb);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lb.classList.contains("open")) closeLb();
    });
  }
})();
