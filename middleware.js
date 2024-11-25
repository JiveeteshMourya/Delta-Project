const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js"); // const {listingSchema, reviewSchema} = require("../schema.js");
const Review = require("./models/review");

module.exports.isLoggedIn = (req , res, next) => {
    // console.log(req.user);
    // console.log(req);
    // console.log(req.path, ",", req.originalUrl);
    if(!req.isAuthenticated()) {
        // redirectUrl save
        req.session.redirectUrl = req.originalUrl; 
            // login hone pr passport session ko restart kr deta,
            // aur isme restart hone ke pehle ki value store hoti,
            // isliye ye login hone ke baad kaam ki nhi bachti
            // isliye we store this in res.locals see below fnx

        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
    // /login me jab passport user ko login(authenticate) kr rha usse just pehle is fnx ko call lgao
    // yaani uske redirect url ko res.locals me store kro
}

module.exports.isOwner = async(req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// converting schema validation into middleware - Joi ko as fnx use krna
module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
} // isko as middleware pass kr diya create route pr

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async(req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}