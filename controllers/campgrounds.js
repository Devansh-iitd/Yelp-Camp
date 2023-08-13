//Controllers for campgrounds store all logic for the routes in the campgrounds routes file
const { cloudinary } = require('../cloudinary');
const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });

module.exports.index = (async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
});

module.exports.renderNewForm = (req, res) => {

    res.render('campgrounds/new')
};

module.exports.makenew = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()


    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)


};

module.exports.show = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews', // populate reviews
        populate: {
            path: 'author' // populate author of review
        }
    }).populate('author');

    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground })
};

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
};

module.exports.update = async (req, res) => {
    const { deleteImages } = req.body;


    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    if (deleteImages) {
        for (let filename of deleteImages) {
            await cloudinary.uploader.destroy(filename);
            if (campground.images.length > 0) {
                campground.images = campground.images.filter(img => img.filename !== filename);
            }

        }
        await campground.save();
        req.flash('success', 'Successfully updated campground!');
        res.redirect(`/campgrounds/${campground._id}`)
    };
};

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
};