import express from 'express';
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

//middleware
function loginRequired(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

export default router;
