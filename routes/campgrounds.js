const express = require("express");
const router = express.Router();

const Campground = require("../models/campground");

const catchAsync = require("../utils/catchAsync");

const cities = require("../seeds/cities");

const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

// The index route -- basically shows all the campgrounds in the database

router.get(
	"/",
	catchAsync(async (req, res) => {
		const grounds = await Campground.find({});
		res.render("campground/show", { grounds });
	})
);
//

// The details route -- shows info about a single campground

router.get("/new", isLoggedIn, (req, res) => {
	res.render("campground/new", { cities }); // route for displaying form to create a new campground
});

router.get(
	"/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const ground = await Campground.findById(id)
			.populate("reviews")
			.populate("author");
		if (!ground) {
			req.flash("error", "Requested campground cannot be found");
			return res.redirect("/campgrounds");
		}
		res.render("campground/details", { ground });
	})
);

//

// The edit/patch route --

router.get(
	"/:id/edit",
	isLoggedIn,
	isAuthor,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const ground = await Campground.findById(id);
		if (!ground) {
			req.flash("error", "Requested campground cannot be found");
			return res.redirect("/campgrounds");
		}
		res.render("campground/edit", { ground, cities });
	})
);

router.patch(
	"/:id",
	isLoggedIn,
	isAuthor,
	validateCampground,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const update = req.body.campground;
		console.log(update);
		const see = await Campground.findByIdAndUpdate(id, update, {
			new: true,
			runValidators: true,
		});
		req.flash("success", "Successfully updated the campground");
		res.redirect(`/campgrounds/${see._id}`);
	})
);

//

// The DELETE route --

router.delete(
	"/:id",
	isLoggedIn,
	isAuthor,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const ground = await Campground.findById(id);
		if (!ground) {
			req.flash("error", "Requested campground cannot be found");
			return res.redirect("/campgrounds");
		}
		await Campground.findByIdAndDelete(id);
		req.flash("success", "Successfully deleted the campground");
		res.redirect("/campgrounds");
	})
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
