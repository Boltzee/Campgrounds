const element = document.querySelector(".card.shadow");
const str = `
			<div class="col-6" id="toBeRemoved">
				<img src="https://images.unsplash.com/photo-1571863533956-01c88e79957e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80"
	        	alt="" class="img-fluid" />
	        </div>
		`;
const str2 = `
        	<img src="https://images.unsplash.com/photo-1571863533956-01c88e79957e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80"
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
