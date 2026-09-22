/* MOTION KIT v2 · Cazador de Webs — split-text, reveals, marquee,
   tilt 3D y barra de progreso. Vanilla, sin dependencias. */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Barra de progreso de scroll (se crea sola)
  if (!reduced) {
    var bar = document.createElement("div");
    bar.className = "mk-progress";
    document.body.appendChild(bar);
    var onScroll = function () {
      var h = document.documentElement;
      var p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      bar.style.transform = "scaleX(" + p + ")";
    };
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
  }

  // Si no hay intro, los split-text no esperan al telón
  if (!document.querySelector(".mk-intro")) {
    document.documentElement.style.setProperty("--mk-split-base", "0.1s");
  }

  // Split-text: trocea .mk-split en palabras animables
  document.querySelectorAll(".mk-split").forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    words.forEach(function (w, i) {
      var wrap = document.createElement("span");
      wrap.className = "mk-w";
      var inner = document.createElement("span");
      inner.textContent = w;
      inner.style.setProperty("--mk-i", i);
      wrap.appendChild(inner);
      el.appendChild(wrap);
      el.appendChild(document.createTextNode(" "));
    });
  });

  // Reveals al scroll
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("mk-in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.18 });
  document.querySelectorAll(".mk-reveal, .mk-unveil").forEach(function (el) { io.observe(el); });

  // Tilt 3D en cards
  if (!reduced) {
    document.querySelectorAll(".mk-card").forEach(function (card) {
      card.addEventListener("mousemove", function (ev) {
        var r = card.getBoundingClientRect();
        var x = (ev.clientX - r.left) / r.width - 0.5;
        var y = (ev.clientY - r.top) / r.height - 0.5;
        card.style.transform = "translateY(-8px) rotateX(" + (-y * 7) + "deg) rotateY(" + (x * 7) + "deg)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    });
  }

  // Marquee: duplica el contenido para el bucle infinito
  document.querySelectorAll(".mk-marquee-track").forEach(function (track) {
    track.innerHTML += track.innerHTML;
  });
})();
