const mongoose = require("mongoose");
const Review = require("./review");

const Schema = mongoose.Schema;

//create  schema
const listingSchema = Schema({
    title: {
        type: String,
        required: true
    },
    image: {
       url: String,
       filename: String
    },

    description: String,
    price: Number,
    location: String,
    country: String, 
    category: {
        type: String,
        required: true,
        enum: [
            'Trending',
            'Amazing pools',
            'Amazing views',
            'Boats',
            'Arctic',
            'Castles',
            'Camping',
            'Iconic cities',
            'Farm'
        ] // Add all your categories here
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"   //referring to Review model
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }, 
});

//middleware
//if listing is deleted also delete the review related to that listing from db
listingSchema.post("findOneAndDelete" , async(listing) => {
    if(listing){
        await Review.deleteMany({ _id: {$in : listing.reviews}});
    }
})

const Listing = mongoose.model("Listing" , listingSchema);

module.exports = Listing;