const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/register", (req, res) => {
	res.render("users/register");
});

router.post("/register", async (req, res) => {
	console.log(req.body);
	res.send("Successfully added you... Welcome to the family!!");
});

module.exports = router;
