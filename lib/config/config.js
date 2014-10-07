var env = process.env.ENV;

console.log("Level=INFO\tComponent=CONFIG\tLoading config for environment: " + env);
module.exports = require('./config.' + env + '.js');
