const passport = require("passport");

const User = require("../models/user");

module.exports.registerForm = (req, res) => {
	res.render("users/register");
};

module.exports.createUser = async (req, res, next) => {
	try {
		const { username, password, email } = req.body;
		const user = new User({ email, username });
		const result = await User.register(user, password);
		req.login(result, (err) => {
			if (err) return next(err);
			req.flash("success", "Welcome to yelpcamp");
			res.redirect("/campgrounds");
		});
	} catch (e) {
		req.flash("error", e.message);
		res.redirect("/register");
	}
};
