const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/user");

const users = require("../controllers/users");

const catchAsync = require("../utils/catchAsync");

router.get("/register", users.registerForm);

router.post("/register", catchAsync(users.createUser));

router.get("/login", users.loginForm);

router.post(
	"/login",
	passport.authenticate("local", {
		failureFlash: true,
		failureRedirect: "/login",
	}),
	users.userLogin
);

router.get("/logout", users.userLogout);

module.exports = router;
