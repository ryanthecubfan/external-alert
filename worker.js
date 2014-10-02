var Scheduler     = require('./lib/scheduler.js'),
    HttpLoader    = require('./lib/httpLoader.js'),
    PreviewParser = require('./lib/parsePreviewData.js'),
    FrameParser   = require('./lib/parseIframe.js'),
    Mailer		  = require('./lib/mailer.js'),
    Q			  = require('q');

process.on('uncaughtException', function (err) {
	console.log("****************Uncaught Exception****************");
	console.log(err);
	Mailer.sendMail("Embed Preview Failure", "Uncaught Exception: \r\n\r\nReason:\r\n\r\n" + message, mailRecipients);
}); 

var mailRecipients = process.env.MAIL_RECIPIENTS || "ryan.brewer@gettyimages.com";
var previewUrl = process.env.PREVIEW_URL || "http://embed.gettyimages.com/preview/1765189";
var previewTimer = process.env.PREVIEW_TIMER || 60000;


var scheduler = new Scheduler();

scheduler.addTask(function previewLoaderExecute(previewUrl) {
	console.log("Executing preview loader task.")
	var p = HttpLoader.execute(previewUrl)
	    .then(PreviewParser.execute)
		.then(HttpLoader.execute)
		.then(FrameParser.execute)
		.then(HttpLoader.execute)
		.then(function(data) {
			console.log("Successfully created embed via '" + previewUrl + "', viewed the iframe, and loaded the image.")
		})
		.catch(function(message) {
			console.log("****************Loader Exception****************");
			console.log(message);
			Mailer.sendMail("Embed Preview Failure", "Embed Preview failed: \r\n\r\nReason:\r\n\r\n" + message, mailRecipients);
		});
}, previewTimer);

scheduler.start();