const mongoose = require("mongoose");
const Review = require("./review");
const User = require("./user");

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
	author: {
		type: mongoose.Schema.Types.ObjectID,
		ref: "User",
	},
	reviews: [
		{
			type: mongoose.Schema.Types.ObjectID,
			ref: "Review",
		},
	],
});

campgroundSchema.post("findOneAndDelete", async function (ground) {
	if (ground.reviews.length) {
		const res = await Review.deleteMany({ _id: { $in: ground.reviews } });
		console.log(res);
	}
});

const Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;
