const element = document.querySelector(".card.shadow");
const str = `
			<div class="col-6" id="toBeRemoved">
				<a href="/" class="btn p-0" style="border: 0px;">
				<button title="back"><svg title="back" xmlns="http://www.w3.org/2000/svg" width="50" height="30" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
  					<path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
				</svg></button>
				</a><img
					src="/assets/asset_pic_1.jpg"
					alt=""
					class="img-fluid"
				/>
				<div class="mt-4 ms-4 pt-5" style="color: white">
				    <h1 style="font-size: 2.7rem"><b>Keep it special</b></h1>
				    <p style="font-size:1.27rem">Capture your personal memories<br>in a unique way anywhere</p>
				</div>
	        </div>
		`;
const str2 = `
        	<img src="/assets/asset_pic_1.jpg"
        	alt="" class="img-fluid" />
		`;
var instinct;
window.addEventListener("DOMContentLoaded", (event) => {
	console.log("DOM fully loaded and parsed");
	if (document.body.clientWidth >= 674) {
		element.innerHTML = str + element.innerHTML;
		instinct = true;
	} else {
		element.innerHTML = str2 + element.innerHTML;
		instinct = false;
	}
});

window.addEventListener("resize", function (e) {
	if (document.body.clientWidth >= 674 && !instinct) {
		const l = document.querySelector("img");
		l.remove();
		element.innerHTML = str + element.innerHTML;
		instinct = true;
	} else if (document.body.clientWidth < 674 && instinct) {
		const r = document.querySelector("#toBeRemoved");
		r.remove();
		element.innerHTML = str2 + element.innerHTML;
		instinct = false;
	}
});
