const Listing = require("../models/listing");


module.exports.index = async ( req , res ) => {
    // let allListings = await Listing.find();
    // res.render("./listings/index.ejs" , { allListings });
    const { category } = req.query; // Get the category from the query string
    let allListings;

    if (category) {
        // Filter listings by category if a category is provided
        allListings = await Listing.find({ category });
    } else {
        // Show all listings if no category is selected
        allListings = await Listing.find({});
    }

    res.render("listings/index", { allListings });
};



module.exports.renderNewForm = ( req , res ) => {
    res.render("./listings/new.ejs")
};

module.exports.showListing = async ( req , res ) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ 
            path: "reviews", 
            populate: { 
                path: "author" 
                    },
         })
        .populate("owner");

    if(!listing){
        req.flash("error" , "Listing does not exist");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs" , { listing });
};

module.exports.createListing = async ( req , res, next ) => {
    // if(!req.body.listing){
    //     throw new ExpressError(400 , "Send valid listing data")
    // }

    //converting this below error handling into middleware
    // let result = listingSchema.validate(req.body);
    // if(result.error) {
    //     throw new ExpressError(400 , result.error);
    // }
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing({
        ...req.body.listing,
        owner: req.user._id,
        image: { url, filename },
    });
   
    await newListing.save();
    //flash
    req.flash("success" , "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async ( req , res ) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , "Listing does not exist");
        res.redirect("/listings");
    }

    let originalImgUrl = listing.image.url;
    originalImgUrl = originalImgUrl.replace("/upload" , "/upload/h_200,w_250");
    res.render("./listings/edit.ejs" , { listing, originalImgUrl });
};


module.exports.updateListing = async( req , res ) => {
    // if(!req.body.listing){
    //     throw new ExpressError(400 , "Send valid listing data")
    // }
    let { id } = req.params;
    //storing the updated listing in 'listing' variable and then adding image url and filename and again saving it
    let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});

    //but checking if no image is changed then no need to add url and filename, 
    //therefore first checking if req.file is not undefined then storing new url and filename of image
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url , filename};
    await listing.save();
    }
    //flash
    req.flash("success" , "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async( req , res ) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);   //post middleware for deleting the review after deleting the listing
    //flash
    req.flash("danger" , "Listing Deleted!");
    res.redirect("/listings");
}



