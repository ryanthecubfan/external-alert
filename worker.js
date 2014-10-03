var EmbedWF       = require('./lib/workflows/embed.js'),
    EmbedCdnWF    = require('./lib/workflows/cdn.js'),
    EmbedSearchWF = require('./lib/workflows/search.js'),
    EmbedMltWF    = require('./lib/workflows/mlt.js'),
    AlertManager  = require('./lib/alertManager.js'),
    Scheduler     = require('./lib/scheduler.js'),
    Q			  = require('q');

var mailRecipients = process.env.MAIL_RECIPIENTS || "ryan.brewer@gettyimages.com";

process.on('uncaughtException', function (err) {
	console.log("****************Uncaught Exception****************");
	console.log(err);
	Mailer.sendMail("Embed Preview Failure", "Uncaught Exception: \r\n\r\nReason:\r\n\r\n" + err, mailRecipients);
}); 

var scheduler = new Scheduler();

scheduler.addTask(EmbedWF.createWorkflow());
scheduler.addTask(EmbedCdnWF.createWorkflow());
scheduler.addTask(EmbedSearchWF.createWorkflow());
scheduler.addTask(EmbedMltWF.createWorkflow());

scheduler.start();