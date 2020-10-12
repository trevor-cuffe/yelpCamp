import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    avatar: {type:String, default: "/images/defaultAvatar.jpg"},
    email: String,
    isAdmin: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose);

export default mongoose.model("User", UserSchema);