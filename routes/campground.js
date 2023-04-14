const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");

// campground controller
const campgrounds = require('../controllers/campgrounds');

// campground model
const Campground = require("../models/campground");

// middlewares
const { validateCampground, isLoggedIn, isAuthor } = require('../middlewares');

// Multer is a node.js middleware for handling multipart / form - data, which is primarily used for uploading files
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });

router.route('/')
    // rendering index page
    .get(catchAsync(campgrounds.index))

    // creating new campground and storing in database
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));

// rendering form to create new campgrounds
router.get("/new", isLoggedIn, campgrounds.renderNewFrom);

router.route('/:id')
    // rendering each campground
    .get(catchAsync(campgrounds.showCampground))

    // updating the campgrounds and resaving to the database
    .put(isLoggedIn, upload.array('image'), isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))

    // deleting the campground
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));


// rendering edit form
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));



module.exports = router;