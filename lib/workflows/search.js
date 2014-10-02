var HttpLoader    = require('../httpLoader.js'),
    Mailer        = require('../mailer.js'),
    Q			  = require('q');

var mailRecipients = process.env.MAIL_RECIPIENTS || "ryan.brewer@gettyimages.com";
var searchTimer = process.env.SEARCH_TIMER || 60000;
var searchUrl = process.env.SEARCH_URL || "http://www.gettyimages.com/embeds?phrase=rainier&clarifications=&family=creative&excludenudity=false";

exports.createWorkflow = function() {
    return { 
        action: function() {
            console.log("Executing Embed Search loader task.");
            HttpLoader.execute(searchUrl)
            	.then(parseSearchHtml)
                .then(function(data) {
                    console.log("Successfully loaded embed search page");
                })
                .catch(function(message) {
                    console.log("****************Embed-Search Workflow Error****************");
                    console.log(message);
                    Mailer.sendMail("Embed-Search Failure", "Embed-CDN failed: \r\n\r\nReason:\r\n\r\n" + message, mailRecipients);
                });
        }, 
        interval: searchTimer
    };
}

function parseSearchHtml(data) {
	var deferred = Q.defer();

	if(!data) {
		deferred.reject(new Error("Search HTML was null"));
	} else {
		if(data.indexOf('<body class="embeds search_container" ng-app="EmbedApp">') == -1) {
			deferred.reject(new Error("Search HTML did not contain '" + '<body class="embeds search_container" ng-app="EmbedApp">' + "'"));
		}
		else {
			deferred.resolve("Success");
		}
	}

	return deferred.promise;
}