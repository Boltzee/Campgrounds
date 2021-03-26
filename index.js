const express = require("express");
const app = express();

const mongoose = require("mongoose");

const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/expressError");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // all the middlewares
app.use(methodOverride("_method"));


app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/review", reviews);


app.engine("ejs", ejsMate);

app.set("view engine", "ejs"); /// all the app sets
app.set("views", path.join(__dirname, "views"));



/// Connecting to the mongo database

mongoose.connect("mongodb://localhost:27017/YelpCamp", {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
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
