if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
const {NODE_ENV } = process.env;
const svr = require('./lib/express');
const Mongo = require('./lib/mongo');
const mongo = new Mongo;
const routes = require('./lib/routes');
const seedDB = require('./lib/seed');
const {hashPWD, login} = require('./lib/bcrypt');

if (NODE_ENV === "production") {
  process.env.PORT = 8080;
  process.env.IP = "mighty-brook-04089";
}
else {
  process.env.PORT = 3000;
  process.env.IP = 'localhost';
}

mongo.init();
svr.init();
routes(svr.app);
svr.listen();
// seedDB();
// hashPWD('yelpcamp');
// login('yelpcamp', '$2b$12$eKI7uyS5zZ3zpfFsXm.5ceRNVbIn.cA/ZXjZy8ul1Kxe99R1vuk0a');