const Campground = require('../models/campground');
const Review = require('../models/review');


module.exports.makeReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${req.params.id}`);
};

module.exports.deleteReview = async (req, res) => {
    const review = await Review.findById(req.params.reviewId);
    const campground = await Campground.findById(req.params.id);
    const i = campground.reviews.indexOf(review._id)

    campground.reviews.splice(i, i);

    await campground.save()
    await Review.findByIdAndDelete(review._id);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/campgrounds/${req.params.id}`);
};