//App Config:
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import sessions from 'client-sessions';
import methodOverride from 'method-override';

//Models:
// import Campground from "./models/campground.js";
// import Comment from "./models/comment.js";
import User from "./models/user.js";

//Routes:
import commentRoutes from "./routes/comments.js";
import campgroundRoutes from "./routes/campgrounds.js";
import indexRoutes from "./routes/index.js";
import campground from './models/campground.js';

//Seed Campgrounds Database:
// import seedDB from "./seeds.js";
	  
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

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
});


//Setup Routes
app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);



//Page Not Found
app.get("/*", (req, res) => {
	res.render("error");
});

let port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Serving YelpCamp on port ${port}`);
})