const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Campground = require('./models/campground'); // requiring model from campground.js
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');
const { campgroundSchema } = require('./validationSchemas(joi)');

mongoose.connect('mongodb://localhost:27017/campgrounds', {
    useNewUrlParser: true, // Parses the data from the project and returns back in json format
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});


app.engine('ejs', ejsMate); // setting ejs engine to ejsMate
app.use(express.urlencoded({ extended: true })); //Used to parse the req.body data
app.use(methodOverride('_method')); // faking a post request to other mentioned request inside _method


app.set('views', path.join(__dirname, 'views')); // setting views directory path
app.set('view engine', 'ejs'); // setting view engine to embedded javascript (ejs)

// validation middleware
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.send('Welcome to HOME!!');
})
app.get('/campgrounds', catchAsync(async (req, res) => {
    const camp = await Campground.find({});
    res.render('campgrounds/index', { camp });
}));
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.get('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const foundCampground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { foundCampground });
}))
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground); // title and location are under campground because we gave a name campground[title] in the new.ejs form
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
}))

app.all('*', (req, res, next) => {  // if any of the routes does not match this route will throw an page not found error
    next(new ExpressError('Page not found', 404));
})

app.use(function (err, req, res, next) {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, Something went wrong';
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log("Listening to port 3000");
})