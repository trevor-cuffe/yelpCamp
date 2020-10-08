import mongoose from "mongoose";

//Comment Schema
const commentSchema = new mongoose.Schema({
	text: String,
	timestamp: Date,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

export default mongoose.model("Comment", commentSchema);