const mongoose = require('mongoose');
const Review = require('./review');
const { Schema } = mongoose;


const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    location: String,
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