var _ = require('underscore');

var Scheduler = module.exports = function() {
    this.workflows = [];
}

_.extend(Scheduler.prototype, {
    addWorkflow: function(workflow) {
        log("Workflow added: " + workflow.workflowName)
      	this.workflows.push(workflow);
        return this;
    },
    start: function() {
        log("Starting workflows");
      	_.each(this.workflows, configureIntervalAndLaunch);
        return this;
    },
    stop: function() {
        log("Stopping workflows");
  	    _.each(this.workflows, unsetInterval);
        return this;
    }
})

function configureIntervalAndLaunch(workflow) {
    if(workflow.interval > 0) {
        log("Configuring workflow '" + workflow.workflowName + "' to run every " + workflow.interval + "ms.");
      	workflow.intervalObject = setInterval(function() { log("Executing scheduled workflow: " + workflow.workflowName); workflow.action(); }, workflow.interval);
  	    workflow.action();
    } else {
        log("Interval for workflow '" + workflow.workflowName + "' was 0 or less. Not scheduling.", "WARNING");
    }
}

function unsetInterval(workflow) {
	  clearInterval(workflow.intervalObject);
}

function log(msg, level) {
    console.log("Level=" + (level || "INFO") + "\tComponent=SCHEDULER\t" + msg);
}