(function () {
	"use strict";

	var el = window.SSW.el;

	/* ============================================================
	   Gallery before/after compare sliders
	   ============================================================ */
	var galleryItems = [
		{
			label: "SUV, Full Wash",
			before: "assets/gallery/suv-1-before.webp",
			after: "assets/gallery/suv-1-after.webp"
		},
		{
			label: "SUV, Hand Dried Shine",
			before: "assets/gallery/suv-2-before.webp",
			after: "assets/gallery/suv-2-after.webp"
		},
		{
			label: "Minivan, Foam to Rinse",
			before: "assets/gallery/minivan-3-before.webp",
			after: "assets/gallery/minivan-3-after.webp"
		}
	];
	var grid = document.getElementById("gallery-grid");
	if (!grid) return;

	/* Background-image layers can't use the native loading="lazy"
	   attribute (that only works on <img>/<iframe>), so defer setting
	   backgroundImage until each card is about to scroll into view. */
	var lazyQueue = [];
	var lazyObserver = ("IntersectionObserver" in window)
		? new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				var target = entry.target;
				var url = target.getAttribute("data-bg");
				if (url) target.style.backgroundImage = "url('" + url + "')";
				lazyObserver.unobserve(target);
			});
		}, { rootMargin: "200px 0px" })
		: null;

	function setLazyBg(node, url) {
		if (!url) return;
		if (!lazyObserver) { node.style.backgroundImage = "url('" + url + "')"; return; }
		node.setAttribute("data-bg", url);
		lazyObserver.observe(node);
	}

	galleryItems.forEach(function (item) {
		var wrap = el("div", { class: "compare" });
		var frame = el("div", { class: "compare-frame" });
		var after = el("div", { class: "compare-after" });
		var before = el("div", { class: "compare-before" });
		setLazyBg(after, item.after);
		setLazyBg(before, item.before);
		var beforeTag = el("div", { class: "compare-tag before" }, [document.createTextNode("Before")]);
		var afterTag = el("div", { class: "compare-tag after" }, [document.createTextNode("After")]);
		var divider = el("div", { class: "compare-divider", "aria-hidden": "true" });
		var handle = el("div", {
			class: "compare-handle", tabindex: "0", role: "slider",
			"aria-label": "Reveal before/after for " + item.label,
			"aria-valuemin": "0", "aria-valuemax": "100", "aria-orientation": "horizontal"
		}, [document.createTextNode("⟷")]);
		var caption = el("div", { class: "compare-caption" }, [document.createTextNode(item.label)]);

		frame.appendChild(after);
		frame.appendChild(before);
		frame.appendChild(beforeTag);
		frame.appendChild(afterTag);
		frame.appendChild(divider);
		frame.appendChild(handle);
		wrap.appendChild(frame);
		wrap.appendChild(caption);
		grid.appendChild(wrap);

		var pct = 50;
		function setPct(p) {
			pct = Math.max(4, Math.min(96, p));
			before.style.clipPath = "inset(0 " + (100 - pct) + "% 0 0)";
			divider.style.left = pct + "%";
			handle.style.left = pct + "%";
			handle.setAttribute("aria-valuenow", String(Math.round(pct)));
		}
		setPct(50);

		var dragging = false;
		var frameRect = null;
		function update(clientX) {
			setPct(((clientX - frameRect.left) / frameRect.width) * 100);
		}
		function onDown(e) {
			dragging = true;
			frameRect = frame.getBoundingClientRect();
			e.preventDefault();
			update(e.touches ? e.touches[0].clientX : e.clientX);
		}
		frame.addEventListener("mousedown", onDown);
		frame.addEventListener("touchstart", onDown, { passive: false });
		window.addEventListener("mousemove", function (e) { if (dragging) update(e.clientX); });
		window.addEventListener("touchmove", function (e) { if (dragging) update(e.touches[0].clientX); }, { passive: false });
		window.addEventListener("mouseup", function () { dragging = false; });
		window.addEventListener("touchend", function () { dragging = false; });

		handle.addEventListener("keydown", function (e) {
			if (e.key === "ArrowLeft") { e.preventDefault(); setPct(pct - 5); }
			else if (e.key === "ArrowRight") { e.preventDefault(); setPct(pct + 5); }
			else if (e.key === "Home") { e.preventDefault(); setPct(4); }
			else if (e.key === "End") { e.preventDefault(); setPct(96); }
		});
	});
})();
