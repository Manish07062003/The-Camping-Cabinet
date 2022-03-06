const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");

// campground controller
const campgrounds = require('../controllers/campgrounds');

const Campground = require("../models/campground");

const { validateCampground, isLoggedIn, isAuthor } = require('../middlewares');

router.route('/')
    // rendering index page
    .get(catchAsync(campgrounds.index))

    // creating new campground and storing in database
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// rendering form to create new campgrounds
router.get("/new", isLoggedIn, campgrounds.renderNewFrom);

router.route('/:id')
    // rendering each campground
    .get(catchAsync(campgrounds.showCampground))

    // updating the campgrounds and resaving to the database
    .put(isLoggedIn, validateCampground, isAuthor, catchAsync(campgrounds.updateCampground))

    // deleting the campground
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));


// rendering edit form
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));



module.exports = router;