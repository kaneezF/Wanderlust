const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/user.js");


router.route("/signup")
    .get(userController.renderSignupForm)   //signup route
    .post(wrapAsync (userController.signup));   //after clicking signup btn

router.route("/login")
    .get(userController.renderLoginForm)  //login route
    .post(saveRedirectUrl ,passport.authenticate('local', { failureRedirect: '/login' , failureFlash: true }) , 
    userController.login);  //after clicking login btn


// //signup route
// router.get("/signup" , userController.renderSignupForm);

// //after clicking signup btn---post req
// router.post("/signup" , wrapAsync (userController.signup));

//login route
// router.get("/login" , userController.renderLoginForm);

//after clicking login btn
//ERROR:When logging in without redirecting from a protected page, 
//the res.locals.redirectUrl may be undefined, causing a "Page not found" error. 
//To fix this, set a default redirect path (e.g., /listings) in the saveRedirectUrl middleware 
//if req.session.redirectUrl is not present. for the below code
// router.post("/login" , saveRedirectUrl ,passport.authenticate('local', { failureRedirect: '/login' , failureFlash: true }) , async( req , res) => {
//     req.flash("success" , "You are logged in!");
//     res.redirect(res.locals.redirectUrl);
// });

//after clicking login btn
// router.post("/login" , saveRedirectUrl ,passport.authenticate('local', { failureRedirect: '/login' , failureFlash: true }) , userController.login);


//logout route
router.get("/logout" , userController.logout);

module.exports = router;