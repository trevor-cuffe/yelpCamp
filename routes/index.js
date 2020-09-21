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
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			console.error(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, () => {
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
		failureRedirect: "/login"
	}), (req, res) => {
		res.redirect("/campgrounds");
});

//Logout route
router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/campgrounds");
})



//middleware
function loginRequired(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

export default router;