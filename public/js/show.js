const gallery = document.querySelector("#gallery");
const campground_list = campgrounds.features;

function cards_generator(start, end, division, spec = false) {
	let ar = ``;
	for (let i = start; i < end && !spec; i++) {
		let u = `
			<div class="card mb-3" data-src="${
				campground_list[i].images.length > 0
					? campground_list[i].images[0].url
					: k
			}">
				<div class="card-body">
					<h5 class="card-title">
						${campground_list[i].title}
					</h5>
					${
						division != 6
							? `<p class="card-text">${
									division == 3
										? campground_list[i].description
										: campground_list[i].description.slice(
												0,
												60
										  )
							  }</p>`
							: ""
					} 
					<p class="card-text">
						<small class="text-muted">${campground_list[i].location}</small>
					</p>
					<a href="/campgrounds/${campground_list[i]._id}" class="btn btn-primary">View ${
			campground_list[i].title.length > 16
				? campground_list[i].title.slice(0, 16) + "..."
				: campground_list[i].title
		}</a>
				</div>
			</div>
		`;
		ar = ar + u;
	}
	for (let i = start; i < end && spec; i++) {
		let u = `
			<div class="card mb-3" data-src="${
				campground_list[i].images.length > 0
					? campground_list[i].images[0].url
					: k
			}">
				<div class="card-body">
					<a href="/campgrounds/${campground_list[i]._id}" class="btn">View ${
			campground_list[i].title.length > 10
				? campground_list[i].title.slice(0, 10) + "..."
				: campground_list[i].title
		}</a>
				</div>
			</div>
		`;
		ar = ar + u;
	}
	let temp = `
		<div class="col-${division} mb-3">
			${ar}
		</div>
	`;
	return temp;
}

// (division==4) ? campground_list[i].description : (division==3)? campground_list[i].description.slice(0,30): ''
// ${(division!=2) ? `<p class="card-text">${(division==4) ? campground_list[i].description : campground_list[i].description.slice(0,30)}</p>` : ''}
function func2(cols, div, sp = false) {
	let k = Math.floor(campground_list.length / cols);
	const arr = [];
	for (let i = 0; i < cols; i++) {
		arr.push(k);
	}
	let y = campground_list.length % cols;
	let i = 0;
	while (y--) {
		arr[i]++;
		i++;
	}
	let str2 = cards_generator(0, arr[0], div, sp);
	for (let i = 1; i <= cols - 1; i++) {
		arr[i] += arr[i - 1];
		str2 = str2 + cards_generator(arr[i - 1], arr[i], div, sp);
	}
	return str2;
}

let str2 = func2(4, 3);
let str1 = func2(3, 4);
let str = func2(2, 6);

let special = func2(2, 6, true);

function cardImageAllocator() {
	let cards = document.querySelectorAll("div.card");
	cards.forEach((card) => {
		card.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.1)),url(${card.dataset.src})`;
		card.style.height = `${Math.random() * 31 + 39}vw`;
	});
}

var instinct;
window.addEventListener("DOMContentLoaded", (event) => {
	console.log("DOM fully loaded and parsed");
	if (document.body.clientWidth >= 1141) {
		gallery.innerHTML = str2;
		instinct = 2;
		cardImageAllocator();
	} else if (
		document.body.clientWidth < 1141 &&
		document.body.clientWidth >= 725
	) {
		gallery.innerHTML = str1;
		instinct = 1;
		cardImageAllocator();
	} else if (
		document.body.clientWidth < 725 &&
		document.body.clientWidth >= 434
	) {
		gallery.innerHTML = str;
		instinct = 0;
		cardImageAllocator();
	} else {
		gallery.innerHTML = special;
		instinct = 4;
		cardImageAllocator();
	}
});

window.addEventListener("resize", function (e) {
	if (document.body.clientWidth >= 1141 && instinct != 2) {
		gallery.innerHTML = str2;
		instinct = 2;
		cardImageAllocator();
	} else if (
		document.body.clientWidth < 1141 &&
		document.body.clientWidth >= 725 &&
		instinct != 1
	) {
		gallery.innerHTML = str1;
		instinct = 1;
		cardImageAllocator();
	} else if (
		document.body.clientWidth < 725 &&
		document.body.clientWidth >= 434 &&
		instinct != 0
	) {
		gallery.innerHTML = str;
		instinct = 0;
		cardImageAllocator();
	} else if (document.body.clientWidth < 434 && instinct != 4) {
		gallery.innerHTML = special;
		instinct = 4;
		cardImageAllocator();
	}
});
