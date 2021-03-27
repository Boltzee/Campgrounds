const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/user");

const users = require("../controllers/users");

const catchAsync = require("../utils/catchAsync");

// The router club for '/register'

router
	.route("/register")
	.get(users.registerForm)
	.post(catchAsync(users.createUser));

//

// The router club for '/login'

router
	.route("/login")
	.get(users.loginForm)
	.post(
		passport.authenticate("local", {
			failureFlash: true,
			failureRedirect: "/login",
		}),
		users.userLogin
	);

//

router.get("/logout", users.userLogout);

module.exports = router;
