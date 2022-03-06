const Campground = require('../models/campground');


module.exports.index = async (req, res) => {
    const camp = await Campground.find({});
    res.render("campgrounds/index", { camp });
}

module.exports.renderNewFrom = (req, res) => {
    res.render("campgrounds/new");
}

module.exports.showCampground = async (req, res, next) => {
    const foundCampground = await Campground.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: 'author'
        }
    }).populate("author");
    if (!foundCampground) {
        req.flash('error', "Can't find that campground");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { foundCampground });
}

module.exports.createCampground = async (req, res, next) => {

    // title and location are under campground because we gave a name campground[title] in the new.ejs form
    const campground = new Campground(req.body.campground);

    // adding user id to the campground created by the user
    campground.author = req.user._id;

    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.renderEditForm = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
}

module.exports.updateCampground = async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground= async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted Campground');
    res.redirect("/campgrounds");
}
