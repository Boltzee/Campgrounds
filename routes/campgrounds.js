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

// The details route -- shows info about a single campground

router.get("/new", isLoggedIn, campgrounds.newCampgroundForm);

router.get("/:id", catchAsync(campgrounds.getCampgroundById));

//

// The edit/patch route --

router.get(
	"/:id/edit",
	isLoggedIn,
	isAuthor,
	catchAsync(campgrounds.editCampgroundForm)
);

router.patch(
	"/:id",
	isLoggedIn,
	isAuthor,
	validateCampground,
	catchAsync(campgrounds.editCampgroundById)
);

//

// The DELETE route --

router.delete(
	"/:id",
	isLoggedIn,
	isAuthor,
	catchAsync(campgrounds.deleteCampgroundById)
);

//

module.exports = router;
