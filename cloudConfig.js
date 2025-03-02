const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//to integrate cloudinary account with backend we will write cloundinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

//clodinary me wanderlust_DEV folder me saving all files
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedFormats: ["pgn" , "jpg" , "jpeg"],
    },
  });

module.exports = {
    cloudinary,
    storage
};