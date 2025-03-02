const Wishlist = require('../models/wishlist');
const Listing = require('../models/listing');

module.exports.addWishList = async (req, res) => {
    const userId = req.user._id; // Logged-in user's ID
    const listingId = req.params.listingId; // Listing ID from URL

    try {
        // Verify the listing exists
        const listing = await Listing.findById(listingId);
        if (!listing) {
            req.flash('error', 'Listing not found');
            return res.redirect('./listings/index.ejs');
        }

        // Check if a wishlist already exists for the user
        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            // Create a new wishlist if none exists
            wishlist = new Wishlist({ user: userId, listings: [listingId] });
        } else {
            // Add the listing to the wishlist if it's not already added
            if (!wishlist.listings.includes(listingId)) {
                wishlist.listings.push(listingId);
            }
        }

        await wishlist.save();
        req.flash('success', 'Listing added to your wishlist');
        res.redirect('/wishlist'); // Redirect to the wishlist page
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong');
        res.redirect('./listings/index.ejs');
    }
};

// Show wishlist
module.exports.showWishlist = async (req, res) => {
    const userId = req.user._id;

    try {
        const wishlist = await Wishlist.findOne({ user: userId }).populate('listings');
        res.render('./wishlist/showWishlist.ejs', { wishlist });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Cannot load wishlist');
        res.redirect('./listings/index.ejs');
    }
};

//Remove wishlist
module.exports.removeFromWishList = async (req, res) => {
    const userId = req.user._id; // Logged-in user's ID
    const listingId = req.params.listingId; // Listing ID from URL

    try {
        // Find the user's wishlist
        const wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            req.flash('error', 'Wishlist not found');
            return res.redirect('/wishlist');
        }

        // Remove the listing from the wishlist
        wishlist.listings = wishlist.listings.filter(id => id.toString() !== listingId);

        await wishlist.save();
        req.flash('success', 'Listing removed from your wishlist');
        res.redirect('/wishlist'); // Redirect to the wishlist page
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong');
        res.redirect('/wishlist');
    }
};
