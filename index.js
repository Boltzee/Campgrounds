const express = require("express");
const app = express();

const mongoose = require("mongoose");

const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");
const users = require("./routes/users");

const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");

const ExpressError = require("./utils/expressError");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // all the middlewares
app.use(methodOverride("_method"));

// Setting up the session for the application.

const sessionConfig = {
	secret: "thisisnotagoodsecret",
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};

app.use(session(sessionConfig));

//

// Flash setup

app.use(flash());

app.use((req, res, next) => {
	// console.log("we are inside");
	res.locals.success = req.flash("success"); // Middleware so that the flash messages
	res.locals.error = req.flash("error"); // are automatically sent to the templates.
	next();
});

//

// Passport setup

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/review", reviews);
app.use("/users", users);

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
