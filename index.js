const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const app = express();
const Campground = require("./models/campground");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // all the middlewares
app.use(methodOverride("_method"));

app.set("view engine", "ejs"); /// all the app sets
app.set("views", path.join(__dirname, "views"));

/// Connecting to the mongo database

mongoose
	.connect("mongodb://localhost:27017/YelpCamp", {
		useNewUrlParser: true,
		useCreateIndex : true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("We are successfully connected to the database");
	})
	.catch((err) => {
		console.log("OHH No! we have encountered an error");
		console.log(err);
	});

//

app.get("/", (req, res) => {
	// res.send("we are on the homepage of the application");
	res.render("home");
});

app.listen(3000, () => {
	console.log("LISTENING ON PORT 3000");
});
