const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken = process.env.MAPBOX_TOKEN;
const { cloudinary } = require("../cloudinary");

const cities = require("../seeds/cities");

const geocoder = mbxGeocoding({ accessToken: mapboxToken });

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
	images = req.files.map((f) => ({
		url: f.path,
		filename: f.filename,
	}));
	// console.log(update);
	const see = await Campground.findByIdAndUpdate(id, update, {
		new: true,
		runValidators: true,
	});
	see.images.push(...images);
	const geoData = await geocoder
		.forwardGeocode({
			query: req.body.campground.location,
			limit: 1,
		})
		.send();
	see.geometry = geoData.body.features[0].geometry;
	await see.save();
	if (req.body.deleteImages) {
		for (let filename of req.body.deleteImages) {
			await cloudinary.uploader.destroy(filename);
		}
		await see.updateOne({
			$pull: { images: { filename: { $in: req.body.deleteImages } } },
		});
	}
	req.flash("success", "Successfully updated the campground");
	res.redirect(`/campgrounds/${see._id}`);
	// res.send("successful");
};

module.exports.deleteCampgroundById = async (req, res) => {
	const { id } = req.params;
	const ground = await Campground.findById(id);
	if (!ground) {
		req.flash("error", "Requested campground cannot be found");
		return res.redirect("/campgrounds");
	}
	if (ground.images.length) {
		for (let img of ground.images) {
			await cloudinary.uploader.destroy(img.filename);
		}
	}
	await Campground.findByIdAndDelete(id);
	req.flash("success", "Successfully deleted the campground");
	res.redirect("/campgrounds");
};

module.exports.createCampground = async (req, res, next) => {
	// if (!req.body.campground)
	// 	throw new ExpressError("Send required data please", 400);
	const geoData = await geocoder
		.forwardGeocode({
			query: req.body.campground.location,
			limit: 1,
		})
		.send();
	// console.log(geoData.body.features[0].geometry);
	const ground = new Campground(req.body.campground); // to handle the async error
	ground.geometry = geoData.body.features[0].geometry;
	ground.author = req.user._id;
	ground.images = req.files.map((f) => ({
		url: f.path,
		filename: f.filename,
	}));
	await ground.save().then((d) => {
		console.log(d);
	});
	req.flash("success", "Created a new campground!!!");
	res.redirect(`/campgrounds/${ground._id}`);
};
