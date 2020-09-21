import express from "express";
import Campground from '../models/campground.js';

const router = express.Router();

//INDEX
router.get("/", (req, res) => {
	Campground.find({}, (err, campgrounds) => {
		if (err) {
			console.log("Error accessing the campgrounds database");
			console.error(err);
			res.render("campgrounds/index", {campgrounds:[], error:err});
		} else {
			res.render("campgrounds/index", {campgrounds:campgrounds, error:null});
		}
	});
})

//CREATE Campground
router.post("/", loginRequired, (req, res) => {
	//get data from form, add to campgrounds array
	let newName = req.body.name;
	let newURL = req.body.image;
	let newDescription = req.body.description;
	let author = {
		id: req.user._id,
		username: req.user.username
	}
	let newCampground = {name:newName, image:newURL, description: newDescription, author: author}
	

	Campground.create(newCampground, (err, campground) => {
		if (err) {
			console.error(err);
		} else {
			console.log(campground);
		}
		//redirect to campgrounds, no matter what
		res.redirect("campgrounds");
	})
	
})

//NEW Campground
router.get("/new", loginRequired, (req, res) => {
	res.render("campgrounds/new");
})

//SHOW Campground
router.get("/:id", (req, res) => {
	let id = req.params.id;
	Campground.findById(id).populate("comments").exec( (err, campground) => {
		if(err) {
			console.error(err);
		} else {
			res.render("campgrounds/show", {campground:campground});
		}
	});
});

//middleware
function loginRequired(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

export default router;