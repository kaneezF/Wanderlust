const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

//mongodb connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"

main().then(()=>{console.log("connection successful")}).catch(()=> console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);

}

const initDB = async () => {
    await Listing.deleteMany({}); // Clean up existing listings

    // Categories to assign
    const categories = [
      "Trending",
      "Amazing pools",
      "Amazing views",
      "Boats",
      "Arctic",
      "Castles",
      "Camping",
      "Iconic cities",
      "Farm",
    ];

    
  // Map through data and add owner and category
  initData.data = initData.data.map((obj) =>  {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    return {
        ...obj,
        owner: "67153673cb2398029e2ad6a0", // Add owner
        category: randomCategory  ,      // Add random category
      };
  });
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();