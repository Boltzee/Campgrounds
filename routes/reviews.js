const express = require("express");
const router = express.Router({mergeParams: true});


const { reviewSchema } = require("../schemas.js");

const Campground = require("../models/campground");
const Review = require("../models/review");

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/expressError");

const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

// Route for creating a new review for a perticular campground

router.post(
	"/",
	validateReview,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id);
		const { review } = req.body;
		const rev = new Review(review);
		campground.reviews.push(rev);
		await campground.save();
		await rev.save();
		res.redirect(`/campgrounds/${campground._id}`);
		// console.log(review);
		// res.send(review);
	})
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
	catchAsync(async (req, res) => {
		const { groundId, reviewId } = req.params;
		// let ground = await Campground.findById(groundId).populate("reviews");
		// console.log(ground);

		await Campground.findByIdAndUpdate(groundId, {
			$pull: { reviews: reviewId },
		}); // New more powerful

		// removeByAttr(ground.reviews, "_id", reviewId);
		// await ground.save().then((d) => {
		// 	d.populate("reviews");
		// 	console.log(d);
		// });
		const review = await Review.findByIdAndDelete(reviewId);
		console.log(review);
		res.redirect(`/campgrounds/${groundId}`);
	})
);

//

// Route for Edit/Patch a perticular review

router.patch(
	"/:reviewId",
	validateReview,
	catchAsync(async (req, res) => {
		const { groundId, reviewId } = req.params;
		const update = req.body.review;
		console.log(update);
		const see = await Review.findByIdAndUpdate(reviewId, update, {
			new: true,
		});
		console.log(see);
		res.redirect(`/campgrounds/${groundId}`);
	})
);

//

module.exports = router;
