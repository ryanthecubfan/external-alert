var log = require('../log.js');

var env = process.env.ENV ? process.env.ENV : "local";

log.write("CONFIG", "Loading config for environment: " + env);
module.exports = require('./config.' + env + '.js');
