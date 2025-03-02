const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist');
const { isLoggedIn } = require('../middleware');

// Add listing to wishlist
router.post('/wishlist/add/:listingId', isLoggedIn, wishlistController.addWishList);

// Show wishlist page
router.get('/wishlist', isLoggedIn, wishlistController.showWishlist);

// Remove listing from wishlist
router.post('/wishlist/remove/:listingId', isLoggedIn, wishlistController.removeFromWishList);


module.exports = router;
