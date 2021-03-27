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
	catchAsync(async (req, res, next) => {
		// if (!req.body.campground)
		// 	throw new ExpressError("Send required data please", 400);

		const ground = new Campground(req.body.campground); // to handle the async error
		ground.author = req.user._id;
		await ground.save();
		req.flash("success", "Created a new campground!!!");
		res.redirect(`/campgrounds/${ground._id}`);
	})
);

//

module.exports = router;
