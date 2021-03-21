const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

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
	for (let x = 0; x < 50; x++) {
		let random1000 = Math.floor(Math.random() * 1000);
		const item = new Campground({
			location: `${cities[random1000].city},${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			price: Math.floor(Math.random() * 100),
			image: "https://source.unsplash.com/collection/483251",
			description:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum sit dolorem ipsum hic minus earum autem ab. Praesentium obcaecati assumenda, id placeat quae debitis aspernatur dolores facere ab fugiat! Ullam.",
		});
		await item.save();
	}
};

seedDB().then(() => {
	db.close();
});
