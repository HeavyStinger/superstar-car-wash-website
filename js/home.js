(function () {
	"use strict";

	var el = window.SSW.el;

	/* ============================================================
	   Hero gradient overlay height (desktop only — matches
	   hero-info content height; harmless no-op while hidden on mobile)
	   ============================================================ */
	(function heroGradient() {
		var heroEl = document.getElementById("hero");
		var heroInfo = document.getElementById("hero-info");
		var heroGradientEl = document.getElementById("hero-gradient");
		if (!heroEl || !heroInfo || !heroGradientEl) return;
		function measureOverlay() {
			var heroTop = heroEl.getBoundingClientRect().top;
			var infoBottom = heroInfo.getBoundingClientRect().bottom;
			var h = Math.round(infoBottom - heroTop + 100);
			heroGradientEl.style.height = h + "px";
		}
		window.addEventListener("resize", measureOverlay);
		window.addEventListener("load", measureOverlay);
		requestAnimationFrame(measureOverlay);
	})();

	/* ============================================================
	   Testimonial marquees
	   ============================================================ */
	(function testimonials() {
		var testimonialsRow1 = [
			{ quote: "Fifteen minutes and my car looked showroom new. The bar makes the wait fly by.", name: "Marisol T." },
			{ quote: "Best detail job in Belize City, hands down. Tire shine is a nice touch.", name: "Andre G." },
			{ quote: "In and out service is worth every dollar, they got it spotless.", name: "Keisha B." },
			{ quote: "Booked online in thirty seconds and they were ready right on time.", name: "Devon R." }
		];

		var testimonialsRow2 = [
			{ quote: "The interior detail got out stains I thought were permanent. Amazing.", name: "Priya S." },
			{ quote: "Friendly crew, cold drinks, and a spotless finish. What else could you want.", name: "Emanuel C." },
			{ quote: "My go-to wash now. Fast, friendly, and the results speak for themselves.", name: "Natalie F." },
			{ quote: "The lounge is a great touch — grabbed a drink and my car was already done.", name: "Rico H." }
		];

		var foamCornerA = [
			{ right: "-6px", bottom: "-6px", s: 26 }, { right: "14px", bottom: "-10px", s: 18 },
			{ right: "-2px", bottom: "16px", s: 16 }, { right: "26px", bottom: "6px", s: 14 },
			{ right: "6px", bottom: "-14px", s: 12 }, { right: "-14px", bottom: "8px", s: 20 }
		];
		var foamCornerB = [
			{ right: "4px", bottom: "-8px", s: 20 }, { right: "-10px", bottom: "4px", s: 16 },
			{ right: "22px", bottom: "-4px", s: 14 }, { right: "-2px", bottom: "20px", s: 12 },
			{ right: "34px", bottom: "10px", s: 10 }
		];
		var foamCornerC = [
			{ right: "-8px", bottom: "10px", s: 22 }, { right: "10px", bottom: "-12px", s: 18 },
			{ right: "30px", bottom: "2px", s: 12 }, { right: "-4px", bottom: "-6px", s: 15 },
			{ right: "18px", bottom: "18px", s: 10 }, { right: "-16px", bottom: "-2px", s: 13 }
		];
		var foamCorners = [foamCornerA, foamCornerB, foamCornerC];

		function buildRow(containerId, data) {
			var container = document.getElementById(containerId);
			if (!container) return;
			var doubled = data.concat(data);
			doubled.forEach(function (t, i) {
				var card = el("div", { class: "review-card" });
				var corner = foamCorners[i % 3];
				corner.forEach(function (f) {
					var foam = el("div", { class: "foam" });
					foam.style.right = f.right; foam.style.bottom = f.bottom;
					foam.style.width = f.s + "px"; foam.style.height = f.s + "px";
					card.appendChild(foam);
				});
				var drip = el("div", { class: "foam foam-drip" });
				drip.style.right = "14px"; drip.style.bottom = "0px"; drip.style.width = "11px"; drip.style.height = "11px";
				drip.style.animationDuration = (7 + (i % 2) * 0.5) + "s";
				drip.style.animationDelay = "calc(" + i + " * 1.1s)";
				card.appendChild(drip);
				card.appendChild(el("div", { class: "review-stars", "aria-hidden": "true" }, [document.createTextNode("★★★★★")]));
				card.appendChild(el("p", { class: "review-quote" }, [document.createTextNode("“" + t.quote + "”")]));
				card.appendChild(el("div", { class: "review-name" }, [document.createTextNode(t.name)]));
				container.appendChild(card);
			});
		}
		buildRow("marquee-row-1", testimonialsRow1);
		buildRow("marquee-row-2", testimonialsRow2);
	})();
})();
