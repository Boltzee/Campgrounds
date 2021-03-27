const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/register", (req, res) => {
	res.render("users/register");
});

router.post("/register", async (req, res) => {
	console.log(req.body);
	const { username, password, email } = req.body;
	const user = new User({ email, username });
	const result = await User.register(user, password);
	// res.send(result);
	// res.send("Successfully added you... Welcome to the family!!");
	req.flash('success', 'Welcome to yelpcamp');
	res.redirect('/campgrounds');
});

module.exports = router;
