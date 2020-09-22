import express from "express";
import Campground from '../models/campground.js';
import Comment from '../models/comment.js';

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

//EDIT Campground
router.get("/:id/edit", ownershipRequired, (req, res) => {
	//find campground
	let id = req.params.id;
	Campground.findById(id, (err, campground) => {
		res.render("campgrounds/edit", {campground: campground});
	});
});


//UPDATE Campground
router.put("/:id", ownershipRequired, (req, res) => {
	let id = req.params.id;
	Campground.findByIdAndUpdate(id, req.body.campground, (err, updatedCampground) => {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect(`/campgrounds/${id}`);
		}
	});
});


//DESTROY Campground
router.delete("/:id", ownershipRequired, (req, res) => {
	let id = req.params.id;
	Campground.findByIdAndRemove(id, (err, removedCampground) => {
		if(err) {
			console.error(err);
		}
		Comment.deleteMany( {
			_id: { $in: removedCampground.comments }
		}, (err) => {
			if(err) {
				console.error(err);
			}
		});
		
		res.redirect("/campgrounds");
	});


});




//middleware
function loginRequired(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

function ownershipRequired(req, res, next) {
	//check if logged in
	if (!req.isAuthenticated()) {
		console.log("YOU NEED TO BE LOGGED IN TO EDIT A CAMPGROUND!!!");
		return res.redirect("back");
	}

	//find campground
	let id = req.params.id;
	Campground.findById(id, (err, campground) => {
		if(err) {
			console.error(err);
			redirect("back");
		} else {
			//campground found - check if the user ID matches author ID
			// //If not correct user - redirect to login
			if(!campground.author.id.equals(req.user._id)) {
				console.log("You do not have ownership access for this campground")
				res.redirect("back");
			} else {
				return next();
			}
		}
	});
}

export default router;