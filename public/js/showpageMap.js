mapboxgl.accessToken = mapToken;
var map = new mapboxgl.Map({
	container: "map", // container ID
	style: "mapbox://styles/mapbox/navigation-preview-night-v4", // style URL
	center: campground.geometry.coordinates, // starting position [lng, lat]
	zoom: 9, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

var marker1 = new mapboxgl.Marker()
	.setLngLat(loc)
	.setPopup(
		new mapboxgl.Popup({ offset: 25 }).setHTML(
			`<h3>${campground.title}</h3><p>${campground.location}</p>`
		)
	)
	.addTo(map);
