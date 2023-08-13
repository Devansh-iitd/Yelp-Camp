if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}//this is for using the .env file in development

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const joi = require('joi');
const { campgroundSchema, reviewSchema } = require('./schemas.js')
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review.js')
const session = require('express-session');
const flash = require('connect-flash');
const campgroundsroutes = require('./routes/campground');
const reviewsroutes = require('./routes/reviews');
const userroutes = require('./routes/users');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    /* useNewUrlParser: true,
     useCreateIndex: true,
     useUnifiedTopology: true these are already set to true in newer version of mongoose */
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
    secret: 'thishouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}))


app.use(passport.initialize());// this is for initializing passport
app.use(passport.session());// this is for persistent login sessions
passport.use(new LocalStrategy(User.authenticate()));// this is for using local strategy
passport.serializeUser(User.serializeUser());// this is for reading the session, taking the data from the session that's encoded and unencoding it
passport.deserializeUser(User.deserializeUser());// this is for encoding it and putting it back into the session
//passport uses PbKDF2 to hash passwords by default and not bcrypt

app.use(flash());
app.use((req, res, next) => {

    res.locals.currentUser = req.user;// this is for making the user available in all the templates
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})

app.use('/', userroutes);
app.use('/campgrounds', campgroundsroutes);
app.use('/campgrounds/:id/reviews', reviewsroutes);

app.get('/', (req, res) => {

    res.render('home')
})




app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something Went Wrong' } = err;
    if (!err.message) err.message = 'Something Went Wrong'
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {

    console.log('Serving on port 3000')
})