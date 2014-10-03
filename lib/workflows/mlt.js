var HttpLoader   = require('../httpLoader.js'),
    AlertManager = require('../alertManager.js'),
    Q			 = require('q');

var mailRecipients = process.env.MAIL_RECIPIENTS || "ryan.brewer@gettyimages.com";
var timer = process.env.MLT_TIMER || 60000;
var url = process.env.MLT_URL || "http://www.gettyimages.com/embeds/494327331/more-like-this";

exports.createWorkflow = function() {
    return { 
        action: function() {
            console.log("Executing Embed MLT loader task.");
            HttpLoader.execute(url)
            	.then(parseMltHtml)
                .then(function(data) {
                    console.log("Successfully loaded embed MLT page");
                })
                .catch(function(message) {
                    console.log("****************Embed-MLT Workflow Error****************");
                    console.log(message);
                    AlertManager.sendMail("Embed-MLT Failure", "Embed-CDN failed: \r\n\r\nReason:\r\n\r\n" + message, mailRecipients);
                });
        }, 
        interval: timer
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