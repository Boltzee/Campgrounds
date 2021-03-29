const mongoose = require("mongoose");
const Review = require("./review");
const User = require("./user");

const imageSchema = new mongoose.Schema({
	url: String,
	filename: String,
});

imageSchema.virtual("thumbnail").get(function () {
	return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		geometry: {
			type: {
				type: String,
				enum: ["Point"],
				required: true,
			},
			coordinates: {
				type: [Number],
				required: true,
			},
		},
		images: [imageSchema],
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
	},
	opts
);

campgroundSchema.virtual("properties.popUpMarkup").get(function () {
	return "I am popup text";
});

campgroundSchema.post("findOneAndDelete", async function (ground) {
	if (ground.reviews.length) {
		const res = await Review.deleteMany({ _id: { $in: ground.reviews } });
		console.log(res);
	}
});

const Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;
