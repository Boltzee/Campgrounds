const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
	const grounds = await Campground.find({});
	res.render("campground/show", { grounds });
};

module.exports.newCampgroundForm = (req, res) => {
	res.render("campground/new", { cities }); // route for displaying form to create a new campground
};
