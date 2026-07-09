(function () {
	"use strict";

	var el = window.SSW.el;

	/* ============================================================
	   Scroll-to-section buttons (hero/CTA buttons -> local #booking)
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

		var heavySpeckles = [
			{ l: "15%", t: "30%", s: 6 }, { l: "25%", t: "55%", s: 5 }, { l: "35%", t: "25%", s: 7 },
			{ l: "45%", t: "60%", s: 5 }, { l: "55%", t: "35%", s: 8 }, { l: "65%", t: "55%", s: 6 },
			{ l: "75%", t: "30%", s: 7 }, { l: "85%", t: "50%", s: 5 }, { l: "20%", t: "68%", s: 6 },
			{ l: "50%", t: "72%", s: 9 }, { l: "70%", t: "68%", s: 5 }, { l: "10%", t: "50%", s: 5 },
			{ l: "90%", t: "35%", s: 6 }, { l: "40%", t: "42%", s: 8 }
		];

		var currencyFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
		function money(n) { return currencyFormatter.format(n); }

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
})();
