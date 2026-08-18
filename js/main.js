(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.body.getAttribute("data-root") || "";

  /* ---------- preloader ---------- */
  var pre = document.querySelector(".preloader");
  var word = document.querySelector(".preloader-word");
  var greetings = ["Hello", "Bonjour", "स्वागत है", "Ciao", "Olá", "Hallo", "こんにちは", "Hola", "Hello"];
  var greetTimer = null;
  var holdTimer = null;
  var skipHello = document.documentElement.classList.contains("skip-hello");

  function finishPreloader() {
    if (!pre || pre.classList.contains("is-done")) return;
    clearInterval(greetTimer);
    clearTimeout(holdTimer);
    pre.classList.add("is-done");
    document.documentElement.classList.add("is-ready");
    document.body.style.overflow = "";
    try { sessionStorage.setItem("hv-hello", "1"); } catch (e) {}
  }
  if (pre && !reduce && !skipHello) document.body.style.overflow = "hidden";

  if (pre && word && !reduce && !skipHello) {
    var i = 0;
    greetTimer = setInterval(function () {
      i += 1;
      if (i >= greetings.length) {
        clearInterval(greetTimer);
        holdTimer = setTimeout(finishPreloader, 560);
        return;
      }
      word.textContent = greetings[i];
    }, 280);
    pre.addEventListener("click", finishPreloader);
    pre.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") finishPreloader();
    });
    pre.tabIndex = 0;
  } else {
    finishPreloader();
  }

  window.addEventListener("pageshow", function (e) {
    if (e.persisted) finishPreloader();
  });

  /* ---------- incoming page transition ---------- */
  var panel = document.querySelector(".transition-panel");
  if (panel && !panel.querySelector(".transit-blue")) {
    panel.innerHTML = '<div class="transit-blue"></div><div class="transit-bg"></div>';
  }
  if (panel && sessionStorage.getItem("hv-transit") === "1") {
    sessionStorage.removeItem("hv-transit");
    panel.classList.add("is-cover", "is-hold");
    panel.offsetWidth;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        panel.classList.remove("is-hold");
        panel.classList.add("is-reveal");
      });
    });
    setTimeout(function () {
      panel.classList.remove("is-cover", "is-reveal", "is-hold");
    }, 1200);
  }

  /* ---------- Lenis ---------- */
  var lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.1, lerp: 0.08, smoothWheel: true });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  /* ---------- hero: twin polarities ---------- */
  (function initHeroPlay() {
    var canvas = document.getElementById("hero-play");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, running = false;
    var fills = [];
    var rings = [];
    var pointer = { x: 0, y: 0, px: 0, py: 0, active: false, down: false };
    var TRAIL = 8;
    var aligning = false;
    var quietZones = [];
    var copyInner = document.querySelector(".hero-copy-inner");
    var foldNav = document.querySelector(".fold-nav");

    function makeParticle(x, y, r) {
      return {
        ox: x, oy: y,
        x: x, y: y,
        vx: 0, vy: 0,
        r: r,
        streak: 0,
        hist: new Array(TRAIL)
      };
    }

    function addQuietEl(el, opts) {
      if (!el) return;
      var canvasRect = canvas.getBoundingClientRect();
      var r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      var padL = opts.padL != null ? opts.padL : opts.padX;
      var padR = opts.padR != null ? opts.padR : opts.padX;
      var padT = opts.padT != null ? opts.padT : opts.padY;
      var padB = opts.padB != null ? opts.padB : opts.padY;
      quietZones.push({
        x: r.left - canvasRect.left - padL,
        y: r.top - canvasRect.top - padT,
        w: r.width + padL + padR,
        h: r.height + padT + padB,
        feather: opts.feather
      });
    }

    function updateQuiet() {
      quietZones = [];
      addQuietEl(copyInner, { padX: 10, padY: 10, feather: 64 });
      addQuietEl(foldNav, { padL: -22, padR: 0, padT: -8, padB: -8, feather: 16 });
    }

    function distToRect(x, y, q) {
      var dx = 0;
      var dy = 0;
      if (x < q.x) dx = q.x - x;
      else if (x > q.x + q.w) dx = x - (q.x + q.w);
      if (y < q.y) dy = q.y - y;
      else if (y > q.y + q.h) dy = y - (q.y + q.h);
      if (dx === 0 && dy === 0) return 0;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function quietAlpha(x, y) {
      var i, q, d, a, best = 1;
      for (i = 0; i < quietZones.length; i++) {
        q = quietZones[i];
        d = distToRect(x, y, q);
        if (d === 0) return 0;
        if (d < q.feather) {
          a = d / q.feather;
          if (a < best) best = a;
        }
      }
      return best;
    }

    function spawn() {
      fills = [];
      rings = [];
      updateQuiet();
      var gap = w < 720 ? 30 : 24;
      var pad = 22;
      var cols = Math.max(8, Math.floor((w - pad * 2) / gap));
      var rows = Math.max(6, Math.floor((h - pad * 2) / gap));
      var ox = (w - (cols - 1) * gap) / 2;
      var oy = (h - (rows - 1) * gap) / 2;
      var r, c, x, y;
      for (r = 0; r < rows; r++) {
        for (c = 0; c < cols; c++) {
          x = ox + c * gap;
          y = oy + r * gap;
          if (quietAlpha(x, y) < 0.55) continue;
          if ((r + c) % 2 === 0) fills.push(makeParticle(x, y, 2.7));
          else rings.push(makeParticle(x, y, 2.5));
        }
      }
    }

    function resize() {
      var rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spawn();
    }

    function setPointer(e, down) {
      aligning = false;
      var rect = canvas.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      if (!pointer.active) {
        pointer.px = x;
        pointer.py = y;
      } else {
        pointer.px = pointer.x;
        pointer.py = pointer.y;
      }
      pointer.x = x;
      pointer.y = y;
      pointer.active = true;
      if (typeof down === "boolean") pointer.down = down;
    }

    canvas.addEventListener("pointerdown", function (e) {
      canvas.setPointerCapture(e.pointerId);
      setPointer(e, true);
    });
    canvas.addEventListener("pointermove", function (e) { setPointer(e); });
    canvas.addEventListener("pointerup", function (e) { setPointer(e, false); });
    canvas.addEventListener("pointercancel", function () {
      pointer.down = false;
      pointer.active = false;
    });
    canvas.addEventListener("pointerleave", function () {
      if (!pointer.down) pointer.active = false;
    });

    function dist(ax, ay, bx, by) {
      var dx = ax - bx, dy = ay - by;
      return Math.sqrt(dx * dx + dy * dy) || 0.0001;
    }

    function distToSeg(px, py, x1, y1, x2, y2) {
      var vx = x2 - x1, vy = y2 - y1;
      var l2 = vx * vx + vy * vy || 1;
      var t = ((px - x1) * vx + (py - y1) * vy) / l2;
      if (t < 0) t = 0;
      else if (t > 1) t = 1;
      var dx = px - (x1 + vx * t);
      var dy = py - (y1 + vy * t);
      return Math.sqrt(dx * dx + dy * dy);
    }

    function tick(list, attract, swipe, swx, swy, swLen) {
      var i, pt, d, f, radius, str, k;
      radius = pointer.down ? 280 : 200;
      str = pointer.down ? 1.05 : 0.52;
      for (i = 0; i < list.length; i++) {
        pt = list[i];
        if (pointer.active) {
          d = dist(pt.x, pt.y, pointer.x, pointer.y);
          if (d < radius) {
            f = (1 - d / radius) * str * (attract ? 1 : -1);
            pt.vx += ((pointer.x - pt.x) / d) * f * 2.15;
            pt.vy += ((pointer.y - pt.y) / d) * f * 2.15;
          }
        } else if (aligning) {
          pt.vx += (pt.ox - pt.x) * 0.12;
          pt.vy += (pt.oy - pt.y) * 0.12;
        }
        if (swipe && swLen > 0) {
          d = distToSeg(pt.x, pt.y, pointer.px, pointer.py, pointer.x, pointer.y);
          if (d < 48) {
            f = (1 - d / 48) * Math.min(2.4, swLen / 18);
            pt.vx += swx * f * 0.55;
            pt.vy += swy * f * 0.55;
            pt.streak = Math.min(1, pt.streak + 0.55);
          }
        }
        pt.vx *= aligning ? 0.78 : 0.915;
        pt.vy *= aligning ? 0.78 : 0.915;
        pt.x += pt.vx;
        pt.y += pt.vy;
        if (pt.x < 6) { pt.x = 6; pt.vx *= -0.42; }
        if (pt.y < 6) { pt.y = 6; pt.vy *= -0.42; }
        if (pt.x > w - 6) { pt.x = w - 6; pt.vx *= -0.42; }
        if (pt.y > h - 6) { pt.y = h - 6; pt.vy *= -0.42; }

        if (pt.streak > 0.04) {
          for (k = TRAIL - 1; k > 0; k--) pt.hist[k] = pt.hist[k - 1];
          pt.hist[0] = { x: pt.x, y: pt.y };
          pt.streak *= 0.9;
        } else {
          pt.streak = 0;
          pt.hist[0] = null;
        }
      }
    }

    function particlesHome(list) {
      var i, pt, dx, dy;
      for (i = 0; i < list.length; i++) {
        pt = list[i];
        dx = pt.x - pt.ox;
        dy = pt.y - pt.oy;
        if (dx * dx + dy * dy > 1.2 || Math.abs(pt.vx) > 0.2 || Math.abs(pt.vy) > 0.2) return false;
      }
      return true;
    }

    function drawTrails(list, stroke) {
      var i, k, pt, a, qa;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (i = 0; i < list.length; i++) {
        pt = list[i];
        if (pt.streak <= 0.04 || !pt.hist[0]) continue;
        qa = quietAlpha(pt.x, pt.y);
        if (qa < 0.04) continue;
        ctx.beginPath();
        ctx.moveTo(pt.hist[0].x, pt.hist[0].y);
        for (k = 1; k < TRAIL; k++) {
          if (!pt.hist[k]) break;
          ctx.lineTo(pt.hist[k].x, pt.hist[k].y);
        }
        a = (0.18 + pt.streak * 0.55) * qa;
        ctx.strokeStyle = stroke(a);
        ctx.lineWidth = 1.2 + pt.streak * 2.4;
        ctx.stroke();
      }
    }

    function drawFills() {
      var i, pt, qa;
      ctx.fillStyle = "#455ce9";
      for (i = 0; i < fills.length; i++) {
        pt = fills[i];
        qa = quietAlpha(pt.x, pt.y);
        if (qa < 0.04) continue;
        ctx.globalAlpha = qa;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function drawRings() {
      var i, pt, qa;
      ctx.lineWidth = 1.15;
      ctx.strokeStyle = "rgba(20,20,20,0.72)";
      for (i = 0; i < rings.length; i++) {
        pt = rings[i];
        qa = quietAlpha(pt.x, pt.y);
        if (qa < 0.04) continue;
        ctx.globalAlpha = qa;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r + 1.1, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    function drawStatic() {
      ctx.clearRect(0, 0, w, h);
      drawFills();
      drawRings();
    }

    function step() {
      var sx = pointer.x - pointer.px;
      var sy = pointer.y - pointer.py;
      var swLen = pointer.active ? Math.sqrt(sx * sx + sy * sy) : 0;
      var swipe = pointer.active && swLen > 28;
      var inv = swipe ? 1 / swLen : 0;
      var swx = sx * inv;
      var swy = sy * inv;

      tick(fills, !pointer.down, swipe, swx, swy, swLen);
      tick(rings, pointer.down, swipe, swx, swy, swLen);

      if (aligning && particlesHome(fills) && particlesHome(rings)) aligning = false;

      ctx.clearRect(0, 0, w, h);
      drawTrails(fills, function (a) { return "rgba(69,92,233," + a + ")"; });
      drawTrails(rings, function (a) { return "rgba(20,20,20," + a + ")"; });
      drawFills();
      drawRings();

      if (running) requestAnimationFrame(step);
    }

    resize();
    window.addEventListener("resize", resize);
    if (typeof ResizeObserver !== "undefined") {
      var quietObs = new ResizeObserver(function () {
        updateQuiet();
        if (!running) drawStatic();
      });
      if (copyInner) quietObs.observe(copyInner);
      if (foldNav) quietObs.observe(foldNav);
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        resize();
        if (!running) drawStatic();
      });
    }

    var nameEl = document.querySelector(".hero-copy h1");
    function alignAll() {
      pointer.active = false;
      pointer.down = false;
      aligning = true;
    }
    if (nameEl) {
      nameEl.addEventListener("click", alignAll);
      nameEl.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          alignAll();
        }
      });
    }

    if (!reduce) {
      running = true;
      requestAnimationFrame(step);
    } else {
      drawStatic();
    }
  })();

  /* ---------- menu ---------- */
  var menuBtn = document.querySelector(".menu-btn");
  var overlay = document.querySelector(".menu-overlay");
  function setMenu(open) {
    if (!menuBtn || !overlay) return;
    overlay.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);
    if (lenis) {
      if (open && typeof lenis.stop === "function") lenis.stop();
      else if (!open && typeof lenis.start === "function") lenis.start();
    }
  }
  if (menuBtn && overlay) {
    menuBtn.addEventListener("click", function () {
      setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
    });
    overlay.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
  }

  /* ---------- first-fold nav → circle menu ---------- */
  (function initFoldNav() {
    if (!document.body.classList.contains("page-home")) return;
    var foldNav = document.querySelector(".fold-nav");

    function updateFold() {
      var y = lenis ? lenis.scroll : (window.scrollY || document.documentElement.scrollTop || 0);
      var past = y > Math.max(120, window.innerHeight - 48);
      var compact = window.matchMedia("(max-width: 860px)").matches;
      var showMenu = past || compact;
      document.body.classList.toggle("is-past-fold", past);
      document.body.classList.toggle("is-compact-nav", compact);
      if (menuBtn) {
        menuBtn.setAttribute("aria-hidden", showMenu ? "false" : "true");
        menuBtn.tabIndex = showMenu ? 0 : -1;
        if (!showMenu && menuBtn.getAttribute("aria-expanded") === "true") setMenu(false);
      }
      if (foldNav) foldNav.setAttribute("aria-hidden", showMenu ? "true" : "false");
    }

    updateFold();
    if (lenis && typeof lenis.on === "function") lenis.on("scroll", updateFold);
    window.addEventListener("scroll", updateFold, { passive: true });
    window.addEventListener("resize", updateFold);
  })();


  /* ---------- outgoing page transitions ---------- */
  function isInternal(a) {
    if (!a || a.target === "_blank") return false;
    if (a.hasAttribute("download") || a.hasAttribute("data-resume-modal")) return false;
    var href = a.getAttribute("href") || "";
    if (!href || href.charAt(0) === "#" || href.indexOf("mailto:") === 0) return false;
    if (href.indexOf("http://") === 0 || href.indexOf("https://") === 0 || href.indexOf("//") === 0) {
      try { return a.origin === window.location.origin; } catch (err) { return false; }
    }
    return true;
  }

  if (panel) {
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (!a || !isInternal(a) || e.metaKey || e.ctrlKey || e.shiftKey) return;
      var url = a.href;
      if (!url || url === window.location.href) return;
      e.preventDefault();
      if (reduce) {
        window.location.href = url;
        return;
      }
      sessionStorage.setItem("hv-transit", "1");
      panel.classList.add("is-cover");
      setTimeout(function () { window.location.href = url; }, 860);
    });
  }

  /* ---------- hash / about smooth ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -8 });
      else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    });
  });

  /* ---------- about gallery reel ---------- */
  (function initAboutReel() {
    var reel = document.querySelector(".about-reel");
    if (!reel) return;
    var track = reel.querySelector(".about-reel-track");
    if (!track) return;
    var auto = !reduce;
    var dragging = false;
    var startX = 0;
    var startScroll = 0;
    var half = 0;
    var resumeT = null;
    var SPEED = 1.15;

    function measure() {
      half = track.scrollWidth / 2;
    }
    measure();
    window.addEventListener("resize", measure);
    track.querySelectorAll("img").forEach(function (img) {
      if (!img.complete) img.addEventListener("load", measure);
    });

    function wrap() {
      if (half <= 0) return;
      if (reel.scrollLeft >= half) reel.scrollLeft -= half;
      else if (reel.scrollLeft < 0) reel.scrollLeft += half;
    }
    function pauseAuto() {
      auto = false;
      clearTimeout(resumeT);
    }
    function resumeAuto() {
      if (reduce) return;
      clearTimeout(resumeT);
      resumeT = setTimeout(function () { auto = true; }, 1100);
    }

    if (!reduce) {
      function tick() {
        if (auto && !dragging) {
          reel.scrollLeft += SPEED;
          wrap();
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    reel.addEventListener("wheel", function (e) {
      e.preventDefault();
      e.stopPropagation();
      pauseAuto();
      reel.scrollLeft += e.deltaY + e.deltaX;
      wrap();
      resumeAuto();
    }, { passive: false, capture: true });

    reel.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      pauseAuto();
      startX = e.clientX;
      startScroll = reel.scrollLeft;
      reel.classList.add("is-dragging");
      try { reel.setPointerCapture(e.pointerId); } catch (err) {}
    });
    reel.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      reel.scrollLeft = startScroll - (e.clientX - startX);
      wrap();
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      reel.classList.remove("is-dragging");
      resumeAuto();
    }
    reel.addEventListener("pointerup", endDrag);
    reel.addEventListener("pointercancel", endDrag);
  })();

  /* ---------- reveals ---------- */
  var revealables = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !revealables.length || reduce) {
    revealables.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------- resume modal ---------- */
  (function initResumeModal() {
    var pdf = (root || "") + "assets/HemantVResume.pdf";
    var preview = (root || "") + "assets/resume-preview.png";
    var modal = document.createElement("div");
    modal.className = "resume-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "resume-modal-title");
    modal.innerHTML =
      '<div class="resume-sheet">' +
        '<div class="resume-toolbar">' +
          '<h2 id="resume-modal-title">Resume</h2>' +
          '<a class="resume-dl" href="' + pdf + '" download="HemantVResume.pdf">Download PDF</a>' +
          '<button class="resume-close" type="button" aria-label="Close resume">&times;</button>' +
        "</div>" +
        '<div class="resume-preview" data-lenis-prevent>' +
          '<img src="' + preview + '" alt="Resume preview" />' +
        "</div>" +
      "</div>";
    document.body.appendChild(modal);
    var closeBtn = modal.querySelector(".resume-close");

    function openResume() {
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
      if (typeof setMenu === "function") setMenu(false);
      if (lenis && typeof lenis.stop === "function") lenis.stop();
      closeBtn.focus();
    }
    function closeResume() {
      modal.classList.remove("open");
      document.body.style.overflow = "";
      if (lenis && typeof lenis.start === "function") lenis.start();
    }

    document.addEventListener("click", function (e) {
      var trigger = e.target.closest("[data-resume-modal]");
      if (!trigger) return;
      e.preventDefault();
      e.stopPropagation();
      openResume();
    }, true);

    closeBtn.addEventListener("click", closeResume);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeResume();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("open")) closeResume();
    });
  })();
  var zoomables = document.querySelectorAll(".cs-cover img, figure.shot img, .zoomable");
  if (zoomables.length) {
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Image viewer");
    lb.setAttribute("aria-hidden", "true");
    lb.innerHTML =
      '<button class="lb-close" type="button" aria-label="Close">\u00d7</button>' +
      '<div class="lb-viewport"></div>' +
      '<div class="lb-tools">' +
        '<button class="lb-zoom-out" type="button" aria-label="Zoom out">\u2212</button>' +
        '<span class="lb-zoom-pct" aria-live="polite">100%</span>' +
        '<button class="lb-zoom-in" type="button" aria-label="Zoom in">+</button>' +
        '<button class="lb-zoom-reset" type="button" aria-label="Reset zoom">Reset</button>' +
      "</div>";
    var viewport = lb.querySelector(".lb-viewport");
    var lbImg = document.createElement("img");
    lbImg.alt = "";
    lbImg.draggable = false;
    viewport.appendChild(lbImg);
    document.body.appendChild(lb);

    var pctEl = lb.querySelector(".lb-zoom-pct");
    var MIN = 1;
    var MAX = 5;
    var scale = 1;
    var tx = 0;
    var ty = 0;
    var pointers = {};
    var pinch = null;
    var dragging = false;
    var moved = false;
    var dragSX = 0;
    var dragSY = 0;
    var dragTX = 0;
    var dragTY = 0;
    var lastTap = 0;
    var lastTapX = 0;
    var lastTapY = 0;

    function applyView() {
      lbImg.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + scale + ")";
      pctEl.textContent = Math.round(scale * 100) + "%";
    }
    function resetView() {
      scale = 1;
      tx = 0;
      ty = 0;
      applyView();
    }
    function clampScale(next) {
      return Math.min(MAX, Math.max(MIN, next));
    }
    function zoomAt(cx, cy, next) {
      next = clampScale(next);
      if (Math.abs(next - scale) < 0.001) return;
      var rect = viewport.getBoundingClientRect();
      var px = cx - (rect.left + rect.width / 2);
      var py = cy - (rect.top + rect.height / 2);
      var k = next / scale;
      tx = px - (px - tx) * k;
      ty = py - (py - ty) * k;
      scale = next;
      if (scale === MIN) {
        tx = 0;
        ty = 0;
      }
      applyView();
    }
    function pointerValues() {
      return Object.keys(pointers).map(function (id) { return pointers[id]; });
    }
    function distOf(a, b) {
      var dx = a.x - b.x, dy = a.y - b.y;
      return Math.sqrt(dx * dx + dy * dy) || 1;
    }

    function openLb(src, alt) {
      lbImg.src = src;
      lbImg.alt = alt || "";
      resetView();
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (lenis && typeof lenis.stop === "function") lenis.stop();
      lb.querySelector(".lb-close").focus();
    }
    function closeLb() {
      lb.classList.remove("open");
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lenis && typeof lenis.start === "function") lenis.start();
      pointers = {};
      pinch = null;
      dragging = false;
      viewport.classList.remove("is-panning");
    }

    zoomables.forEach(function (img) {
      img.classList.add("zoomable");
      img.addEventListener("click", function () {
        openLb(img.currentSrc || img.src, img.alt);
      });
    });

    lb.querySelector(".lb-close").addEventListener("click", function (e) {
      e.stopPropagation();
      closeLb();
    });
    lb.querySelector(".lb-zoom-in").addEventListener("click", function (e) {
      e.stopPropagation();
      var r = viewport.getBoundingClientRect();
      zoomAt(r.left + r.width / 2, r.top + r.height / 2, scale * 1.25);
    });
    lb.querySelector(".lb-zoom-out").addEventListener("click", function (e) {
      e.stopPropagation();
      var r = viewport.getBoundingClientRect();
      zoomAt(r.left + r.width / 2, r.top + r.height / 2, scale / 1.25);
    });
    lb.querySelector(".lb-zoom-reset").addEventListener("click", function (e) {
      e.stopPropagation();
      resetView();
    });
    lb.querySelector(".lb-tools").addEventListener("click", function (e) {
      e.stopPropagation();
    });

    viewport.addEventListener("wheel", function (e) {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, scale * (e.deltaY < 0 ? 1.12 : 1 / 1.12));
    }, { passive: false });

    viewport.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      viewport.setPointerCapture(e.pointerId);
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      moved = false;
      var pts = pointerValues();
      if (pts.length >= 2) {
        dragging = false;
        viewport.classList.remove("is-panning");
        pinch = {
          dist: distOf(pts[0], pts[1]),
          scale: scale,
          tx: tx,
          ty: ty,
          mx: (pts[0].x + pts[1].x) / 2,
          my: (pts[0].y + pts[1].y) / 2
        };
      } else {
        pinch = null;
        dragging = true;
        dragSX = e.clientX;
        dragSY = e.clientY;
        dragTX = tx;
        dragTY = ty;
        if (scale > MIN) viewport.classList.add("is-panning");
      }
    });
    viewport.addEventListener("pointermove", function (e) {
      if (!pointers[e.pointerId]) return;
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      var pts = pointerValues();
      if (pinch && pts.length >= 2) {
        var d = distOf(pts[0], pts[1]);
        var mx = (pts[0].x + pts[1].x) / 2;
        var my = (pts[0].y + pts[1].y) / 2;
        var next = clampScale(pinch.scale * (d / pinch.dist));
        var rect = viewport.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var p0x = pinch.mx - cx;
        var p0y = pinch.my - cy;
        var worldX = (p0x - pinch.tx) / pinch.scale;
        var worldY = (p0y - pinch.ty) / pinch.scale;
        scale = next;
        tx = (mx - cx) - worldX * scale;
        ty = (my - cy) - worldY * scale;
        if (scale === MIN) {
          tx = 0;
          ty = 0;
        }
        applyView();
        moved = true;
        return;
      }
      if (!dragging) return;
      var dx = e.clientX - dragSX;
      var dy = e.clientY - dragSY;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
      if (scale <= MIN) return;
      tx = dragTX + dx;
      ty = dragTY + dy;
      applyView();
    });
    function endPointer(e) {
      if (!pointers[e.pointerId]) return;
      delete pointers[e.pointerId];
      var pts = pointerValues();
      if (pts.length >= 2 && pinch) {
        pinch.dist = distOf(pts[0], pts[1]);
        pinch.scale = scale;
        pinch.tx = tx;
        pinch.ty = ty;
        pinch.mx = (pts[0].x + pts[1].x) / 2;
        pinch.my = (pts[0].y + pts[1].y) / 2;
        dragging = false;
      } else if (pts.length === 1) {
        pinch = null;
        dragging = true;
        dragSX = pts[0].x;
        dragSY = pts[0].y;
        dragTX = tx;
        dragTY = ty;
      } else {
        pinch = null;
        dragging = false;
        viewport.classList.remove("is-panning");
      }
    }
    viewport.addEventListener("pointerup", function (e) {
      var wasPinch = !!pinch;
      var wasMoved = moved;
      endPointer(e);
      if (wasPinch || wasMoved || pointerValues().length) return;
      var box = lbImg.getBoundingClientRect();
      var inside = e.clientX >= box.left && e.clientX <= box.right && e.clientY >= box.top && e.clientY <= box.bottom;
      if (!inside && scale <= MIN) {
        closeLb();
        return;
      }
      var now = Date.now();
      if (now - lastTap < 320 && Math.abs(e.clientX - lastTapX) < 28 && Math.abs(e.clientY - lastTapY) < 28) {
        if (scale > 1.05) resetView();
        else zoomAt(e.clientX, e.clientY, 2.4);
        lastTap = 0;
      } else {
        lastTap = now;
        lastTapX = e.clientX;
        lastTapY = e.clientY;
      }
    });
    viewport.addEventListener("pointercancel", endPointer);
    viewport.addEventListener("dblclick", function (e) {
      e.preventDefault();
    });

    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        var r = viewport.getBoundingClientRect();
        zoomAt(r.left + r.width / 2, r.top + r.height / 2, scale * 1.25);
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        var r2 = viewport.getBoundingClientRect();
        zoomAt(r2.left + r2.width / 2, r2.top + r2.height / 2, scale / 1.25);
      } else if (e.key === "0") {
        e.preventDefault();
        resetView();
      }
    });
  }

  /* ---------- name pronunciation ---------- */
  (function initSayName() {
    var btn = document.querySelector(".say-name");
    if (!btn) return;
    if (!window.speechSynthesis) {
      btn.hidden = true;
      return;
    }

    function pickVoice() {
      var voices = window.speechSynthesis.getVoices() || [];
      var i, v, enIn = null, en = null;
      for (i = 0; i < voices.length; i++) {
        v = voices[i];
        if (!enIn && (v.lang === "en-IN" || v.lang === "hi-IN")) enIn = v;
        if (!en && v.lang.indexOf("en") === 0) en = v;
      }
      return enIn || en || null;
    }

    btn.addEventListener("click", function () {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance("Hey munt");
      u.lang = "en-IN";
      u.rate = 0.88;
      var voice = pickVoice();
      if (voice) u.voice = voice;
      btn.classList.add("is-playing");
      u.onend = function () { btn.classList.remove("is-playing"); };
      u.onerror = function () { btn.classList.remove("is-playing"); };
      window.speechSynthesis.speak(u);
    });
  })();
})();
