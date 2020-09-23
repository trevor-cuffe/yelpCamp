import Campground from '../models/campground.js';
import Comment from '../models/comment.js';


//all the middleware goes here

let middlewareObj = {}

middlewareObj.loginRequired = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

middlewareObj.campgroundOwnershipRequired = (req, res, next) => {
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

middlewareObj.commentOwnershipRequired = (req, res, next) => {
	//check if logged in
	if (!req.isAuthenticated()) {
		console.log("YOU NEED TO BE LOGGED IN TO DELETE A COMMENT!!!");
		return res.redirect("back");
	}

	//find comment
	let id = req.params.comment_id;
	Comment.findById(id, (err, comment) => {
		if(err) {
			console.error(err);
			redirect("back");
		} else {
			//comment found - check if the user ID matches author ID
			// //If not correct user - redirect to login
			if(!comment.author.id.equals(req.user._id)) {
				console.log("You do not have ownership access for this comment")
				res.redirect("back");
			} else {
				return next();
			}
		}
	});
}

export default middlewareObj;