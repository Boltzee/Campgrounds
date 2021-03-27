const express = require("express");
const router = express.Router();

const Campground = require("../models/campground");

const campgrounds = require("../controllers/campgrounds");

const catchAsync = require("../utils/catchAsync");

const cities = require("../seeds/cities");

const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

// The index route -- basically shows all the campgrounds in the database

router.get("/", catchAsync(campgrounds.index));

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

// NEW CAMPGROUND route

/// order where the router.get(new ) is placed matters so i placed it in front of the /campgrounds/:id get req

router.post(
	"/",
	isLoggedIn,
	validateCampground,
	catchAsync(campgrounds.createCampground)
);

//

module.exports = router;
