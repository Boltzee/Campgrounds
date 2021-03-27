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
	catchAsync(reviews.deleteReviewById)
);

//

// Route for Edit/Patch a perticular review

router.patch(
	"/:reviewId",
	isLoggedIn,
	isReviewAuthor,
	validateReview,
	catchAsync(reviews.editReviewById)
);

//

module.exports = router;
