const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req , res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
   //console.log(newReview);
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    //flash
    req.flash("success" , "New review Created!");
    res.redirect(`/listings/${id}`)
};

module.exports.destroyReview = async(req , res)=>{
    let { id , reviewId } = req.params;
    // The $pull operator removes from an existing array all instances of a value or values that match a specified condition.
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    //flash
    req.flash("danger" , "Review Deleted!");
    res.redirect(`/listings/${id}`);
};