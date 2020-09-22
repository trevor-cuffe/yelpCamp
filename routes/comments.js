import express from 'express';
import campground from '../models/campground.js';
import Campground from '../models/campground.js';
import Comment from '../models/comment.js';

const router = express.Router({mergeParams: true});

//NEW Comment
router.get("/new", loginRequired, (req, res) => {
	let id = req.params.id;
	Campground.findById(id, (err, campground) => {
		if (err) {
			console.error(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

//CREATE Comment
router.post("/", loginRequired, (req, res) => {
	let id = req.params.id;
	Campground.findById(id, (err, campground) => {
		if (err) {
			console.error(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if (err) {
					console.error(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username
					comment.save();
					campground.comments.push(comment);
					campground.save();
					res.redirect(`/campgrounds/${id}`);
				}
			});
		}
	});
});

//EDIT Comment
router.get("/:comment_id/edit", commentOwnershipRequired, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if(err) {
			console.error(err);
			res.redirect("back");
		} else {
			Comment.findById(req.params.comment_id, (err, comment) => {
				if (err) {
					console.error(err);
					res.redirect("back");
				} else {
					res.render("comments/edit", {campground: campground, comment: comment});
				}
			});
		}
	});
	
});

//UPDATE Comment
router.put("/:comment_id", commentOwnershipRequired, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
		if (err) {
			console.error(err);
		}
		
		res.redirect(`/campgrounds/${req.params.id}`);
	})
})

//DESTROY Comment
router.delete("/:comment_id", commentOwnershipRequired, (req, res) => {
	let id = req.params.comment_id;
	Comment.findByIdAndRemove(id, (err) => {
		if(err) {
			console.error(err);
			res.redirect("back");
		} else {
			res.redirect(`/campgrounds/${req.params.id}`);
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

function commentOwnershipRequired(req, res, next) {
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

export default router;
