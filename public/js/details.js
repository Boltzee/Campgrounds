const carousel = document.querySelector("#campgroundCarousel");
const detailCard = document.querySelector("#detailCard");

let detail_card_style = 0;

window.addEventListener("DOMContentLoaded", function (e) {
	if (window.innerWidth <= 1012) {
		carousel.classList.remove("col-4");
		detailCard.classList.remove("col-8");
		detail_card_style = 0;
	} else {
		detail_card_style = 1;
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
});
