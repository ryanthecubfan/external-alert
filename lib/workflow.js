var _        = require('underscore'),
	log		 = require('./log.js')

var Component = "WORKFLOW";

var Workflow = module.exports = function(config, action, done) {
	this.config = config;
	this.action = action;
	this.done = done;
}

_.extend(Workflow.prototype, {
	config: {
		mailRecipients: "",
		alertSubject : "Workflow Failure Alert",
		threshold: 3,
		interval: 60000,
		workflowName: "Default Workflow"
	},
	action: function() { },
	done: function(message) { },
	execute: function() {
		log.write("WORKFLOW", "Executing Workflow: " + this.config.workflowName);
		this.action(this.done);
	}
})