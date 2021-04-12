const carousel = document.querySelector("#campgroundCarousel");
const detailCard = document.querySelector("#detailCard");
const contentCol = document.querySelector("#contentCol");

let detail_card_style = 0;
let detail_card_style2 = 0;

window.addEventListener("DOMContentLoaded", function (e) {
	if (window.innerWidth <= 1012) {
		carousel.classList.remove("col-4");
		detailCard.classList.remove("col-8");
		detail_card_style = 0;
	} else {
		detail_card_style = 1;
	}
	///////////////////////////////////
	if (window.innerWidth <= 594) {
		contentCol.classList.remove("col-9");
		detail_card_style2 = 0;
	}
});

window.addEventListener("resize", function (e) {
	if (window.innerWidth <= 1012 && detail_card_style != 0) {
		carousel.classList.remove("col-4");
		detailCard.classList.remove("col-8");
		detail_card_style = 0;
	} else if (window.innerWidth > 1012 && detail_card_style != 1) {
		carousel.classList.add("col-4");
		detailCard.classList.add("col-8");
		detail_card_style = 1;
	}
	///////////////////////////////
	if (window.innerWidth <= 594 && detail_card_style2 != 0) {
		contentCol.classList.remove("col-9");
		detail_card_style2 = 0;
	} else if (window.innerWidth > 594 && detail_card_style2 != 1) {
		contentCol.classList.add("col-9");
		detail_card_style2 = 1;
	}
});
