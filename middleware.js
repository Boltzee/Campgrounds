module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash("error", "You must be signed in to continue");
		return res.redirect("/login");
	}
	next();
};

module.exports.validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

module.exports.isAuthor = async (req, res, next) => {
	const { id } = req.params;
	const ground = await Campground.findById(id);
	if (!ground.author.equals(req.user._id)) {
		req.flash("error", "You do not have the permission to do that");
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
};