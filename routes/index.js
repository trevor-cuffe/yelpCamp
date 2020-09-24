import express from 'express';
import passport from 'passport';
import User from '../models/user.js';

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
	let newUser = new User({username: req.body.username});
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


export default router;