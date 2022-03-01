const express = require('express');
const router = express.Router({ mergeParams: true }); // in this router we cannot access the campground id since it doesn't store it from app.js,so we use mergeParams: true to merge app.js params and review params

const catchAsync = require("../utilities/catchAsync");
const ExpressError = require("../utilities/ExpressError");
const Review = require("../models/review"); // requiring review model from review.js
const Campground = require("../models/campground"); // requiring model from campground.js

const { reviewSchema } = require("../validationSchemas(joi)");

// validation middleware
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.post(
    "/",
    validateReview,
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        const review = new Review(req.body.review);
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        req.flash('success', 'Created new review');
        res.redirect(`/campgrounds/${campground._id}`);
    })
);
router.delete(
    "/:reviewId",
    catchAsync(async (req, res) => {
        const { id, reviewId } = req.params;
        // it pulls the reviewId from the reviews array of the corresponding campground using $pull operator
        await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash('success', 'Successfully deleted a review');
        res.redirect(`/campgrounds/${id}`);
    })
);

module.exports = router;