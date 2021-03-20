const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const app = express();
const Campground = require("./models/campground");
const cities = require("./seeds/cities");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // all the middlewares
app.use(methodOverride("_method"));

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

app.get("/campgrounds", async (req, res) => {
	const grounds = await Campground.find({});
	res.render("campground/show", { grounds });
});
//

// The details route -- shows info about a single campground

app.get("/campgrounds/new", (req, res) => {
	res.render("campground/new", { cities });
});

app.get("/campgrounds/:id", async (req, res) => {
	const { id } = req.params;
	const ground = await Campground.findById(id);
	res.render("campground/details", { ground });
});

//

// The edit/patch route --

app.get('/campgrounds/:id/edit', async (req, res) => {
	const {id} = req.params;
	const ground = await Campground.findById(id);
	res.render('campground/edit', {ground});
})

app.patch('/campground/:id', async (req, res) =>{
	const {id} = req.params;
	const update = req.body.campground;
	const see = await Campground.findByIdAndUpdate(id, update, {new: true, runValidators: true});
	res.redirect(`/campgrounds/${see._id}`);
})

//

// The DELETE route --

app.delete("/campgrounds/:id", async (req, res) => {
	const { id } = req.params;
	await Campground.findByIdAndDelete(id);
	res.redirect("/campgrounds");
});

//

// NEW CAMPGROUND route

/// order where the app.get(new ) is placed matters so i placed it in front of the /campgrounds/:id get req

app.post("/campgrounds", async (req, res) => {
	// console.log(req.body.campground.title);
	// res.send(req.body);
	const ground = new Campground(req.body.campground);
	await ground.save();
	res.redirect(`/campgrounds/${ground._id}`);
});

//

app.listen(3000, () => {
	console.log("LISTENING ON PORT 3000");
});
