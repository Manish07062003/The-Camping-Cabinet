const Joi = require('joi');  // javascript library to validate model when we edit or create a new model. 

// schema for valiating the data of new campground submitted by user
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});