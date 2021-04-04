const Campsite = require('../models/campsite');
const { cities, descriptors, places } = require('../../data');

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campsite.deleteMany({});

  for (let i = 0; i < 50; i++) {
    const idx = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 200 + 10);
    const camp = new Campsite({
      title: `${sample(descriptors)} ${sample(places)}`,
      image: 'https://source.unsplash.com/collection/89701610',
      price,
      description:
      `"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est                       
            laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et                       
            dolore magna aliqua."`,
      location: `${cities[idx].city}, ${cities[idx].state}`
    });
    await camp.save();
  }
}

module.exports = seedDB;