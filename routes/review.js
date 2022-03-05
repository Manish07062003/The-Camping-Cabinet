const express = require('express')

// in this router we cannot access the campground id since it doesn't store it from app.js,so we use mergeParams: true to merge app.js params and review params;
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utilities/catchAsync");
const ExpressError = require("../utilities/ExpressError");

// requiring models 
const Review = require("../models/review");
const Campground = require("../models/campground");

const { reviewSchema } = require("../validationSchemas(joi)");

// requiring middleware for validation of review
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middlewares');


router.post("/", validateReview, isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review');
    res.redirect(`/campgrounds/${campground._id}`);
})
);
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    // it pulls the reviewId from the reviews array of the corresponding campground using $pull operator
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review');
    res.redirect(`/campgrounds/${id}`);
})
);

module.exports = router;