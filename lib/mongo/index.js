const mongoose = require('mongoose');
const db = mongoose.connection;
const {NODE_ENV, CLOUD_DB, LOCAL_DB } = process.env;

class Mongo {
  constructor() { }
  init() {
    if (NODE_ENV === 'production') {
      mongoose.connect(CLOUD_DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      });
    }
    else {
        mongoose.connect(LOCAL_DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      })
    }

    db.on("error", console.error.bind(console, "connection error:"));

    db.once("open", () => {
      console.log("Database connected");
    });
  }
};
module.exports = Mongo;