const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const Review = require('../models/review');
const User = require('../models/user');
const review = require('../models/review');
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/campgrounds', {
    useNewUrlParser: true, // Parses the data from the project and returns back in json format
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = arr => arr[Math.floor(Math.random() * arr.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000); // since there are 1000 cities so we have taken random nums from 1 to 1000
        const price = Math.floor(Math.random() * 30) + 10;
        const camp = new Campground({
            author: '6223192e03b3922290a6a61a',
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dqnw9d56g/image/upload/v1684052967/The%20Camping%20Cabinet/zdkb6p1rwikzzemms7kf.jpg',
                    filename: 'The Camping Cabinet/ghmqsz8tyhssxaju3hxb',
                },
                {
                    url: 'https://res.cloudinary.com/dqnw9d56g/image/upload/v1684053165/The%20Camping%20Cabinet/oruxjwa2xrjlgualu1c2.jpg',
                    filename: 'The Camping Cabinet/upmwcfn8zltuwqtzxt5b',
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam fugit voluptatibus earum facilis. Doloribus autem quod sed. Quia consequuntur harum facilis, obcaecati omnis temporibus sint blanditiis doloribus?',
            price: price
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})