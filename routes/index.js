import express from 'express';
import passport from 'passport';
import User from '../models/user.js';
import Campground from '../models/campground.js';
import middlewareObj from '../middleware/index.js';

const router = express.Router();


//Root Route
router.get("/", (req, res) => {
	res.render("landing");
});


//===========
//AUTH ROUTES
//===========

//Show Register Form
router.get("/register", (req, res) => {
	res.render("register");
});

//Handle signup logic
router.post("/register", (req, res) => {
	let newUser = new User({
		username: req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email
	});
	if(req.body.avatar) newUser.avatar = req.body.avatar;
	if(process.env.adminCode && process.env.adminCode === req.body.adminCode) {
		newUser.isAdmin = true;
		req.flash("success","Admin Privileges Assigned");
	}
	User.register(newUser, req.body.password, (err) => {
		if (err) {
			console.error(err);
			req.flash("error", err.message);
			res.redirect("register");
		}
		passport.authenticate("local")(req, res, () => {
			req.flash("success", `Welcome to YelpCamp, ${req.user.username}!`);
			res.redirect("/campgrounds");
		});
	}); 
	
});

//Show Login Form
router.get("/login", (req, res) => {
	res.render("login");
});

//Handle login logic
router.post("/login", passport.authenticate("local",
	{
		failureFlash: true,
		failureRedirect: "/login"
	}), (req, res) => {
		req.flash("success", "Successfully logged in");
		res.redirect("/campgrounds");
});

//Logout route
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Successfully logged out");
	res.redirect("/campgrounds");
});


//USER PROFILE
//SHOW
router.get("/users/:id", (req, res) => {
	User.findById(req.params.id, (err, foundUser) => {
		if(err) {
			req.flash("error", "User profile not found");
			res.redirect("/");
		} else {
			Campground.find().where('author.id').equals(foundUser._id).exec( (err, campgrounds) => {
				if(err) {
					console.error(err);
					req.flash("error", "Error loading user profile");
				}
				res.render("users/show", {user: foundUser, campgrounds: campgrounds});
			});
		}
	});
});

//EDIT
router.get("/users/:id/edit", middlewareObj.userMatchRequired, (req,res) => {
	User.findById(req.params.id, (err, foundUser) => {
		if(err) {
			req.flash("error", "User profile not found");
			res.redirect("/campgrounds");
		}
		res.render("users/edit", {user: foundUser});
	});
});

//UPDATE
router.put("/users/:id", middlewareObj.userMatchRequired, (req, res) => {
	User.findByIdAndUpdate(req.params.id, req.body, (err, foundUser) => {
		if(err) {
			req.flash("error", "Error: Could not update user profile");
		} else {
			req.flash("success", "Your updates have been applied!");
		}
		res.redirect("/users/" + req.params.id);
	});
});


export default router;