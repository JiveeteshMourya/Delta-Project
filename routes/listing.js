const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js"); // isme curly bracket isliye lgate kyuki poori file me se specific fnx chahiye

// Importing Controllers
const listingController = require("../controllers/listings.js");

const multer  = require('multer');

const {storage} = require("../cloudConfig.js");

const upload = multer({ storage });

// Compact Routing
router.route("/")
    .get(
        wrapAsync(listingController.index)
    )
    .post( 
        isLoggedIn, 

        upload.single('listing[image]'),

        validateListing, 

        wrapAsync(listingController.createListing)
    );
    // .post( upload.single('listing[image]'), (req, res) => {
    //     // res.send(req.body);
    //     res.send(req.file);
    // });

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm); // isko show route se upr isliye rkha kyuki, isko show route
    //  ke niche hone pr isko as "/listing/:id" interpret kiya ja rha tha

router.route("/:id")
    // show route
    .get(wrapAsync(listingController.showListing))
    // update route
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    // delete route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// // Index Route
// router.get("/", wrapAsync(listingController.index));

// // Show Route
// router.get("/:id", wrapAsync(listingController.showListing));

// // Create Route
// router.post(
//     "/", 
//     isLoggedIn, 
//     validateListing, 
//     wrapAsync(listingController.createListing)
// );

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// // Update Route
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

// // Delete Route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;