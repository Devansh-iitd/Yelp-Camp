const Campground = require('./models/campground');
const { campgroundSchema, reviewSchema } = require('./schemas.js')
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review.js');
module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {

        req.session.returnTo = req.originalUrl;

        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {

        res.locals.returnTo = req.session.returnTo;
    }

    next();
}

module.exports.authorize = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    if (!campground.author.equals(req.user._id) && req.user) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const review = await Review.findById(req.params.reviewId);
    if (!req.user._id.equals(review.author)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${req.params.id}`);
    }
    next();
}



