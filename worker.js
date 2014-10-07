var config		  = require('./lib/config/config.js'),
	EmbedWF       = require('./lib/workflows/embed.js'),
    EmbedCdnWF    = require('./lib/workflows/cdn.js'),
    EmbedSearchWF = require('./lib/workflows/search.js'),
    EmbedMltWF    = require('./lib/workflows/mlt.js'),
    AlertManager  = require('./lib/alertManager.js'),
    Scheduler     = require('./lib/scheduler.js');

var mailRecipients = "ryan.brewer@gettyimages.com";

process.on('uncaughtException', function (err) {
	log("***UNCAUGHT EXCEPTION***");
	log(err);
	AlertManager.sendMail(config.mailer.defaultSubject, "Uncaught Exception: \r\n\r\nReason:\r\n\r\n" + err, mailRecipients);
}); 


var scheduler = new Scheduler();

scheduler.addWorkflow(EmbedWF.createWorkflow());
scheduler.addWorkflow(EmbedCdnWF.createWorkflow());
scheduler.addWorkflow(EmbedSearchWF.createWorkflow());
scheduler.addWorkflow(EmbedMltWF.createWorkflow());

scheduler.start();

function log(msg) {
	console.log("Level=INFO\tComponent=WORKER\t" + msg);
}