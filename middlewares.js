// validation middleware
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

// logged in middleware 
const isLoggedIn = (req, res, next) => {
    // isAuthenticated is automatically added by passport to the req object
    if (!req.isAuthenticated()) {
        //store the url they are requesting in the session and redirect to that that page
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = validateCampground;
module.exports.isLoggedIn = isLoggedIn;