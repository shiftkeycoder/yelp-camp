const BaseJoi = require('joi');
const sanitizeHTML = require('sanitize-html');
const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not include HTML!'
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHTML(value, {
          allowedTags: [],
          allowedAttributes: {}
        });
        if (clean !== value) return helpers.error('string.escapeHTML', { value })
        return clean;
      }
    }
  }
});
const Joi = BaseJoi.extend(extension);
const campsiteJOI = Joi.object({
  campsite: Joi.object({
    title: Joi.string().required().escapeHTML(),
    image: Joi.object({
      url: Joi.string().required(),
      filename: Joi.string().required()
    }),
    price: Joi.number().required().min(0),
    description: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML()
  }).required()
});
const reviewJOI = Joi.object({
  review: Joi.object({
    body: Joi.string().required().escapeHTML(),
    rating: Joi.number().required().min(1).max(5)
  }).required()
});
const memberJOI = Joi.object({
  member: Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required()
  }).required()
});
module.exports = { campsiteJOI, reviewJOI, memberJOI };