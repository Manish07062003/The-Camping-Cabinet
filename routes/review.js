const express = require('express')

// in this router we cannot access the campground id since it doesn't store it from app.js,so we use mergeParams: true to merge app.js params and review params;
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utilities/catchAsync");
const ExpressError = require("../utilities/ExpressError");

// requiring models 
const Review = require("../models/review");
const Campground = require("../models/campground");

// review controller
const review = require('../controllers/reviews');

const { reviewSchema } = require("../validationSchemas(joi)");

// requiring middleware for validation of review
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middlewares');


// creating review
router.post("/", validateReview, isLoggedIn, catchAsync(review.createReview));

// deleting review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(review.deleteReview));

module.exports = router;