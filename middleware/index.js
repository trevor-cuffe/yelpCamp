import Campground from '../models/campground.js';
import Comment from '../models/comment.js';


//all the middleware goes here

let middlewareObj = {}

middlewareObj.loginRequired = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
    }
    req.flash('error', 'You need to be logged in to do that!');
	res.redirect("/login");
}

middlewareObj.campgroundOwnershipRequired = (req, res, next) => {
	//check if logged in
	if (!req.isAuthenticated()) {
		req.flash('error', "You do not have ownership permissions for this campground");
		return res.redirect("back");
	}

	//find campground
	let id = req.params.id;
	Campground.findById(id, (err, campground) => {
		if(err || !campground) {
            console.error(err || "Campground not found");
            req.flash('error', 'Campground not found');
			res.redirect("back");
		} else {
			//campground found - check if the user ID matches author ID
			// //If not correct user - redirect to login
			if(!campground.author.id.equals(req.user._id)) {
                req.flash('error', "You do not have ownership permissions for this campground");
				return res.redirect("back");
			} else {
				return next();
			}
		}
	});
}

middlewareObj.commentOwnershipRequired = (req, res, next) => {
	//check if logged in
	if (!req.isAuthenticated()) {
        req.flash('error', 'Please Login First!');
		return res.redirect("back");
	}

	//find comment
	let id = req.params.comment_id;
	Comment.findById(id, (err, comment) => {
		if(err || !comment) {
			console.error(err || "Comment not found");
            req.flash('error', 'Comment not found');
			return res.redirect("back");
		} else {
			//comment found - check if the user ID matches author ID
			// //If not correct user - redirect to login
			if(!comment.author.id.equals(req.user._id)) {
                req.flash('error', "You do not have ownership permissions for this comment");
				return res.redirect("back");
			} else {
				return next();
			}
		}
	});
}

export default middlewareObj;