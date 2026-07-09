(function () {
	"use strict";

	/* ============================================================
	   Shared namespace — exposes el() for the page-specific scripts
	   (js/booking.js, js/compare.js, js/home.js) that load after this
	   file. Keep this file to code that truly runs on every page.
	   ============================================================ */
	window.SSW = window.SSW || {};

	function el(tag, attrs, children) {
		var e = document.createElement(tag);
		for (var k in attrs) {
			if (k === "class") e.className = attrs[k];
			else if (k === "html") e.innerHTML = attrs[k];
			else e.setAttribute(k, attrs[k]);
		}
		(children || []).forEach(function (c) { e.appendChild(c); });
		return e;
	}
	window.SSW.el = el;

	/* ============================================================
	   Footer year
	   ============================================================ */
	var yearEl = document.getElementById("year");
	if (yearEl) yearEl.textContent = new Date().getFullYear();

	/* ============================================================
	   Mobile nav toggle
	   ============================================================ */
	(function mobileNav() {
		var toggle = document.getElementById("nav-toggle");
		var nav = document.getElementById("main-nav");
		if (!toggle || !nav) return;

		function closeNav() {
			nav.classList.remove("is-open");
			toggle.setAttribute("aria-expanded", "false");
		}
		function openNav() {
			nav.classList.add("is-open");
			toggle.setAttribute("aria-expanded", "true");
		}

		toggle.addEventListener("click", function (e) {
			e.stopPropagation();
			if (nav.classList.contains("is-open")) closeNav(); else openNav();
		});
		nav.querySelectorAll(".nav-link").forEach(function (link) {
			link.addEventListener("click", closeNav);
		});
		document.addEventListener("click", function (e) {
			if (!nav.classList.contains("is-open")) return;
			if (nav.contains(e.target) || toggle.contains(e.target)) return;
			closeNav();
		});
		document.addEventListener("keydown", function (e) {
			if (e.key === "Escape" && nav.classList.contains("is-open")) {
				closeNav();
				toggle.focus();
			}
		});
		window.addEventListener("resize", function () {
			if (window.innerWidth > 1050) closeNav();
		});
	})();

	/* ============================================================
	   Header scroll state (desktop: transparent-over-hero until
	   the page scrolls, then a solid backing fades in — see the
	   @media (min-width: 981px) .site-header rules in styles.css)
	   ============================================================ */
	(function headerScrollState() {
		var header = document.querySelector(".site-header");
		if (!header) return;
		function update() {
			header.classList.toggle("is-scrolled", window.scrollY > 24);
		}
		window.addEventListener("scroll", update, { passive: true });
		update();
	})();

	/* ============================================================
	   Bubble fields (hero + section decorations — every page has at
	   least one bubble-field container; renderBubbles() no-ops on
	   any container id that isn't present on the current page)
	   ============================================================ */
	var sectionBubbles = [
		{ left: "4%", top: "10%", size: 15, dur: 9, delay: 0 },
		{ left: "8%", top: "35%", size: 11, dur: 11, delay: 1.6 },
		{ left: "5%", top: "62%", size: 17, dur: 8, delay: 3.2 },
		{ left: "9%", top: "86%", size: 10, dur: 10.5, delay: 2 },
		{ left: "93%", top: "15%", size: 14, dur: 9.5, delay: 0.7 },
		{ left: "96%", top: "42%", size: 10, dur: 12, delay: 3.8 },
		{ left: "92%", top: "66%", size: 16, dur: 8.6, delay: 1.3 },
		{ left: "95%", top: "88%", size: 11, dur: 10, delay: 2.6 }
	];

	var heroBubbles = [
		{ left: "47%", top: "13%", size: 14, dur: 9, delay: 0 },
		{ left: "92%", top: "16%", size: 11, dur: 11, delay: 1.5 },
		{ left: "50%", top: "80%", size: 16, dur: 8.5, delay: 3 },
		{ left: "87%", top: "84%", size: 12, dur: 10, delay: 2 },
		{ left: "96%", top: "46%", size: 9, dur: 12, delay: 0.8 },
		{ left: "46%", top: "52%", size: 15, dur: 9.5, delay: 4 },
		{ left: "70%", top: "9%", size: 10, dur: 10.5, delay: 2.5 },
		{ left: "80%", top: "90%", size: 13, dur: 8.8, delay: 1 }
	];

	function renderBubbles(containerId, data) {
		var container = document.getElementById(containerId);
		if (!container) return;
		data.forEach(function (b) {
			var bubble = el("div", { class: "fbubble" });
			bubble.style.left = b.left;
			bubble.style.top = b.top;
			bubble.style.width = b.size + "px";
			bubble.style.height = b.size + "px";
			bubble.style.animationDuration = b.dur + "s";
			bubble.style.animationDelay = b.delay + "s";
			container.appendChild(bubble);
		});
	}
	renderBubbles("hero-bubbles", heroBubbles);
	renderBubbles("section-bubbles-1", sectionBubbles);
	renderBubbles("section-bubbles-2", sectionBubbles);
	renderBubbles("section-bubbles-3", sectionBubbles);
	renderBubbles("pricing-intro-bubbles", sectionBubbles);
	renderBubbles("cta-bubbles", sectionBubbles);
	renderBubbles("gallery-intro-bubbles", sectionBubbles);
	renderBubbles("results-bubbles", sectionBubbles);
	renderBubbles("lounge-hero-bubbles", sectionBubbles);
	renderBubbles("experience-bubbles", sectionBubbles);
	renderBubbles("contact-intro-bubbles", sectionBubbles);
	renderBubbles("contact-hours-bubbles", sectionBubbles);
})();
