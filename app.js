const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require("mongoose");
const ExpressError = require("./utilities/ExpressError");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/review');

mongoose.connect("mongodb://localhost:27017/campgrounds", {
  useNewUrlParser: true, // Parses the data from the project and returns back in json format
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

app.engine("ejs", ejsMate); // setting ejs engine to ejsMate
app.use(express.urlencoded({ extended: true })); //Used to parse the req.body data
app.use(methodOverride("_method")); // faking a post request to other mentioned request inside _method

// we generally write scripts, css style sheets etc. in public directory
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
  secret: "MySecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, // for security purpose
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

// express session
app.use(session(sessionConfig));
// flash
app.use(flash());

// go to passportjs documentation for details 
app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
//Generates a function that is used in Passport's LocalStrategy 
passport.use(new LocalStrategy(User.authenticate()));
//Generates a function that is used by Passport to serialize users into the session
passport.serializeUser(User.serializeUser());
// Generates a function that is used by Passport to deserialize users into the session
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  console.log(req.session);
  // passport.js add the user detial to req object when user is logged in
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.set("views", path.join(__dirname, "views")); // setting views directory path
app.set("view engine", "ejs"); // setting view engine to embedded javascript (ejs)


app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/fakeuser', async (req, res) => {
  const user = new User({ email: 'manish@gmail.com', username: 'manish123' })
  //register(user, password, cb) Convenience method to register a new user instance with a given password. Checks if username is unique. 
  const newUser = await User.register(user, 'manish@123');
  res.send(newUser);
})

app.get("/", (req, res) => {
  res.send("Welcome to HOME!!");
});

app.all("*", (req, res, next) => {
  // if any of the routes does not match this route will throw an page not found error
  next(new ExpressError("Page not found", 404));
});

//error handling middleware
app.use(function (err, req, res, next) {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no, Something went wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Listening to port 3000");
});
