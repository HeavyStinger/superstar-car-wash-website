(function () {
	"use strict";

	var el = window.SSW.el;

	/* ============================================================
	   Gallery before/after compare sliders
	   ============================================================ */
	var galleryItems = [
		{
			label: "Small Car — Full Detail",
			before: "https://images.unsplash.com/photo-1770935883781-a2f5a52b69da?q=80&w=900&auto=format&fit=crop",
			after: "https://images.unsplash.com/photo-1575844611398-2a68400b437c?q=80&w=900&auto=format&fit=crop"
		},
		{
			label: "SUV — Outside Only",
			before: "https://images.unsplash.com/photo-1586733840013-c19652be212d?q=80&w=900&auto=format&fit=crop",
			after: "https://images.unsplash.com/photo-1607860115477-7b3700e055b6?q=80&w=900&auto=format&fit=crop"
		},
		{
			label: "Large SUV — In and Out",
			before: "https://images.unsplash.com/photo-1702235548944-87199c005acb?q=80&w=900&auto=format&fit=crop",
			after: "https://images.unsplash.com/photo-1619431856706-ca2cc58258f6?q=80&w=900&auto=format&fit=crop"
		},
		{
			label: "Truck — Extra Dirty",
			before: "https://images.unsplash.com/photo-1636225328330-7fb7184ca3ac?q=80&w=900&auto=format&fit=crop",
			after: "https://images.unsplash.com/photo-1550565076-b2371ea1a324?q=80&w=900&auto=format&fit=crop"
		}
	];
	var grid = document.getElementById("gallery-grid");
	if (!grid) return;

	galleryItems.forEach(function (item) {
		var wrap = el("div", { class: "compare" });
		var frame = el("div", { class: "compare-frame" });
		var after = el("div", { class: "compare-after" });
		var before = el("div", { class: "compare-before" });
		if (item.after) after.style.backgroundImage = "url('" + item.after + "')";
		if (item.before) before.style.backgroundImage = "url('" + item.before + "')";
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
