const express = require("express");
const router = express.Router();

const Campground = require("../models/campground");

const campgrounds = require("../controllers/campgrounds");

const catchAsync = require("../utils/catchAsync");

const cities = require("../seeds/cities");

const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

const { storage } = require("../cloudinary");
const multer = require("multer");
const upload = multer({ storage });

// the router club for '/' route

router
	.route("/")
	.get(catchAsync(campgrounds.index))
	.post(
		isLoggedIn,
		upload.array("image"),
		validateCampground,
		catchAsync(campgrounds.createCampground)
	);

//

// The new campground template render route
router.get("/new", isLoggedIn, campgrounds.newCampgroundForm);

// The router club for '/:id' route (i.e. a perticular campground)

router
	.route("/:id")
	.get(catchAsync(campgrounds.getCampgroundById))
	.patch(
		isLoggedIn,
		isAuthor,
		upload.array("image"),
		validateCampground,
		catchAsync(campgrounds.editCampgroundById)
	)
	.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampgroundById));

//

// The edit template render route --

router.get(
	"/:id/edit",
	isLoggedIn,
	isAuthor,
	catchAsync(campgrounds.editCampgroundForm)
);

//

module.exports = router;
