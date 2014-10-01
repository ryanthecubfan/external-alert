var _ = require('underscore');

var Scheduler = module.exports = function() {
  this.tasks = [];
}

_.extend(Scheduler.prototype, {
  addTask: function(task, interval) {
  	var t = {};
  	t.action = task;
  	t.interval = interval;
  	this.tasks.push(t);
  },
  start: function() {
  	_.each(this.tasks, configureIntervalAndLaunch);
  },
  stop: function() {
  	_.each(this.tasks, unsetInterval);
  }
})

function configureIntervalAndLaunch(task) {
	task.intervalObject = setInterval(task.action, task.interval);
	task.action();
}

function unsetInterval(task) {
	clearInterval(task.intervalObject);
}