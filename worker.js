var config		  = require('./lib/config/config.js'),
	embedWF       = require('./lib/workflows/embed.js'),
    embedCdnWF    = require('./lib/workflows/cdn.js'),
    embedSearchWF = require('./lib/workflows/search.js'),
    embedMltWF    = require('./lib/workflows/mlt.js'),
    alertManager  = require('./lib/alertManager.js'),
    Scheduler     = require('./lib/scheduler.js'),
    log  		  = require('./lib/log.js');

var mailRecipients = "ryan.brewer@gettyimages.com";
var component      = "WORKER";

process.on('uncaughtException', function (err) {
	log.write(component, "***UNCAUGHT EXCEPTION***");
	log.write(component, err);
	alertManager.sendMail(config.mailer.defaultSubject, "Uncaught Exception: \r\n\r\nReason:\r\n\r\n" + err, mailRecipients);
}); 


var scheduler = new Scheduler();

scheduler.addWorkflow(embedWF.createWorkflow());
scheduler.addWorkflow(embedCdnWF.createWorkflow());
scheduler.addWorkflow(embedSearchWF.createWorkflow());
scheduler.addWorkflow(embedMltWF.createWorkflow());

scheduler.start();
