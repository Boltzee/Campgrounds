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

module.exports.loginForm = (req, res) => {
	res.render("users/login");
};

module.exports.userLogin = (req, res) => {
	req.flash("success", "Welcome back");
	const redirectUrl = req.session.returnTo || "/campgrounds";
	delete req.session.returnTo;
	res.redirect(redirectUrl);
};

module.exports.userLogout = (req, res) => {
	req.logout();
	req.flash("success", "Goodbye");
	res.redirect("/campgrounds");
};
