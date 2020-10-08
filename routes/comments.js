import express from 'express';
import Campground from '../models/campground.js';
import Comment from '../models/comment.js';
import middleware from '../middleware/index.js';

const router = express.Router({mergeParams: true});

//NEW Comment
router.get("/new", middleware.loginRequired, (req, res) => {
	let id = req.params.id;
	Campground.findById(id, (err, campground) => {
		if (err) {
			console.error(err);
			req.flash("error", "There was a problem finding the campground");
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

//CREATE Comment
router.post("/", middleware.loginRequired, (req, res) => {
	let id = req.params.id;
	Campground.findById(id, (err, campground) => {
		if (err) {
			console.error(err);
			req.flash("error", "Error: Comment not added");
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if (err) {
					req.flash("error", "Error: Comment not added");
					console.error(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username
					comment.timestamp = new Date();
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", `Your comment has been added to campground "${campground.name}"`);
					res.redirect(`/campgrounds/${id}`);
				}
			});
		}
	});
});

//EDIT Comment
router.get("/:comment_id/edit", middleware.commentOwnershipRequired, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if(err || !campground) {
			console.error(err || "Campground not found");
			req.flash("error", "There was a problem finding the campground");
			res.redirect("back");
		} else {
			Comment.findById(req.params.comment_id, (err, comment) => {
				if (err || !comment) {
					console.error(err || "Comment not found");
					req.flash("error", "There was a problem loading your comment");
					res.redirect("back");
				} else {
					res.render("comments/edit", {campground: campground, comment: comment});
				}
			});
		}
	});
	
});

//UPDATE Comment
router.put("/:comment_id", middleware.commentOwnershipRequired, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
		if (err || !comment) {
			console.error(err || "Comment not found");
			req.flash("error", "Error: Comment not added");
		} else {
			req.flash("success", "Your comment has been updated");
		}
		
		res.redirect(`/campgrounds/${req.params.id}`);
	})
})

//DESTROY Comment
router.delete("/:comment_id", middleware.commentOwnershipRequired, (req, res) => {
	let id = req.params.comment_id;
	Comment.findByIdAndRemove(id, (err) => {
		if(err) {
			console.error(err);
			req.flash("error", "Error: Comment not deleted");
			res.redirect("back");
		} else {
			req.flash("success", "Your comment has been deleted");
			res.redirect(`/campgrounds/${req.params.id}`);
		}
	});
});


export default router;
