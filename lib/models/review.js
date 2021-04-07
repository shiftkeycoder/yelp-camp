const mongoose = require('mongoose');
const { Schema } = mongoose;
const reviewSchema = new Schema({
  body: {
    type: String,
    required: [true, 'Body']
  },
  rating: {
    type: Number,
    required: [true, 'Rating']
  }
});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;