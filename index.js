if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

// console.log(typeof process.env.SECRET);

const express = require("express");
const app = express();

const mongoose = require("mongoose");

const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const User = require("./models/user");

const mongoSanitize = require("express-mongo-sanitize");

const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const helmet = require("helmet");
const MongoDBStore = require("connect-mongo");

const ExpressError = require("./utils/expressError");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // all the middlewares
app.use(methodOverride("_method"));
app.use(mongoSanitize());

/// Connecting to the mongo database

// const db_url = process.env.DB_URL;
// "mongodb://localhost:27017/YelpCamp"
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/YelpCamp";
mongoose.connect(dbUrl, {
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

// Setting up the session for the application.

const store = MongoDBStore.create({
	mongoUrl: dbUrl,
	touchAfter: 24 * 60 * 60,
	crypto: {
		secret: "squirrel",
	},
});

store.on("error", function (err) {
	console.log("session store error :", err);
});

const sessionConfig = {
	store,
	name: "session",
	secret: "thisisnotagoodsecret",
	// secure: true,
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

// Passport setup

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//

// Flash setup

app.use(flash());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success"); // Middleware so that the flash messages
	res.locals.error = req.flash("error"); // are automatically sent to the templates.
	next();
});

//

const scriptSrcUrls = [
	"https://stackpath.bootstrapcdn.com/",
	"https://api.tiles.mapbox.com/",
	"https://api.mapbox.com/",
	"https://kit.fontawesome.com/",
	"https://cdnjs.cloudflare.com/",
	"https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
	"https://cdn.jsdelivr.net",
	"https://kit-free.fontawesome.com/",
	"https://stackpath.bootstrapcdn.com/",
	"https://api.mapbox.com/",
	"https://api.tiles.mapbox.com/",
	"https://fonts.googleapis.com/",
	"https://use.fontawesome.com/",
];
const connectSrcUrls = [
	"https://api.mapbox.com/",
	"https://a.tiles.mapbox.com/",
	"https://b.tiles.mapbox.com/",
	"https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: [],
			connectSrc: ["'self'", ...connectSrcUrls],
			scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
			styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
			workerSrc: ["'self'", "blob:"],
			objectSrc: [],
			imgSrc: [
				"'self'",
				"blob:",
				"data:",
				"https://res.cloudinary.com/chadchampion/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
				"https://images.unsplash.com/",
			],
			fontSrc: ["'self'", ...fontSrcUrls],
		},
	})
);

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/review", reviewRoutes);
app.use("/", userRoutes);

app.engine("ejs", ejsMate);

app.set("view engine", "ejs"); /// all the app sets
app.set("views", path.join(__dirname, "views"));

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
