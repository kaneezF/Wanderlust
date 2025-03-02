const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//Listings


// app.get("/testListing" , async ( req , res ) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the Beach ",
//         price: 1200,
//         loacation: "Calangute , Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Successful testing");
// })



router.route("/")
    .get(wrapAsync(listingController.index))    //Index route
    .post(isLoggedIn  , upload.single("listing[image]"), validateListing , wrapAsync (listingController.createListing));  //Create  route
    

//to create a new lisitng ---New Route
router.get("/new" , isLoggedIn , listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync (listingController.showListing))   //Show route
    .put(isLoggedIn , isOwner , upload.single("listing[image]") , validateListing, wrapAsync (listingController.updateListing))  //update route
    .delete(isLoggedIn , isOwner , wrapAsync (listingController.destroyListing));   //delete route

//editing the listing ---Edit Route
router.get("/:id/edit", isLoggedIn , isOwner , wrapAsync (listingController.renderEditForm));







//show all listings ----Index Route
// router.get("/" , wrapAsync(listingController.index));


//to create a new lisitng ---New Route
// router.get("/new" , isLoggedIn , listingController.renderNewForm);


//add new listing in db -- Create Route 
// router.post("/" , validateListing , isLoggedIn , wrapAsync (listingController.createListing));

//details of specific listing --- Show Route
// router.get("/:id" , wrapAsync (listingController.showListing));


//editing the listing ---Edit Route
// router.get("/:id/edit", isLoggedIn , isOwner , wrapAsync (listingController.renderEditForm));


//updating the edited listing ---Update route
// router.put("/:id" , isLoggedIn , isOwner ,validateListing, wrapAsync (listingController.updateListing));


//Delete listing
// router.delete("/:id", isLoggedIn , isOwner , wrapAsync (listingController.destroyListing));

module.exports = router;