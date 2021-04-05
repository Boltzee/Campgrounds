const gallery = document.querySelector("#gallery");
const load = document.getElementById("load");
const campground_list = campgrounds.features;

setTimeout(function () {
	window.scrollTo(0, 255);
}, 500);

function cards_generator(
	start,
	end,
	division,
	index,
	spec = false,
	pagination = false
) {
	let ar = ``;
	for (let i = start; i < end && !spec; i++) {
		let u = `
			<div class="card shadow mb-3" data-src="${
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
										? ""
										: division == 5
										? campground_list[i].description.slice(
												0,
												60
										  )
										: division == 4
										? campground_list[i].description.slice(
												0,
												35
										  )
										: ""
							  }</p>`
							: campground_list[i].description.slice(0, 10)
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
			<div class="card shadow mb-3" data-src="${
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
	if (pagination) {
		return ar;
	}
	let temp = `
		<div class="col-${division} mb-3 user-${index}">
			${ar}
		</div>
	`;
	return temp;
}

let topLevel_end;

function func2(cols, div, sp = false) {
	topLevel_end =
		campgrounds_list.length > 12
			? 12
			: campgrounds_list.length;
	let k = Math.floor(topLevel_end / cols);
	const arr = [];
	for (let i = 0; i < cols; i++) {
		arr.push(k);
	}
	let y = topLevel_end % cols;
	let i = 0;
	while (y--) {
		arr[i]++;
		i++;
	}
	arr4 = [2, 5, 3, 2];
	arr3 = [4, 3, 5];
	if (cols == 4) {
		div = arr4[0];
	} else if (cols == 3) {
		div = arr3[0];
	}
	let str2 = cards_generator(0, arr[0], div, 0, sp);
	for (let i = 1; i <= cols - 1; i++) {
		arr[i] += arr[i - 1];
		if (cols == 4) div = arr4[i];
		if (cols == 3) div = arr3[i];
		str2 = str2 + cards_generator(arr[i - 1], arr[i], div, i, sp);
	}
	return str2;
}

let str2 = func2(4, 3);
let str1 = func2(3, 4);
let str = func2(2, 6);

let special = func2(2, 6, true);

function cardImageAllocator(high = false) {
	let cards = document.querySelectorAll("div.card");
	cards.forEach((card) => {
		card.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.1)),url(${card.dataset.src})`;
		if (!high) {
			card.style.height = `${
				Math.max(26, Math.random() * 40) + Math.random() * 10
				// 26 + Math.random() * 15 - Math.random() * 5
			}vw`;
		} else {
			card.style.height = `${Math.min(
				36 +
					Math.random() * 30 +
					Math.random() * 30 -
					Math.random() * 2,
				38 + Math.random() * 30 - Math.random() * 4
			)}vw`;
		}
	});
}

function loadButton () {
	if(topLevel_end>= campground_list.length){
		load.style.display = 'none';
	}
}

//PAGINATION FUNCTIONALITY =========================================================================

function updateColumns(event, cols = 0) {
	let layout_4 = [2, 5, 3, 2];
	let layout_3 = [4, 3, 5];
	let layout_2 = [6, 6];

	let start = topLevel_end;
	let	end =
		campgrounds_list.length - start > 12
			? end + 12
			: campgrounds_list.length;

	for (let cols = 4; cols >= 2; cols--) {
		let temp = document.createElement("DIV");
		temp.innerHTML = cols == 4 ? str2 : cols == 3 ? str1 : str;
		layout = cols == 4 ? layout_4 : cols == 3 ? layout_3 : layout_2;
		let k = Math.floor(end - start / cols);
		const arr = [];
		for (let i = 0; i < cols; i++) {
			arr.push(k);
		}
		let y = end - (start % cols);
		let i = 0;
		while (y--) {
			arr[i]++;
			i++;
		}
		let start_2 = start;
		for (let i = 0; i < layout.length; i++) {
			let element = temp.querySelector(`.user-${i}`);
			element.innerHTML =
				elememt.innerHTML +
				cards_generator(
					start_2,
					start_2 + arr[i],
					layout[i],
					0,
					false,
					true
				);
			start_2 = start_2 + arr[i];
		}
		if (cols == 4) str2 = temp.innerHTML;
		else if (cols == 3) str1 = temp.innerHTML;
		else str = temp.innerHTML;

		if (cols == 2) {
			temp.innerHTML = special;
			let start_2 = start;
			for (let i = 0; i < layout.length; i++) {
				let element = temp.querySelector(`.user-${i}`);
				element.innerHTML =
					elememt.innerHTML +
					cards_generator(
						start_2,
						start_2 + arr[i],
						layout[i],
						0,
						true,
						true
					);
				start_2 = start_2 + arr[i];
			}
			special = temp.innerHTML;
		}
	}

	//str2,str1,str,special // and update all of them and then rerender.

	if (window.innerWidth >= 1141) {
		gallery.innerHTML = str2;
		cardImageAllocator();
	} else if (window.innerWidth < 1141 && window.innerWidth >= 725) {
		gallery.innerHTML = str1;
		cardImageAllocator();
	} else if (window.innerWidth < 725 && window.innerWidth >= 451) {
		gallery.innerHTML = str;
		cardImageAllocator(true);
	} else if (window.innerWidth <= 450) {
		gallery.innerHTML = special;
		cardImageAllocator(true);
	}
	if (window.innerWidth > 450 && window.innerWidth <= 465) {
		document
			.querySelectorAll("a.btn")
			.forEach((ele) => ele.classList.add("btn-sm"));
		hmm = 1;
	}

	loadButton();

	topLevel_end = end;

}

// ALL THE EVENT LISTENERS =========================================================================

let on = false;
document
	.querySelector("button.navbar-toggler")
	.addEventListener("click", function (e) {
		if (nav.classList.contains("fixed-top")) {
			return;
		}
		if (!on) {
			document.getElementById("first-heading").style.marginTop = "203px";
			on = true;
		} else {
			document.getElementById("first-heading").style.marginTop = "383px";
			on = false;
		}
	});

var instinct;
var hmm;

window.addEventListener("DOMContentLoaded", (event) => {
	console.log("DOM fully loaded and parsed");
	if (window.innerWidth >= 1141) {
		gallery.innerHTML = str2;
		instinct = 2;
		cardImageAllocator();
	} else if (window.innerWidth < 1141 && window.innerWidth >= 725) {
		gallery.innerHTML = str1;
		instinct = 1;
		cardImageAllocator();
	} else if (window.innerWidth < 725 && window.innerWidth >= 451) {
		console.log("hello guys i am here");
		gallery.innerHTML = str;
		instinct = 0;
		cardImageAllocator(true);
	} else if (window.innerWidth <= 450) {
		gallery.innerHTML = special;
		instinct = 4;
		cardImageAllocator(true);
	}
	if (window.innerWidth > 450 && window.innerWidth <= 465) {
		document
			.querySelectorAll("a.btn")
			.forEach((ele) => ele.classList.add("btn-sm"));
		hmm = 1;
	}
	loadButton();
});

window.addEventListener("resize", function (e) {
	if (window.innerWidth >= 1141 && instinct != 2) {
		gallery.innerHTML = str2;
		instinct = 2;
		cardImageAllocator();
	} else if (
		window.innerWidth < 1141 &&
		window.innerWidth >= 725 &&
		instinct != 1
	) {
		gallery.innerHTML = str1;
		instinct = 1;
		cardImageAllocator();
	} else if (
		window.innerWidth < 725 &&
		window.innerWidth >= 451 &&
		instinct != 0
	) {
		gallery.innerHTML = str;
		instinct = 0;
		cardImageAllocator(true);
	} else if (window.innerWidth <= 450 && instinct != 4) {
		gallery.innerHTML = special;
		instinct = 4;
		cardImageAllocator(true);
	}
	if (window.innerWidth > 450 && window.innerWidth <= 465 && instinct != 1) {
		document
			.querySelectorAll("a.btn")
			.forEach((ele) => ele.classList.add("btn-sm"));
		hmm = 1;
	} else {
		document
			.querySelectorAll("a.btn")
			.forEach((ele) => ele.classList.remove("btn-sm"));
		hmm = 0;
	}
});

load.addEventListener("click", updateColumns);
