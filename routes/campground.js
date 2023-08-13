const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas.js')
const { isLoggedIn, authorize, validateCampground } = require('../middleware');
const Review = require('../models/review.js');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');// this is for uploading images
const { storage } = require('../cloudinary/index');// this is for uploading images
//const upload = multer({ storage });// this is for uploading images
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB (adjust the size limit as needed)
    },
});


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.makenew));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.show))
    .put(isLoggedIn, authorize, upload.array('image'), validateCampground, catchAsync(campgrounds.update))
    .delete(isLoggedIn, authorize, catchAsync(campgrounds.delete));

router.get('/:id/edit', isLoggedIn, catchAsync(campgrounds.renderEditForm));


module.exports = router;