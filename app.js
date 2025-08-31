if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { listenerCount } = require("process");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const ExpressError = require('./utils/ExpressError');


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const wishlistRouter = require('./routes/wishlist.js');



//mongodb connection
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"

const dbUrl = process.env.ATLAS_DB_URL;

main().then(()=>{console.log("connection successful")}).catch((err)=> console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

//express app
const app = express();

//views setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

//post req
app.use(express.urlencoded({ extended: true }));

//method-override
app.use(methodOverride("_method"));

//ejs mate
app.engine("ejs" , ejsMate);

//use static files
app.use(express.static(path.join(__dirname , "/public")));


//mongo session
const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto: {
        secret : process.env.SECRET,
    },
    touchAfter: 24 * 3600, //if no change in session , so update info after 24hrs
})

store.on("error" , () => {
    console.log("ERROR in MONGO SESSION STORE" , err);
})
//session
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,    // todays date + 7days*24hours*60min*60sec*1000milisec ---- 1 day=24hr ; 1hr=60min ; 1min=60sec ; 1sec=1000milisec
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
};

//root
// app.get("/" , ( req , res ) => {
//     res.send("I am root");
// })



app.use(session(sessionOptions));
//flash
app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());      //ability to identify users as they browse from page to page--same user is browsing the web app ya fir diff diff users hai
passport.use(new LocalStrategy(User.authenticate()));    //authenticate user using localstrategy

passport.serializeUser(User.serializeUser());  //store user info in session
passport.deserializeUser(User.deserializeUser());   //remove user  info from session


//flash middleware
app.use((req, res , next) => {
    res.locals.success = req.flash("success");
    res.locals.danger = req.flash("danger");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


//router
app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" , userRouter);
app.use(wishlistRouter);

app.get("/", (req, res) => {
  res.redirect("/listings");
});

//error handling for incorrect path
app.all("*" , (req , res , next) => {
    next(new ExpressError(401 , "Page not found!"))
})

//Errror handling middleware
app.use((err, req , res , next) => {
    // res.send("something went wrong")
    let { statusCode=500 , message="something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.render("./listings/error.ejs" , {message});
})


app.listen(8080 , ()=>{
    console.log("server started");
})
