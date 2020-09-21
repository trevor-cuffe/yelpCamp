//App Config
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import sessions from 'client-sessions';

import Campground from "./models/campground.js";
import Comment from "./models/comment.js";
import User from "./models/user.js";
// import seedDB from "./seeds.js";

	  
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("/public"));
app.set("view engine", "ejs");

//fix mongoose deprecation warnings:
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
//connect to Mongo db
mongoose.connect("mongodb://localhost:27017/yelp_camp");

// seedDB();


//Passport Configuration
app.use(sessions({
	cookieName: "session",
	secret: "alxljf9082lixk9u8xlkchvp1304jvvmxoaueb4",
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
	httpOnly: true,
	secure: true,
	ephemeral: true
}));


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

app.use( (req, res, next) => {
	res.locals.currentUser = req.user;
	return next();
})

//***** ROUTES *****//

//Landing Page
app.get("/", (req, res) => {
	res.render("landing");
})

//INDEX
app.get("/campgrounds", (req, res) => {
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

//CREATE
app.post("/campgrounds", loginRequired, (req, res) => {
	//get data from form, add to campgrounds array
	let newName = req.body.name;
	let newURL = req.body.image;
	let newDescription = req.body.description;
	let newCampground = {name:newName, image:newURL, description: newDescription}
	
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

//NEW
app.get("/campgrounds/new", loginRequired, (req, res) => {
	res.render("campgrounds/new");
})

//SHOW
app.get("/campgrounds/:id", (req, res) => {
	let id = req.params.id;
	Campground.findById(id).populate("comments").exec( (err, campground) => {
		if(err) {
			console.error(err);
		} else {
			res.render("campgrounds/show", {campground:campground});
		}
	});
});


//*****************//
//COMMENTS ROUTES: //
//*****************//

//NEW
app.get("/campgrounds/:id/comments/new", loginRequired, (req, res) => {
	let id = req.params.id;
	Campground.findById(id, (err, campground) => {
		if (err) {
			console.error(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

//CREATE
app.post("/campgrounds/:id/comments", loginRequired, (req, res) => {
	let id = req.params.id;
	Campground.findById(id, (err, campground) => {
		if (err) {
			console.error(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if (err) {
					console.error(err);
					res.redirect(`/campgrounds/${id}`);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect(`/campgrounds/${id}`);
				}
			});
		}
	});
});


//===========
//AUTH ROUTES
//===========

//Show Register Form
app.get("/register", (req, res) => {
	res.render("register");
});

//Handle signup logic
app.post("/register", (req, res) => {
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
app.get("/login", (req, res) => {
	res.render("login");
});

//Handle login logic
app.post("/login", passport.authenticate("local",
	{
		failureRedirect: "/login"
	}), (req, res) => {
		res.redirect("/campgrounds");
});

//Logout route
app.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/campgrounds");
})




function loginRequired(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}


//Page Not Found
app.get("/*", (req, res) => {
	res.render("error");
})

let port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Serving YelpCamp on port ${port}`);
})