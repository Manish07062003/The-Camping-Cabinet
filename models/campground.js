const mongoose = require('mongoose');
const Review = require('./review');
const { Schema } = mongoose;

// https://res.cloudinary.com/dqnw9d56g/image/upload/c_scale,h_53,w_70/v1656143495/recipes/turtles.jpg


const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    images: [ImageSchema],
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            // Review Model
            ref: 'Review'
        }
    ]
});





// query middleware
CampgroundSchema.post('findOneAndDelete', async function (document) {
    if (document) {
        // removing all Reviews that are in document.reviews array
        await Review.deleteMany({
            _id: {
                $in: document.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);