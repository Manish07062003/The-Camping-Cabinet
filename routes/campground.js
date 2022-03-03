const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const ExpressError = require("../utilities/ExpressError");
const Campground = require("../models/campground"); // requiring model from campground.js
const { campgroundSchema } = require("../validationSchemas(joi)");

const { validateCampground } = require('../middlewares');
const { isLoggedIn } = require('../middlewares');



router.get("/", catchAsync(async (req, res) => {
  const camp = await Campground.find({});
  res.render("campgrounds/index", { camp });
})
);
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.get("/:id", catchAsync(async (req, res, next) => {
  const foundCampground = await Campground.findById(req.params.id).populate(
    "reviews"
  );
  if (!foundCampground) {
    req.flash('error', "Can't find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { foundCampground });
}));
router.post("/", isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
  const campground = new Campground(req.body.campground); // title and location are under campground because we gave a name campground[title] in the new.ejs form
  await campground.save();
  req.flash('success', 'Successfully made a new campground!');
  res.redirect(`/campgrounds/${campground._id}`);
})
);

router.get("/:id/edit", isLoggedIn, catchAsync(async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
})
);
router.put("/:id", isLoggedIn, validateCampground, catchAsync(async (req, res) => {
  const campground = await Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground
  );
  req.flash('success', 'Successfully updated campground');
  res.redirect(`/campgrounds/${campground._id}`);
})
);

router.delete("/:id", isLoggedIn, catchAsync(async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash('success', 'Successfully deleted Campground');
  res.redirect("/campgrounds");
})
);

module.exports = router;