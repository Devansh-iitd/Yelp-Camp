const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,// this is the cloud name from cloudinary
    api_key: process.env.CLOUDINARY_KEY,// this is the api key from cloudinary
    api_secret: process.env.CLOUDINARY_SECRET,// this is the api secret from cloudinary
});

const storage = new CloudinaryStorage({
    cloudinary,// this is the cloudinary object from above
    params: {
        folder: 'Yelp',// this is the folder name in cloudinary where the images will be stored
        allowedFormats: ['jpeg', 'png', 'jpg'],// these are the allowed formats for the images
    }
})

module.exports = {
    cloudinary,
    storage,
}