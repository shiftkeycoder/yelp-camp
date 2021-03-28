const svr = require('./lib/express');
const Mongo = require('./lib/mongo');
const mongo = new Mongo;
const routes = require('./lib/routes');
const seedDB = require('./lib/seed');

process.env.PORT = 3000;
process.env.IP = 'localhost';

mongo.init();
svr.init();
routes(svr.app);
svr.listen();
// seedDB();