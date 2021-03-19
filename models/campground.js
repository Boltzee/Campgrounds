const mongoose = require("mongoose");

const campgroundSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
		lowercase: true,
	},
	location: {
		type: String,
	},
});

const Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;
