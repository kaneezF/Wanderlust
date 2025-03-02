const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req , res , next) => {
    if(!req.isAuthenticated()){
        //when user is not logged in and trying to acces edit or delete or create listing they need to login and then redirect to the same path 
        //path--->need to login--->Log in---->redirect to same path(redirectUrl)
        req.session.redirectUrl = req.originalUrl;
        req.flash("danger" , "You must log in first");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req , res , next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
//saving redirectUrl in locals because as soon as you log in, passport clears everything from your session 
//and hence you will not be redirected to the correct create/edit/delete page


//to check if the curruser is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the owner of the listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//Schema validation function middleware
module.exports.validateListing = (req , res , next) => {
    let { error } = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map(( el ) => el.message).join(",");
        throw new ExpressError(400 , errMsg);
    }
    else{
        next();
    }
}

//Schema validation function middleware
module.exports.validateReview = (req , res , next) => {
    let { error } = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map(( el ) => el.message).join(",");
        throw new ExpressError(400 , errMsg);
    }
    else{
        next();
    }
}

//to check if the curruser is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id , reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the author of the review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}