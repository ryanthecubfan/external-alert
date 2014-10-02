var _ = require('underscore');

var Scheduler = module.exports = function() {
  this.tasks = [];
}

_.extend(Scheduler.prototype, {
  addTask: function(task) {
  	this.tasks.push(task);
    return this;
  },
  start: function() {
  	_.each(this.tasks, configureIntervalAndLaunch);
    return this;
  },
  stop: function() {
  	_.each(this.tasks, unsetInterval);
    return this;
  }
})

function configureIntervalAndLaunch(task) {
	task.intervalObject = setInterval(task.action, task.interval);
	task.action();
}

function unsetInterval(task) {
	clearInterval(task.intervalObject);
}