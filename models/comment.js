const mongoose = require("mongoose");

//Comment Schema
const commentSchema = new mongoose.Schema({
	text: String,
	author: String
});

module.exports = mongoose.model("Comment", commentSchema);