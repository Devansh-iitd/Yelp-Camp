const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
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

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        p = Math.floor(Math.random() * 3000) + 2000
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '64ca43fc93a52211e4ca2fd1',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: ` ${sample(descriptors)} ${sample(places)}`,
            images: [{
                url: 'https://source.unsplash.com/collection/483251',
                filename: 'tester'
            }],



            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            price: p
        })
        await camp.save()
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})