const mongoose = require('mongoose');
const { Schema } = mongoose;
const Member = require('./member');
const reviewSchema = new Schema({
  body: {
    type: String,
    required: [true, 'Body']
  },
  rating: {
    type: Number,
    required: [true, 'Rating']
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: Member,
  }
});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;