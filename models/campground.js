const mongoose = require('mongoose');
const Review = require('./review');
const { Schema } = mongoose;

// when we convert mongo object to json virtuals properties will be ignored so to not do so we set virtuals to true
const options = { toJSON: { virtuals: true } }

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
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
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
}, options);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,20)}...</p>`
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