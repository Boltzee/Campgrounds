const mongoose = require("mongoose");

const campgroundSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	image: {
		type: String,
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
	reviews: [
		{
			type: mongoose.Schema.Types.ObjectID,
			ref: "Review",
		},
	],
});

const Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;
