const mongoose = require("mongoose");
const Review = require('./review');

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

campgroundSchema.post("findByIdAndDelete", async function (ground) {
	if(ground.reviews.length) {
		const res = await Review.deleteMany({_id: {$in : ground.reviews}})
		console.log(res);
	}
})

const Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;
