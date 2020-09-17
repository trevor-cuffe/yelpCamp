//App Config
const express 	 = require('express'),
	  app 		 = express(),
	  bodyParser = require('body-parser'),
	  mongoose	 = require('mongoose'),
	  Campground = require("./models/campground"),
	  Comment	 = require("./models/comment"),
	  seedDB     = require("./seeds");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

//fix mongoose deprecation warnings:
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
//connect to Mongo db
mongoose.connect("mongodb://localhost:27017/yelp_camp");

// seedDB();

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
app.post("/campgrounds", (req, res) => {
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
app.get("/campgrounds/new", (req, res) => {
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
app.get("/campgrounds/:id/comments/new", (req, res) => {
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
app.post("/campgrounds/:id/comments", (req, res) => {
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





//Page Not Found
app.get("/*", (req, res) => {
	res.render("error");
})


app.listen(3000, () => {
	console.log("Serving YelpCamp on port 3000");
})