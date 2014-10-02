var HttpLoader    = require('../httpLoader.js'),
    Mailer        = require('../mailer.js'),
    Q			  = require('q');

var mailRecipients = process.env.MAIL_RECIPIENTS || "ryan.brewer@gettyimages.com";
var mltTimer = process.env.MLT_TIMER || 60000;
var mltUrl = process.env.MLT_URL || "http://www.gettyimages.com/embeds/494327331/more-like-this";

exports.createWorkflow = function() {
    return { 
        action: function() {
            console.log("Executing Embed MLT loader task.");
            HttpLoader.execute(mltUrl)
            	.then(parseMltHtml)
                .then(function(data) {
                    console.log("Successfully loaded embed MLT page");
                })
                .catch(function(message) {
                    console.log("****************Embed-MLT Workflow Error****************");
                    console.log(message);
                    Mailer.sendMail("Embed-MLT Failure", "Embed-CDN failed: \r\n\r\nReason:\r\n\r\n" + message, mailRecipients);
                });
        }, 
        interval: mltTimer
    };
}

function parseMltHtml(data) {
	var deferred = Q.defer();

	if(!data) {
		deferred.reject(new Error("MLT HTML was null"));
	} else {
		if(data.indexOf('<body class="embeds search_container" ng-app="EmbedApp">') == -1) {
			deferred.reject(new Error("MLT HTML did not contain '" + '<body class="embeds search_container" ng-app="EmbedApp">' + "'"));
		}
		else {
			deferred.resolve("MLT Success");
		}
	}

	return deferred.promise;
}