const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken =
	"pk.eyJ1IjoiY29kZmlzaCIsImEiOiJja210amo4OWEwc2gzMnVtcDBieWZmc3ozIn0.UlFT_LWz0wqEyXHz_p6nDA";
const geocoder = mbxGeocoding({ accessToken: mapboxToken });

mongoose.connect("mongodb://localhost:27017/YelpCamp", {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database Connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let x = 0; x < 400; x++) {
		let random1000 = Math.floor(Math.random() * 1000);
		const item = new Campground({
			location: `${cities[random1000].city},${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			price: Math.floor(Math.random() * 100),
			geometry: {
				type: "Point",
				coordinates: [
					cities[random1000].longitude,
					cities[random1000].latitude,
				],
			},
			images: [
				{
					url:
						"https://res.cloudinary.com/chadchampion/image/upload/v1616938179/YelpCamp/onsqcoe4194je2pxi5jm.jpg",
					filename: "YelpCamp/onsqcoe4194je2pxi5jm",
				},
				{
					url:
						"https://res.cloudinary.com/chadchampion/image/upload/v1616938179/YelpCamp/p4zfqwcrxti9o4jb93s2.jpg",
					filename: "YelpCamp/p4zfqwcrxti9o4jb93s2",
				},
			],
			author: "605f0778105ac227685f5421",
			description:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum sit dolorem ipsum hic minus earum autem ab. Praesentium obcaecati assumenda, id placeat quae debitis aspernatur dolores facere ab fugiat! Ullam.",
		});

		await item.save();
	}
};

seedDB().then(() => {
	db.close();
});
