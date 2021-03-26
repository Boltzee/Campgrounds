const express = require("express");
const mongoose = require("mongoose");
const campgrounds = require('./routes/campgrounds');
const methodOverride = require("method-override");
const path = require("path");
const app = express();
const ejsMate = require("ejs-mate");
// const Joi = require("joi");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/expressError");
const Review = require("./models/review");
const { reviewSchema } = require("./schemas.js");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // all the middlewares
app.use(methodOverride("_method"));

app.use('/campgrounds', campgrounds);

// Custom defined middleware functions



const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
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
	useFindAndModify: false
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



// Route for creating a new review for a perticular campground

app.post(
	"/campgrounds/:id/review",
	validateReview,
	catchAsync(async (req, res) => {
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
	})
);

//

// Route for deleting a perticular review of a campground

// var removeByAttr = function (arr, attr, value) {
// 	/// function to delete an review from the reviews array
// 	var i = arr.length;
// 	while (i--) {
// 		if (arr[i] && arr[i][attr] == value) {  				/// Once used now out of date.
// 			arr.splice(i, 1);
// 		}
// 	}
// 	return arr;
// };

app.delete(
	"/campgrounds/:groundId/review/:reviewId",
	catchAsync(async (req, res) => {
		const { groundId, reviewId } = req.params;
		// let ground = await Campground.findById(groundId).populate("reviews");
		// console.log(ground);

		await Campground.findByIdAndUpdate(groundId, {
			$pull: { reviews: reviewId },
		}); // New more powerful

		// removeByAttr(ground.reviews, "_id", reviewId);
		// await ground.save().then((d) => {
		// 	d.populate("reviews");
		// 	console.log(d);
		// });
		const review = await Review.findByIdAndDelete(reviewId);
		console.log(review);
		res.redirect(`/campgrounds/${groundId}`);
	})
);

//

// Route for Edit/Patch a perticular review

app.patch(
	"/campgrounds/:groundId/review/:reviewId",
	validateReview,
	catchAsync(async (req, res) => {
		const { groundId, reviewId } = req.params;
		const update = req.body.review;
		console.log(update);
		const see = await Review.findByIdAndUpdate(reviewId, update, {
			new: true,
		});
		console.log(see);
		res.redirect(`/campgrounds/${groundId}`);
	})
);

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
