const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken =
	"pk.eyJ1IjoiY29kZmlzaCIsImEiOiJja210amo4OWEwc2gzMnVtcDBieWZmc3ozIn0.UlFT_LWz0wqEyXHz_p6nDA";
const geocoder = mbxGeocoding({ accessToken: mapboxToken });

// mongoose.connect("mongodb://localhost:27017/YelpCamp", {
// 	useNewUrlParser: true,
// 	useCreateIndex: true,
// 	useUnifiedTopology: true,
// });

mongoose.connect(
	"mongodb+srv://codfish:yUzNtIYNBSyS8FcR@yelpcamp.x7jc2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
	{
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	}
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database Connected");
});

const image_samples = [
	{
		url:
			"https://res.cloudinary.com/chadchampion/image/upload/v1618666905/asset_pic_15_ibkve1.jpg",
		filename: "asset_pic_15_ibkve1",
	},
	{
		url:
			"https://res.cloudinary.com/chadchampion/image/upload/v1618666945/asset_pic_11_erwub1.jpg",
		filename: "asset_pic_11_erwub1",
	},
	{
		url:
			"https://res.cloudinary.com/chadchampion/image/upload/v1618666979/asset_pic_4_meurno.jpg",
		filename: "asset_pic_4_meurno",
	},
	{
		url:
			"https://res.cloudinary.com/chadchampion/image/upload/v1618666922/asset_pic_18_vtq5jq.jpg",
		filename: "asset_pic_18_vtq5jq",
	},
	{
		url:
			"https://res.cloudinary.com/chadchampion/image/upload/v1618666927/asset_pic_13_bpgezn.jpg",
		filename: "asset_pic_13_bpgezn",
	},
	{
		url:
			"https://res.cloudinary.com/chadchampion/image/upload/v1618666899/asset_pic_19_p6snar.jpg",
		filename: "asset_pic_19_p6snar",
	},
];

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let x = 0; x < 75; x++) {
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
				image_samples[Math.floor(Math.random() * 6)],
				image_samples[Math.floor(Math.random() * 6)],
			],
			author: "6062f93d4c27750015bcb9fd",
			description:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum sit dolorem ipsum hic minus earum autem ab. Praesentium obcaecati assumenda, id placeat quae debitis aspernatur dolores facere ab fugiat! Ullam.",
		});

		await item.save();
	}
};

seedDB().then(() => {
	db.close();
});
