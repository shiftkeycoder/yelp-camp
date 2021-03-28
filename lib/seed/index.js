const Campsite = require('../models/campsite');
const { cities, descriptors, places } = require('../../data');

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campsite.deleteMany({});

  for (let i = 0; i < 50; i++) {
    const idx = Math.floor(Math.random() * 1000);
    const camp = new Campsite({
      title: `${sample(descriptors)} ${sample(places)}`,
      price: "$70.00",
      description: "Popular campsite",
      location: `${cities[idx].city}, ${cities[idx].state}`
    });
    await camp.save();
  }
}

module.exports = seedDB;