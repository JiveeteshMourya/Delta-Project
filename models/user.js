const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    // username aur password passport-local-mongoose apne aap define kr deta hai
    // schema me isliye unhe bnane ki zaroorat nhi
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);