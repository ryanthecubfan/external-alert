var config		   = require('./config/config.js'),
    example1       = require('./workflow-example-loadPage.js'),
    example2       = require('./workflow-example-complex.js'),
    Scheduler      = require('./lib/scheduler.js'),
    log  		   = require('./lib/log.js'),
    Workflow       = require('./lib/workflow.js'),
    failureTracker = require('./lib/failureTracker.js'),
    alertManager   = require('./lib/alertManager.js'),
    AWS            = require('aws-sdk');

var mailRecipients = "ryan.brewer@gettyimages.com";
var component      = "WORKER";

process.on('uncaughtException', function (err) {
	log.write(component, "***UNCAUGHT EXCEPTION***");
	log.write(component, err);
	log.write(component, err.stack);
}); 

log.init(config.sqs);
alertManager.init(config.mailer);

console.log("WORKER", "Setting AWS region to us-west-2");
AWS.config.update({region: 'us-west-2'});

//create workflows and add them to the scheduler
var exampleWF1   = new Workflow(config.example1,
							    example1.getAction(config.example1),
							    function(err) {
							    	if(err) {
							    		failureTracker.addFailure(config.example1, "Example 1 failed: \r\nReason:\r\n" + message);
							    	} else {
							    		failureTracker.clearFailures("Example1");
							    	}
							    });

var exampleWF2   = new Workflow(config.example2,
							    example2.getAction(config.example2),
							    function(err) {
							    	if(err) {
							    		failureTracker.addFailure(config.example2, "Example 2 failed: \r\nReason:\r\n" + message);
							    	} else {
							    		failureTracker.clearFailures("Example2");
							    	}
							    });

var scheduler  = new Scheduler();

scheduler.addWorkflow(exampleWF1);
scheduler.addWorkflow(exampleWF2);

scheduler.start();