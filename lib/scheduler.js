var _     = require('underscore'),
    log   = require('./log.js');

var component = "SCHEDULER";

var Scheduler = module.exports = function() {
    this.workflows = [];
}

_.extend(Scheduler.prototype, {
    addWorkflow: function(workflow) {
        log.write(component, "Workflow added: " + workflow.config.workflowName)
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
    if(workflow.config.interval > 0) {
        log.write(component, "Configuring workflow '" + workflow.config.workflowName + "' to run every " + workflow.config.interval + "ms.");
      	workflow.intervalObject = setInterval(function() { log.write(component, "Executing scheduled workflow: " + workflow.config.workflowName); workflow.execute(); }, workflow.config.interval);
  	    workflow.execute();
    } else {
        log.write(component, "Interval for workflow '" + workflow.config.workflowName + "' was 0 or less. Not scheduling.", "WARNING");
    }
}

function unsetInterval(workflow) {
	  clearInterval(workflow.intervalObject);
}
