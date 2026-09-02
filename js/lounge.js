(function () {
	"use strict";

	/* ============================================================
	   Lounge gallery lightbox
	   ============================================================ */
	var tiles = document.querySelectorAll(".lounge-photo");
	var lightbox = document.getElementById("lightbox");
	if (!tiles.length || !lightbox) return;

	var lightboxImg = document.getElementById("lightbox-img");
	var closeBtn = document.getElementById("lightbox-close");
	var closeTimer = null;
	var lastFocused = null;

	function openLightbox(img) {
		lastFocused = document.activeElement;
		if (closeTimer) clearTimeout(closeTimer);
		lightboxImg.src = img.currentSrc || img.src;
		lightboxImg.alt = img.alt;
		lightbox.hidden = false;
		document.body.style.overflow = "hidden";
		requestAnimationFrame(function () {
			lightbox.classList.add("is-open");
		});
		closeBtn.focus();
	}

	function closeLightbox() {
		lightbox.classList.remove("is-open");
		document.body.style.overflow = "";
		closeTimer = setTimeout(function () {
			lightbox.hidden = true;
			lightboxImg.src = "";
		}, 250);
		if (lastFocused) lastFocused.focus();
	}

	tiles.forEach(function (tile) {
		var img = tile.querySelector(".lounge-photo-img");
		if (!img) return;
		tile.addEventListener("click", function () { openLightbox(img); });
	});

	closeBtn.addEventListener("click", closeLightbox);
	lightbox.addEventListener("click", function (e) {
		if (e.target === lightbox) closeLightbox();
	});
	document.addEventListener("keydown", function (e) {
		if (!lightbox.classList.contains("is-open")) return;
		if (e.key === "Escape") { closeLightbox(); return; }
		/* Focus trap: the close button is the only focusable element in
		   the lightbox, so Tab/Shift+Tab should just keep it there
		   instead of letting focus escape onto the page behind it. */
		if (e.key === "Tab") { e.preventDefault(); closeBtn.focus(); }
	});
})();
