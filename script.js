(function () {
	"use strict";

	/* ============================================================
	   Shared data (ported from the Claude Design source)
	   ============================================================ */
	var glyphSpecs = {
		small:     { w: 100, h: 56, bodyL: 14, bodyT: 26, bodyW: 72,  bodyH: 16, bodyR: 8, cabinL: 30, cabinT: 14, cabinW: 38, cabinH: 14, cabinR: 6, wheelSize: 16, wheelT: 34, wheelL1: 22, wheelL2: 62 },
		suv:       { w: 112, h: 60, bodyL: 12, bodyT: 28, bodyW: 88,  bodyH: 18, bodyR: 8, cabinL: 28, cabinT: 14, cabinW: 52, cabinH: 16, cabinR: 6, wheelSize: 18, wheelT: 36, wheelL1: 24, wheelL2: 70 },
		large_suv: { w: 128, h: 64, bodyL: 10, bodyT: 30, bodyW: 106, bodyH: 20, bodyR: 8, cabinL: 58, cabinT: 14, cabinW: 52, cabinH: 18, cabinR: 6, wheelSize: 20, wheelT: 40, wheelL1: 24, wheelL2: 86 },
		larger:    { w: 150, h: 68, bodyL: 8,  bodyT: 30, bodyW: 134, bodyH: 22, bodyR: 8, cabinL: 22, cabinT: 12, cabinW: 96, cabinH: 20, cabinR: 6, wheelSize: 20, wheelT: 42, wheelL1: 22, wheelL2: 108 }
	};

	var priceTable = {
		small:     { outside: 15, inout: 30 },
		suv:       { outside: 20, inout: 40 },
		large_suv: { outside: 25, inout: 50 }
	};

	var vehicleMeta = [
		{ id: "small",     label: "Small Car",       sub: "Sedan · Hatchback · Coupe" },
		{ id: "suv",       label: "Small SUV",       sub: "Compact & Crossover" },
		{ id: "large_suv", label: "Large SUV",       sub: "Full-Size SUV" },
		{ id: "larger",    label: "Larger Vehicle",  sub: "Extra-Large SUV, Van & Up" }
	];

	var washMeta = [
		{ id: "outside", label: "Outside Only", sub: "Exterior wash & rinse" },
		{ id: "inout",   label: "In and Out",   sub: "Interior + exterior detail" }
	];

	var contactPhone = "+501 605-1575";
	var contactPhoneHref = "tel:+5016051575";

	var currencyFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
	function money(n) { return currencyFormatter.format(n); }

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

	var heavySpeckles = [
		{ l: "15%", t: "30%", s: 6 }, { l: "25%", t: "55%", s: 5 }, { l: "35%", t: "25%", s: 7 },
		{ l: "45%", t: "60%", s: 5 }, { l: "55%", t: "35%", s: 8 }, { l: "65%", t: "55%", s: 6 },
		{ l: "75%", t: "30%", s: 7 }, { l: "85%", t: "50%", s: 5 }, { l: "20%", t: "68%", s: 6 },
		{ l: "50%", t: "72%", s: 9 }, { l: "70%", t: "68%", s: 5 }, { l: "10%", t: "50%", s: 5 },
		{ l: "90%", t: "35%", s: 6 }, { l: "40%", t: "42%", s: 8 }
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
	   Bubble fields (hero + section decorations)
	   ============================================================ */
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

	/* ============================================================
	   Hero gradient overlay height (desktop only — matches
	   hero-info content height; harmless no-op while hidden on mobile)
	   ============================================================ */
	var heroEl = document.getElementById("hero");
	var heroInfo = document.getElementById("hero-info");
	var heroGradient = document.getElementById("hero-gradient");
	function measureOverlay() {
		if (!heroEl || !heroInfo || !heroGradient) return;
		var heroTop = heroEl.getBoundingClientRect().top;
		var infoBottom = heroInfo.getBoundingClientRect().bottom;
		var h = Math.round(infoBottom - heroTop + 100);
		heroGradient.style.height = h + "px";
	}
	window.addEventListener("resize", measureOverlay);
	window.addEventListener("load", measureOverlay);
	requestAnimationFrame(measureOverlay);

	/* ============================================================
	   Scroll-to-section buttons (hero CTAs -> booking form)
	   ============================================================ */
	document.querySelectorAll("[data-scroll-to]").forEach(function (btn) {
		btn.addEventListener("click", function () {
			var target = document.getElementById(btn.getAttribute("data-scroll-to"));
			if (target) target.scrollIntoView({ behavior: "smooth" });
		});
	});

	/* ============================================================
	   Booking wizard
	   ============================================================ */
	(function bookingWizard() {
		var form = document.getElementById("booking-form");
		if (!form) return;

		var state = {
			step: 1,
			showErrors: false,
			name: "", phone: "", phoneCode: "+501", email: "",
			date: "", time: "",
			vehicle: "", washType: "", extraDirty: false, tireShine: false
		};
		var stepTimer = null;

		var panels = Array.prototype.slice.call(form.querySelectorAll(".booking-panel"));
		var stepEls = Array.prototype.slice.call(document.querySelectorAll("#steps .step"));
		var stepLines = Array.prototype.slice.call(document.querySelectorAll("#steps .step-line"));
		var transitionOverlay = document.getElementById("booking-transition");
		var transitionMsgEl = document.getElementById("transition-msg");

		var nameInput = document.getElementById("bk-name");
		var phoneCodeInput = document.getElementById("bk-phone-code");
		var phoneInput = document.getElementById("bk-phone");
		var emailInput = document.getElementById("bk-email");
		var dateInput = document.getElementById("bk-date");
		var timeInput = document.getElementById("bk-time");

		var vehicleGrid = document.getElementById("vehicle-grid");
		var washGrid = document.getElementById("wash-grid");
		var washSub = document.getElementById("wash-sub");
		var extraDirtyRow = document.getElementById("extra-dirty-row");
		var extraDirtyCheckbox = document.getElementById("bk-extra-dirty");
		var extraDirtyGlyph = extraDirtyRow.querySelector(".checkbox-glyph");
		var tireShineRow = document.getElementById("tire-shine-row");
		var tireShineCheckbox = document.getElementById("bk-tire-shine");

		var backBtn = document.getElementById("bk-back");
		var continueBtn = document.getElementById("bk-continue");
		var footerPrice = document.getElementById("footer-price");
		var footerCall = document.getElementById("footer-call");
		var resetBtn = document.getElementById("bk-reset");

		nameInput.addEventListener("input", function () { state.name = nameInput.value; });
		phoneCodeInput.addEventListener("change", function () { state.phoneCode = phoneCodeInput.value; });
		phoneInput.addEventListener("input", function () { state.phone = phoneInput.value; });
		emailInput.addEventListener("input", function () { state.email = emailInput.value; });
		dateInput.addEventListener("input", function () { state.date = dateInput.value; renderVehicleSub(); });
		timeInput.addEventListener("input", function () { state.time = timeInput.value; });
		dateInput.min = new Date().toISOString().slice(0, 10);

		/* ---------- validation helpers ---------- */
		function isFutureOrToday(dateStr) {
			if (!dateStr) return false;
			var d = new Date(dateStr + "T00:00:00");
			var today = new Date();
			today.setHours(0, 0, 0, 0);
			return d >= today;
		}
		function isBusinessDay(dateStr) {
			if (!dateStr) return false;
			var day = new Date(dateStr + "T00:00:00").getDay();
			return day >= 1 && day <= 4;
		}
		function isBusinessTime(timeStr) {
			if (!timeStr) return false;
			return timeStr >= "07:30" && timeStr <= "16:40";
		}
		function validForStep(step) {
			var nameValid = state.name.trim().length > 1;
			var phoneValid = state.phone.replace(/[^0-9]/g, "").length >= 7;
			var emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email);
			if (step === 1) return nameValid && phoneValid && emailValid;
			if (step === 2) return !!state.date && !!state.time && isFutureOrToday(state.date) && isBusinessDay(state.date) && isBusinessTime(state.time);
			if (step === 3) return !!state.vehicle;
			if (step === 4) return !!state.washType;
			return true;
		}

		function ordinal(n) {
			var s = ["th", "st", "nd", "rd"];
			var v = n % 100;
			return n + (s[(v - 20) % 10] || s[v] || s[0]);
		}
		function formatSchedule(dateStr, timeStr) {
			if (!dateStr) return "your visit";
			var d = new Date(dateStr + "T00:00:00");
			var weekday = d.toLocaleDateString("en-US", { weekday: "long" });
			var month = d.toLocaleDateString("en-US", { month: "long" });
			var ord = ordinal(d.getDate());
			var year = d.getFullYear();
			var timeLabel = "";
			if (timeStr) {
				var t = new Date("1970-01-01T" + timeStr + ":00");
				timeLabel = " at " + t.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
			}
			return weekday + ", " + month + " " + ord + ", " + year + timeLabel;
		}
		function transitionMessage(step) {
			if (step === 1) return "Contact saved";
			if (step === 2) return "Set your wash for " + formatSchedule(state.date, state.time);
			if (step === 3) {
				var v = vehicleMeta.filter(function (v) { return v.id === state.vehicle; })[0];
				return "Your " + (v ? v.label : "vehicle") + " will look amazing";
			}
			return "Nice one!";
		}

		/* ---------- vehicle glyph builder ---------- */
		function buildGlyph(spec, container) {
			container.style.width = spec.w + "px";
			container.style.height = spec.h + "px";
			container.innerHTML = "";
			var body = el("div", { class: "g-body" });
			body.style.left = spec.bodyL + "px"; body.style.top = spec.bodyT + "px";
			body.style.width = spec.bodyW + "px"; body.style.height = spec.bodyH + "px"; body.style.borderRadius = spec.bodyR + "px";
			var cabin = el("div", { class: "g-cabin" });
			cabin.style.left = spec.cabinL + "px"; cabin.style.top = spec.cabinT + "px";
			cabin.style.width = spec.cabinW + "px"; cabin.style.height = spec.cabinH + "px"; cabin.style.borderRadius = spec.cabinR + "px";
			var wheel1 = el("div", { class: "g-wheel" });
			wheel1.style.left = spec.wheelL1 + "px"; wheel1.style.top = spec.wheelT + "px";
			wheel1.style.width = spec.wheelSize + "px"; wheel1.style.height = spec.wheelSize + "px";
			var wheel2 = el("div", { class: "g-wheel" });
			wheel2.style.left = spec.wheelL2 + "px"; wheel2.style.top = spec.wheelT + "px";
			wheel2.style.width = spec.wheelSize + "px"; wheel2.style.height = spec.wheelSize + "px";
			container.appendChild(body); container.appendChild(cabin); container.appendChild(wheel1); container.appendChild(wheel2);
		}

		/* ---------- render vehicle cards ---------- */
		function renderVehicleCards() {
			vehicleGrid.innerHTML = "";
			vehicleMeta.forEach(function (v) {
				var selected = state.vehicle === v.id;
				var priceLabel = v.id === "larger" ? "Call for Price" : ("From $" + money(priceTable[v.id].outside) + " BZD");
				var card = el("button", { type: "button", class: "vcard" + (selected ? " is-selected" : ""), "aria-pressed": String(selected) });
				card.appendChild(el("div", { class: "vcard-check", "aria-hidden": "true" }, [document.createTextNode("✓")]));
				var glyphWrap = el("div", { class: "vehicle-glyph", "aria-hidden": "true" });
				card.appendChild(glyphWrap);
				buildGlyph(glyphSpecs[v.id], glyphWrap);
				card.appendChild(el("div", { class: "vcard-title" }, [document.createTextNode(v.label)]));
				card.appendChild(el("div", { class: "vcard-sub" }, [document.createTextNode(v.sub)]));
				card.appendChild(el("div", { class: "vcard-price" }, [document.createTextNode(priceLabel)]));
				card.addEventListener("click", function () {
					state.vehicle = v.id;
					renderVehicleCards();
					renderWashCards();
					renderVehicleSub();
					updateFooter();
				});
				vehicleGrid.appendChild(card);
			});
		}

		function vehicleLabel() {
			var v = vehicleMeta.filter(function (v) { return v.id === state.vehicle; })[0];
			return v ? v.label : "vehicle";
		}
		function renderVehicleSub() {
			washSub.textContent = "Pricing scales with your " + vehicleLabel() + ".";
		}

		/* ---------- render wash type cards ---------- */
		function isCallForPrice() {
			return state.vehicle === "larger" || state.extraDirty;
		}
		function renderWashCards() {
			washGrid.innerHTML = "";
			washMeta.forEach(function (w) {
				var selected = state.washType === w.id;
				var rawPrice = (!isCallForPrice() && state.vehicle && priceTable[state.vehicle]) ? priceTable[state.vehicle][w.id] : null;
				var priceLabel = rawPrice === null ? "Call for Price" : ("$" + money(rawPrice) + " BZD");
				var card = el("button", { type: "button", class: "dcard" + (selected ? " is-selected" : ""), "aria-pressed": String(selected) });
				card.appendChild(el("div", { class: "dcard-check", "aria-hidden": "true" }, [document.createTextNode("✓")]));
				card.appendChild(el("div", { class: "dcard-title" }, [document.createTextNode(w.label)]));
				card.appendChild(el("div", { class: "dcard-sub" }, [document.createTextNode(w.sub)]));
				card.appendChild(el("div", { class: "dcard-price" }, [document.createTextNode(priceLabel)]));
				card.addEventListener("click", function () {
					state.washType = w.id;
					renderWashCards();
					updateFooter();
				});
				washGrid.appendChild(card);
			});
		}

		function updateExtraDirtyUI() {
			extraDirtyRow.classList.toggle("is-checked", state.extraDirty);
			extraDirtyCheckbox.checked = state.extraDirty;
			extraDirtyGlyph.innerHTML = "";
			var glyphInner = el("div", { style: "position:relative;width:100%;height:100%;" });
			extraDirtyGlyph.appendChild(glyphInner);
			buildGlyph(glyphSpecs[state.vehicle] || glyphSpecs.small, glyphInner);
			if (state.extraDirty) {
				heavySpeckles.forEach(function (sp) {
					var d = el("div", { class: "speckle" });
					d.style.left = sp.l; d.style.top = sp.t; d.style.width = sp.s + "px"; d.style.height = sp.s + "px";
					glyphInner.appendChild(d);
				});
			}
		}
		function updateTireShineUI() {
			tireShineRow.classList.toggle("is-checked", state.tireShine);
			tireShineCheckbox.checked = state.tireShine;
		}
		extraDirtyRow.addEventListener("click", function (e) {
			if (e.target.tagName === "INPUT") return;
			state.extraDirty = !state.extraDirty;
			updateExtraDirtyUI();
			renderWashCards();
			updateFooter();
		});
		tireShineRow.addEventListener("click", function (e) {
			if (e.target.tagName === "INPUT") return;
			state.tireShine = !state.tireShine;
			updateTireShineUI();
			updateFooter();
		});

		/* ---------- pricing / confirmation ---------- */
		function basePrice() {
			return (!isCallForPrice() && state.vehicle && state.washType) ? priceTable[state.vehicle][state.washType] : 0;
		}
		function total() {
			return isCallForPrice() ? null : basePrice() + (state.tireShine ? 10 : 0);
		}

		var confirmCopy = document.getElementById("confirm-copy");
		var confirmPriceSummary = document.getElementById("confirm-price-summary");
		var confirmCallSummary = document.getElementById("confirm-call-summary");
		var summaryLine1 = document.getElementById("summary-line-1");
		var summaryPrice1 = document.getElementById("summary-price-1");
		var summaryTireRow = document.getElementById("summary-tire-row");
		var summaryTotal = document.getElementById("summary-total");
		var confirmCallLine = document.getElementById("confirm-call-line");

		function washLabel() {
			var w = washMeta.filter(function (w) { return w.id === state.washType; })[0];
			return w ? w.label : "";
		}

		function renderConfirmation() {
			confirmCopy.textContent = "Thanks, " + state.name + " — we’ll see your " + vehicleLabel() + " on " + formatSchedule(state.date, state.time) + ".";
			var showPriceOnly = !!state.vehicle && !!state.washType && !isCallForPrice();
			var showCallCta = !!state.vehicle && !!state.washType && isCallForPrice();
			confirmPriceSummary.hidden = !showPriceOnly;
			confirmCallSummary.hidden = !showCallCta;
			if (showPriceOnly) {
				summaryLine1.textContent = vehicleLabel() + " · " + washLabel();
				summaryPrice1.textContent = "$" + money(basePrice());
				summaryTireRow.hidden = !state.tireShine;
				summaryTotal.textContent = "$" + money(total()) + " BZD";
			}
			if (showCallCta) {
				confirmCallLine.textContent = vehicleLabel() + " · " + washLabel() + " — priced by phone";
			}
		}

		/* ---------- step navigation / render ---------- */
		function clearErrors() {
			["name", "phone", "email", "date", "time", "vehicle", "wash"].forEach(function (k) {
				var e = document.getElementById("err-" + k);
				if (e) e.hidden = true;
			});
			[nameInput, phoneInput, emailInput, dateInput, timeInput].forEach(function (i) { i.classList.remove("error"); });
		}

		function showErrors() {
			var nameValid = state.name.trim().length > 1;
			var phoneValid = state.phone.replace(/[^0-9]/g, "").length >= 7;
			var emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email);
			toggleErr("name", !nameValid, nameInput);
			toggleErr("phone", !phoneValid, phoneInput);
			toggleErr("email", !emailValid, emailInput);
			toggleErr("date", !(state.date && isFutureOrToday(state.date) && isBusinessDay(state.date)), dateInput);
			toggleErr("time", !(state.time && isBusinessTime(state.time)), timeInput);
			toggleErr("vehicle", !state.vehicle, null);
			toggleErr("wash", !state.washType, null);

			if (state.date && !isFutureOrToday(state.date)) {
				setErrText("date", "Please pick today or a later date.");
			} else if (state.date && !isBusinessDay(state.date)) {
				setErrText("date", "We’re open Monday–Thursday only — pick another day.");
			} else {
				setErrText("date", "Pick a date");
			}
			if (state.time && !isBusinessTime(state.time)) {
				setErrText("time", "Last booking is 4:40pm (we close at 5:00pm) — pick a time in range.");
			} else {
				setErrText("time", "Pick a time");
			}

			var firstInvalid = null;
			if (state.step === 1) {
				if (!nameValid) firstInvalid = nameInput;
				else if (!phoneValid) firstInvalid = phoneInput;
				else if (!emailValid) firstInvalid = emailInput;
			} else if (state.step === 2) {
				if (!(state.date && isFutureOrToday(state.date) && isBusinessDay(state.date))) firstInvalid = dateInput;
				else if (!(state.time && isBusinessTime(state.time))) firstInvalid = timeInput;
			}
			if (firstInvalid) firstInvalid.focus();
		}
		function setErrText(key, text) {
			var e = document.getElementById("err-" + key);
			if (e) e.textContent = text;
		}
		function toggleErr(key, show, input) {
			var e = document.getElementById("err-" + key);
			if (e) e.hidden = !show;
			if (input) input.classList.toggle("error", show);
		}

		var continueLabels = { 1: "Continue to Schedule", 2: "Continue to Vehicle", 3: "Continue to Wash Type", 4: "Confirm Booking" };
		function updateFooter() {
			backBtn.hidden = state.step <= 1 || state.step > 4;
			continueBtn.hidden = state.step > 4;
			continueBtn.textContent = continueLabels[state.step] || "Continue";
			footerPrice.hidden = !(state.step === 4 && state.vehicle && state.washType && !isCallForPrice());
			footerCall.hidden = !(state.step === 4 && state.vehicle && state.washType && isCallForPrice());
			if (state.step === 4 && state.vehicle && state.washType && !isCallForPrice()) {
				footerPrice.innerHTML = "$" + money(total()) + " <small>BZD</small>";
			}
		}

		function render() {
			panels.forEach(function (p) {
				p.classList.toggle("is-active", Number(p.dataset.panel) === state.step);
			});
			stepEls.forEach(function (s) {
				var n = Number(s.dataset.step);
				s.classList.toggle("is-current", n === state.step);
				s.classList.toggle("is-done", state.step > n || state.step === 5);
			});
			stepLines.forEach(function (line, i) {
				line.classList.toggle("is-done", state.step > i + 1 || state.step === 5);
			});

			updateFooter();

			if (state.step === 5) renderConfirmation();
			if (state.step === 3) renderVehicleCards();
			if (state.step === 4) { renderWashCards(); updateExtraDirtyUI(); updateTireShineUI(); renderVehicleSub(); }
		}

		continueBtn.addEventListener("click", function () {
			if (transitionOverlay.classList.contains("is-active")) return;
			if (!validForStep(state.step)) {
				state.showErrors = true;
				showErrors();
				return;
			}
			clearErrors();
			var msg = transitionMessage(state.step);
			var duration = state.step === 2 ? 2000 : 750;
			transitionMsgEl.textContent = msg;
			transitionOverlay.hidden = false;
			transitionOverlay.classList.add("is-active");
			continueBtn.disabled = true;
			backBtn.disabled = true;
			if (stepTimer) clearTimeout(stepTimer);
			stepTimer = setTimeout(function () {
				transitionOverlay.hidden = true;
				transitionOverlay.classList.remove("is-active");
				continueBtn.disabled = false;
				backBtn.disabled = false;
				state.step = state.step === 4 ? 5 : state.step + 1;
				state.showErrors = false;
				render();
			}, duration);
		});

		form.addEventListener("submit", function (e) {
			e.preventDefault();
			if (!continueBtn.hidden) continueBtn.click();
		});
		form.addEventListener("keydown", function (e) {
			if (e.key !== "Enter") return;
			var tag = e.target.tagName;
			if (tag === "TEXTAREA") return;
			e.preventDefault();
			if (!continueBtn.hidden) continueBtn.click();
		});

		backBtn.addEventListener("click", function () {
			if (transitionOverlay.classList.contains("is-active")) return;
			state.step = Math.max(1, state.step - 1);
			state.showErrors = false;
			clearErrors();
			render();
		});

		resetBtn.addEventListener("click", function () {
			if (stepTimer) clearTimeout(stepTimer);
			state = { step: 1, showErrors: false, name: "", phone: "", phoneCode: "+501", email: "", date: "", time: "", vehicle: "", washType: "", extraDirty: false, tireShine: false };
			nameInput.value = ""; phoneInput.value = ""; emailInput.value = ""; dateInput.value = ""; timeInput.value = "";
			phoneCodeInput.value = "+501";
			clearErrors();
			render();
		});

		window.addEventListener("beforeunload", function (e) {
			var hasProgress = state.step > 1 || state.name || state.phone || state.email;
			if (!hasProgress || state.step === 5) return;
			e.preventDefault();
			e.returnValue = "";
		});

		render();
	})();

	/* ============================================================
	   Gallery before/after compare sliders
	   ============================================================ */
	(function gallery() {
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
				before.style.width = pct + "%";
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

	/* ============================================================
	   Testimonial marquees
	   ============================================================ */
	(function testimonials() {
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

	/* ============================================================
	   FAQ accordion (contact.html)
	   ============================================================ */
	(function faqAccordion() {
		var items = document.querySelectorAll(".faq-item");
		if (!items.length) return;
		items.forEach(function (item) {
			var btn = item.querySelector(".faq-question");
			btn.addEventListener("click", function () {
				var isOpen = item.classList.contains("is-open");
				item.classList.toggle("is-open", !isOpen);
				btn.setAttribute("aria-expanded", String(!isOpen));
			});
		});
	})();
})();
