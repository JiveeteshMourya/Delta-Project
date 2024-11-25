const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });



module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
}

module.exports.renderNewForm = (req, res) => {
    // console.log(req.user);
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested for, does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
}

module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient
        .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
        })
        .send();
    // console.log(response.body.features[0].geometry);
    // res.send("done!");

    // let {title, description, image, price, country, location} = req.body;
    // isko hi object bna kr bhi likh skte, see new.ejs ke andr name

    // let listing = req.body.listing;
    // console.log(listing);
    // new Listing(listing);

    // if(!req.body.listing) { // isko bhi ab hta skte, Joi se krne ke baad
    //     throw new ExpressError(400, "Send valid data for listing");
    // }

    const newListing = new Listing(req.body.listing);
    
    // meth 1
        // if(!newListing.title) {
        //     throw new ExpressError(400, "Title is missing !");
        // }
        // if(!newListing.description) {
        //     throw new ExpressError(400, "Description is missing !");
        // }
        // if(!newListing.location) {
        //     throw new ExpressError(400, "Location is missing");
        // }
    // meth 2 - using Joi
        // let result = listingSchema.validate(req.body);
        // console.log(result);
        // if(result.error) {
        //     throw new ExpressError(400, result.error);
        // }

    // console.log(req.user);
    newListing.owner = req.user._id;

    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url, " , ", filename);
    newListing.image = {url, filename};

    newListing.geometry = response.body.features[0].geometry;

    await newListing.save();
    console.log(newListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for, does not exist!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

    res.render("listings/edit.ejs", {listing, originalImageUrl});
}

module.exports.updateListing = async(req, res) => {
    // if(!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for listing");
    // }
    let {id} = req.params;

    // // authorization
    //     let listing = await Listing.findById(id);
    //     if(!listing.owner._id.equals(res.locals.currUser._id)) {
    //         req.flash("error", "You don't have permission to edit!");
    //         return res.redirect(`/listings/${id}`);
    //     }
    // not required after isOwner middleware
        
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }

    // res.redirect("/listings");
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async(req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}