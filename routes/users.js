const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/user");

const catchAsync = require("../utils/catchAsync");

router.get("/register", (req, res) => {
	res.render("users/register");
});

router.post(
	"/register",
	catchAsync(async (req, res) => {
		try {
			const { username, password, email } = req.body;
			const user = new User({ email, username });
			const result = await User.register(user, password);
			req.flash("success", "Welcome to yelpcamp");
			res.redirect("/campgrounds");
		} catch (e) {
			req.flash("error", e.message);
			res.redirect("/register");
		}
	})
);

router.get("/login", (req, res) => {
	res.render("users/login");
});

router.post(
	"/login",
	passport.authenticate("local", {
		failureFlash: true,
		failureRedirect: "/login",
	}),
	(req, res) => {
		req.flash("success", "Welcome back");
		res.redirect("/campgrounds");
	}
);

router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Goodbye");
	res.redirect("/campgrounds");
});

module.exports = router;
