var env = process.env.ENV ? process.env.ENV : "local";

console.log("CONFIG", "Loading config for environment:" + env + "\r");

module.exports = require('./config.' + env + '.js');
