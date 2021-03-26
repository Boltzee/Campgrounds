const express = require("express");
const router = express.Router();

const validateCampground = (req, res, err) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

// The index route -- basically shows all the campgrounds in the database

router.get(
	"/campgrounds",
	catchAsync(async (req, res) => {
		const grounds = await Campground.find({});
		res.render("campground/show", { grounds });
	})
);
//

// The details route -- shows info about a single campground

router.get("/campgrounds/new", (req, res) => {
	res.render("campground/new", { cities }); // route for displaying form to create a new campground
});

router.get(
	"/campgrounds/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const ground = await Campground.findById(id).populate("reviews");
		res.render("campground/details", { ground });
	})
);

//

// The edit/patch route --

router.get(
	"/campgrounds/:id/edit",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const ground = await Campground.findById(id);
		res.render("campground/edit", { ground, cities });
	})
);

router.patch(
	"/campgrounds/:id",
	validateCampground,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const update = req.body.campground;
		console.log(update);
		const see = await Campground.findByIdAndUpdate(id, update, {
			new: true,
			runValidators: true,
		});
		res.redirect(`/campgrounds/${see._id}`);
	})
);

//

// The DELETE route --

router.delete(
	"/campgrounds/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Campground.findByIdAndDelete(id);
		res.redirect("/campgrounds");
	})
);

//

// NEW CAMPGROUND route

/// order where the router.get(new ) is placed matters so i placed it in front of the /campgrounds/:id get req

router.post(
	"/campgrounds",
	validateCampground,
	catchAsync(async (req, res, next) => {
		// if (!req.body.campground)
		// 	throw new ExpressError("Send required data please", 400);

		const ground = new Campground(req.body.campground); // to handle the async error
		await ground.save();
		res.redirect(`/campgrounds/${ground._id}`);
	})
);

//

module.exports = router;
