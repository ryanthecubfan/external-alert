var urlRetriever   = require('../urlRetriever.js'),
    failureTracker = require('../failureTracker.js'),
    config         = require('../config/config.js'),
    Q			   = require('q');

var mailRecipients = config.searchWF.mailRecipients || "ryan.brewer@gettyimages.com";
var interval       = config.searchWF.interval       || 60000;
var url            = config.searchWF.url            || "http://www.gettyimages.com/embeds?phrase=rainier&clarifications=&family=creative&excludenudity=false";
var threshold      = config.searchWF.threhold       || 3;

exports.createWorkflow = function() {
    var self = this;
    self.id = "Embed Portal Search";
    self.threshold = threshold;

    return { 
        action: function() {
            log("Executing: " + self.id);
            urlRetriever.execute(url)
            	.then(parseSearchHtml)
                .then(function(data) {
                    log("Successfully loaded embed search page");
                })
                .catch(function(message) {
                    log(message, "ERROR");
                    failureTracker.addFailure(self, "Embed-Portal Search failed: \r\nReason:\r\n" + message, mailRecipients);
                });
        }, 
        interval: interval,
        workflowName: self.id
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

function log(msg, level) {
	console.log("Level=" + (level || "INFO") + "\tComponent=SEARCH_WORKFLOW\t" + msg);
}