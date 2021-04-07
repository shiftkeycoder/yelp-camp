const Joi = require('joi');
const campsiteJOI = Joi.object({
  campsite: Joi.object({
    title: Joi.string().required(),
    image: Joi.string().required(),
    price: Joi.number().required().min(0),
    description: Joi.string().required(),
    location: Joi.string().required()
  }).required()
});
const reviewJOI = Joi.object({
  review: Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5)
  }).required()
});
module.exports = { campsiteJOI, reviewJOI };