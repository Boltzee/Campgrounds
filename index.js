const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const app = express();
const ejsMate = require("ejs-mate");
const Joi = require("joi");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/expressError");
const Campground = require("./models/campground");
const cities = require("./seeds/cities");
const Review = require("./models/review");
const { campgroundSchema } = require("./schemas.js");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // all the middlewares
app.use(methodOverride("_method"));

// Custom defined middleware functions

const validateCampground = (req, res, err) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

//

app.engine("ejs", ejsMate);

app.set("view engine", "ejs"); /// all the app sets
app.set("views", path.join(__dirname, "views"));

/// Connecting to the mongo database

mongoose.connect("mongodb://localhost:27017/YelpCamp", {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database Connected");
});
//

// The / route
app.get("/", (req, res) => {
	res.render("home");
});
//

// The index route -- basically shows all the campgrounds in the database

app.get(
	"/campgrounds",
	catchAsync(async (req, res) => {
		const grounds = await Campground.find({});
		res.render("campground/show", { grounds });
	})
);
//

// The details route -- shows info about a single campground

app.get("/campgrounds/new", (req, res) => {
	res.render("campground/new", { cities });
});

app.get(
	"/campgrounds/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const ground = await Campground.findById(id);
		res.render("campground/details", { ground });
	})
);

//

// The edit/patch route --

app.get(
	"/campgrounds/:id/edit",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const ground = await Campground.findById(id);
		res.render("campground/edit", { ground, cities });
	})
);

app.patch(
	"/campgrounds/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const update = req.body.campground;
		console.log(update);
		const see = await Campground.findByIdAndUpdate(id, update, {
			new: true,
			runValidators: true,
		});
		res.redirect(`/campgrounds/${see._id}`);
	})
);

//

// The DELETE route --

app.delete(
	"/campgrounds/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Campground.findByIdAndDelete(id);
		res.redirect("/campgrounds");
	})
);

//

// NEW CAMPGROUND route

/// order where the app.get(new ) is placed matters so i placed it in front of the /campgrounds/:id get req

app.post(
	"/campgrounds",
	validateCampground,
	catchAsync(async (req, res, next) => {
		// if (!req.body.campground)
		// 	throw new ExpressError("Send required data please", 400);

		const ground = new Campground(req.body.campground); // to handle the async error
		await ground.save();
		res.redirect(`/campgrounds/${ground._id}`);
	})
);

//

// Route for creating a new review for a perticular campground

app.post("/campgrounds/:id/review", async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	const { review } = req.body;
	const rev = new Review(review);
	campground.reviews.push(rev);
	await campground.save();
	await rev.save();
	res.redirect(`/campgrounds/${campground._id}`);
	// console.log(review);
	// res.send(review);
});

//

// 404 response page

app.all("*", (req, res, next) => {
	next(
		new ExpressError(
			"Sorry, but the page that your are looking for is not available",
			404
		)
	);
});

//

// Custom defined error handler

app.use((err, req, res, next) => {
	const { status = 500 } = err;
	if (!err.message) err.message = "OHH NO! Something went wrong";
	res.status(status).render("error", { err });
});

//

app.listen(3000, () => {
	console.log("LISTENING ON PORT 3000");
});
