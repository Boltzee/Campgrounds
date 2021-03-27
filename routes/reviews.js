const express = require("express");
const router = express.Router({ mergeParams: true });

const Campground = require("../models/campground");
const Review = require("../models/review");

const reviews = require('../controllers/reviews');

const catchAsync = require("../utils/catchAsync");

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
// Route for creating a new review for a perticular campground

router.post(
	"/",
	isLoggedIn,
	validateReview,
	catchAsync(reviews.createReviewForCampground)
);

//

// Route for deleting a perticular review of a campground

// var removeByAttr = function (arr, attr, value) {
// 	/// function to delete an review from the reviews array
// 	var i = arr.length;
// 	while (i--) {
// 		if (arr[i] && arr[i][attr] == value) {  				/// Once used now out of date.
// 			arr.splice(i, 1);
// 		}
// 	}
// 	return arr;
// };

router.delete(
	"/:reviewId",
	isLoggedIn,
	isReviewAuthor,
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params;
		// let ground = await Campground.findById(groundId).populate("reviews");
		// console.log(ground);
		const ground = await Campground.findById(id);
		if (!ground) {
			req.flash("error", "Requested campground cannot be found");
			return res.redirect("/campgrounds");
		}
		await Campground.findByIdAndUpdate(id, {
			$pull: { reviews: reviewId },
		}); // New more powerful

		// removeByAttr(ground.reviews, "_id", reviewId);
		// await ground.save().then((d) => {
		// 	d.populate("reviews");
		// 	console.log(d);
		// });
		const r = await Campground.findById(id);
		if (!r) {
			req.flash("error", "Requested review cannot be found");
			return res.redirect("/campgrounds");
		}
		const review = await Review.findByIdAndDelete(reviewId);
		console.log(review);
		req.flash("success", "Successfully deleted the review");
		res.redirect(`/campgrounds/${id}`);
	})
);

//

// Route for Edit/Patch a perticular review

router.patch(
	"/:reviewId",
	isLoggedIn,
	isReviewAuthor,
	validateReview,
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params;
		const update = req.body.review;
		console.log(update);
		const r = await Campground.findById(id);
		if (!r) {
			req.flash("error", "Requested review cannot be found");
			return res.redirect("/campgrounds");
		}
		const see = await Review.findByIdAndUpdate(reviewId, update, {
			new: true,
		});
		console.log(see);
		req.flash("success", "Successfully edited the review");
		res.redirect(`/campgrounds/${id}`);
	})
);

//

module.exports = router;
