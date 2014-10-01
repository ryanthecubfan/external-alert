var http	         = require('http'),
	Scheduler        = require('./lib/scheduler.js'),
    HttpLoader       = require('./lib/httpLoader.js'),
    ParsePreviewData = require('./lib/parsePreviewData.js'),
    ParseIframe 	 = require('./lib/parseIframe.js'),
    Mailer		     = require('./lib/mailer.js');

var mailer		     = new Mailer();

var mailRecipients = process.env.MAIL_RECIPIENTS || "ryan.brewer@gettyimages.com";

var fail = function(message) {
	console.log(message);
	mailer.sendMail("Embed Preview Failure", "Embed Preview failed: \r\n\r\nReason:\r\n\r\n" + failureReason, mailRecipients);
}

var previewUrl = process.env.PREVIEW_URL || "http://embed.gettyimages.com/preview/1765189";

var previewLoader = new HttpLoader(previewUrl,
	function(responseText) {
		var previewParser = new ParsePreviewData(responseText,
			function(frameSrc) {
				console.log("parsed preview: " + frameSrc);
				var frameLoader = new HttpLoader(frameSrc,
					function(responseText) {
						console.log('loaded iframe');
						var frameParser = new ParseIframe(responseText,
							function(imageSource) {
								console.log("parsed iframe: " + imageSource);
								var imageLoader = new HttpLoader(imageSource,
									function(responseText) {
										console.log("retrieved image!")
									},
									function(failureReason) {
										fail("could not load image: " + failureReason);
									});
								imageLoader.execute();
							},
							function(failureReason) {
								fail("failed to parse iframe: " + failureReason);
							});
						frameParser.execute();
					},
					function(failureReason) {
						fail("could not load iFrame source: " + failureReason);
					});
				frameLoader.execute();
			},
			function(failureReason) {
				fail(failureReason);
			});
		previewParser.execute();
	},
	function(failureReason) {
		fail("failed: " + failureReason)
	});

var scheduler = new Scheduler();
scheduler.addTask(function() { previewLoader.execute() }, 60000);
scheduler.start();