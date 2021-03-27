const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
	const grounds = await Campground.find({});
	res.render("campground/show", { grounds });
};

module.exports.newCampgroundForm = (req, res) => {
	res.render("campground/new", { cities }); // route for displaying form to create a new campground
};

module.exports.getCampgroundById = async (req, res) => {
	const { id } = req.params;
	const ground = await Campground.findById(id)
		.populate({
			path: "reviews",
			populate: {
				path: "author",
			},
		})
		.populate("author");
	if (!ground) {
		req.flash("error", "Requested campground cannot be found");
		return res.redirect("/campgrounds");
	}
	res.render("campground/details", { ground });
};

module.exports.editCampgroundForm = async (req, res) => {
	const { id } = req.params;
	const ground = await Campground.findById(id);
	if (!ground) {
		req.flash("error", "Requested campground cannot be found");
		return res.redirect("/campgrounds");
	}
	res.render("campground/edit", { ground, cities });
};

module.exports.editCampgroundById = async (req, res) => {
	const { id } = req.params;
	const update = req.body.campground;
	console.log(update);
	const see = await Campground.findByIdAndUpdate(id, update, {
		new: true,
		runValidators: true,
	});
	req.flash("success", "Successfully updated the campground");
	res.redirect(`/campgrounds/${see._id}`);
};
