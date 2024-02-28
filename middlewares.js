const Campground = require('./models/campground.js');
const Review = require('./models/review');
const { campgroundSchema, reviewSchema } = require('./validationSchemas(joi)');
const ExpressError = require('./utilities/ExpressError');


// campground validation middleware
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

// logged in middleware 
module.exports.isLoggedIn = (req, res, next) => {

    // isAuthenticated is automatically added by passport to the req object
    if (!req.isAuthenticated()) {

        //store the url they are requesting in the session and redirect to that that page
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!!');
        return res.redirect('/login');
    }
    next();
}

// authorization middleware
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', "Couldn't find Camground");
    }
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', "You do not have permission to do that");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

// review validation middleware
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};


// authorization middleware
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId);
    if (!review) {
        req.flash('error', "Couldn't find Camground");
    }
    if (!review.author.equals(req.user._id)) {
        req.flash('error', "You do not have permission to do that");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}