var Scheduler     = require('./lib/scheduler.js'),
    HttpLoader    = require('./lib/httpLoader.js'),
    PreviewParser = require('./lib/parsePreviewData.js'),
    FrameParser   = require('./lib/parseIframe.js'),
    Mailer		  = require('./lib/mailer.js');

process.on('uncaughtException', function (err) {
    fail(err);
}); 

var mailRecipients = process.env.MAIL_RECIPIENTS || "ryan.brewer@gettyimages.com";
var previewUrl = process.env.PREVIEW_URL || "http://embed.gettyimages.com/preview/1765189";
var previewTimer = process.env.PREVIEW_TIMER || 60000;

var fail = function(message) {
	console.log(message);
	Mailer.sendMail("Embed Preview Failure", "Embed Preview failed: \r\n\r\nReason:\r\n\r\n" + message, mailRecipients);
}

var scheduler = new Scheduler();

scheduler.addTask(function() {
	console.log("Executing preview loader task.")
	HttpLoader.execute(previewUrl)
		.then(PreviewParser.execute, fail)
		.then(HttpLoader.execute, fail)
		.then(FrameParser.execute, fail)
		.then(previewLoaderSuccess, fail);
	}, previewTimer);

scheduler.start();

function previewLoaderSuccess(data) {
	console.log("Successfully created embed via '" + previewUrl + "', viewed the iframe, and loaded the image.")
}