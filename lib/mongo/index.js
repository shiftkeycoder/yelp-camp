const mongoose = require('mongoose');
const db = mongoose.connection;

class Mongo {
  constructor() { }
  init() {
    mongoose.connect('mongodb://localhost:27017/yelp-camp', {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    })

    db.on("error", console.error.bind(console, "connection error:"));

    db.once("open", () => {
      console.log("Database connected");
    });
  }
};
module.exports = Mongo;