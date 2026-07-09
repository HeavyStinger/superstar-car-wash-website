(function () {
	"use strict";

	/* ============================================================
	   FAQ accordion (contact.html)
	   ============================================================ */
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
