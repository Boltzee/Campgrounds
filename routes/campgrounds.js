const express = require("express");
const router = express.Router();

const Campground = require("../models/campground");

const campgrounds = require("../controllers/campgrounds");

const catchAsync = require("../utils/catchAsync");

const cities = require("../seeds/cities");

const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

// the router club for '/' route

router
	.route("/")
	.get(catchAsync(campgrounds.index))
	.post(
		isLoggedIn,
		validateCampground,
		catchAsync(campgrounds.createCampground)
	);

//

// The router club for '/:id' route (i.e. a perticular campground)

router
	.route("/:id")
	.get(catchAsync(campgrounds.getCampgroundById))
	.patch(
		isLoggedIn,
		isAuthor,
		validateCampground,
		catchAsync(campgrounds.editCampgroundById)
	)
	.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampgroundById));

//

// The new campground template render route
router.get("/new", isLoggedIn, campgrounds.newCampgroundForm);

// The edit template render route --

router.get(
	"/:id/edit",
	isLoggedIn,
	isAuthor,
	catchAsync(campgrounds.editCampgroundForm)
);

//

module.exports = router;
