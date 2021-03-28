mapboxgl.accessToken = mapToken;
var map = new mapboxgl.Map({
	container: "map", // container ID
	style: "mapbox://styles/mapbox/streets-v11", // style URL
	center: loc, // starting position [lng, lat]
	zoom: 9, // starting zoom
});

var marker1 = new mapboxgl.Marker().setLngLat(loc).addTo(map);
