var _     = require('underscore'),
    log   = require('./log.js');

var component = "SCHEDULER";

var Scheduler = module.exports = function() {
    this.workflows = [];
}

_.extend(Scheduler.prototype, {
    addWorkflow: function(workflow) {
        log.write(component, "Workflow added: " + workflow.workflowName)
      	this.workflows.push(workflow);
        return this;
    },
    start: function() {
        log.write(component, "Starting workflows");
      	_.each(this.workflows, configureIntervalAndLaunch);
        return this;
    },
    stop: function() {
        log.write(component, "Stopping workflows");
  	    _.each(this.workflows, unsetInterval);
        return this;
    }
})

function configureIntervalAndLaunch(workflow) {
    if(workflow.interval > 0) {
        log.write(component, "Configuring workflow '" + workflow.workflowName + "' to run every " + workflow.interval + "ms.");
      	workflow.intervalObject = setInterval(function() { log.write(component, "Executing scheduled workflow: " + workflow.workflowName); workflow.action(); }, workflow.interval);
  	    workflow.action();
    } else {
        log.write(component, "Interval for workflow '" + workflow.workflowName + "' was 0 or less. Not scheduling.", "WARNING");
    }
}

function unsetInterval(workflow) {
	  clearInterval(workflow.intervalObject);
}
