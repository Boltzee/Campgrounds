const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReviewForCampground = async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	if (!campground) {
		req.flash("error", "Requested campground cannot be found");
		return res.redirect("/campgrounds");
	}
	const { review } = req.body;
	const rev = new Review(review);
	rev.author = req.user._id;
	campground.reviews.push(rev);
	await campground.save();
	await rev.save();
	req.flash("success", "Successfully created a review");
	res.redirect(`/campgrounds/${campground._id}`);
	// console.log(review);
	// res.send(review);
};
