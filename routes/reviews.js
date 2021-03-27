const express = require("express");
const router = express.Router({ mergeParams: true });

const Campground = require("../models/campground");
const Review = require("../models/review");

const reviews = require("../controllers/reviews");

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

// The router club for '/:reviewId'

router
	.route("/:reviewId")
	.patch(
		isLoggedIn,
		isReviewAuthor,
		validateReview,
		catchAsync(reviews.editReviewById)
	)
	.delete(isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReviewById));

//

module.exports = router;
