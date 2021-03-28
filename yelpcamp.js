const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const db = mongoose.connection;
const Campground = require('./lib/models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", () => {
  console.log("Database connected");
});

app.set('view engine', 'pug');

app.set('views', path.join(__dirname, 'lib/views'));

app.get('/', (req, res) => {
  res.render('home');
})
app.get('/camp', async (req, res) => {
  const camp = new Campground({
    title: 'My Backyard',
    price: '$60.00',
    description: 'Campsite in my backyard',
    location: "510 Grapefruit Ave, Sebring FL"
  });
  await camp.save();
  res.send(camp);
})

app.listen(3000, () => {
  console.log('Serving on port 3000');
})