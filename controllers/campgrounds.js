module.exports.index = async (req, res) => {
	const grounds = await Campground.find({});
	res.render("campground/show", { grounds });
};
