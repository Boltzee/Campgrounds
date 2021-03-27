const passport = require("passport");

const User = require("../models/user");

module.exports.registerForm = (req, res) => {
	res.render("users/register");
};
