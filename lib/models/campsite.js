const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review = require('./review');
const Member = require('./member');
const campsiteSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title']
  },
  image: {
    url: {
      type: String,
      required: [true, 'Image Url']
    },
    filename: {
      type: String,
      required: [true, 'Image Filename']
    }
  },
  price: {
    type: Number,
    required: [true, 'Price']
  },
  description: {
    type: String,
    required: [true, 'Description']
  },
  location: {
    type: String,
    required: [true, 'Location']
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: Member
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: Review
    }
  ],
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});
campsiteSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    });
  }
})
const Campsite = mongoose.model('Campsite', campsiteSchema);
module.exports = Campsite;
