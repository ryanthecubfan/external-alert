var urlRetriever   = require('../urlRetriever.js'),
    failureTracker = require('../failureTracker.js'),
    config         = require('../config/config.js'),
    Q			   = require('q');

var mailRecipients = config.mltWF.mailRecipients || "ryan.brewer@gettyimages.com";
var interval       = config.mltWF.interval       || 60000;
var url            = config.mltWF.url            || "http://www.gettyimages.com/embeds/494327331/more-like-this";
var threshold      = config.mltWF.threhold       || 3;

exports.createWorkflow = function() {
    var self = this;
    self.id = "Embed Portal More-like-this Workflow";
    self.threshold = threshold;

    return { 
        action: function() {
            log("Executing Workflow: " + self.id);
            urlRetriever.execute(url)
            	.then(parseMltHtml)
                .then(function(data) {
                    log("Successfully loaded embed MLT page");
                })
                .catch(function(message) {
                    log(message, "ERROR");
                    failureTracker.addFailure(self, "Embed-MLT failed: \r\nReason:\r\n" + message, mailRecipients);
                });
        }, 
        interval: interval,
        workflowName: self.id
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

function log(msg, level) {
    console.log("Level=" + (level || "INFO") + "\tComponent=MLT_WORKFLOW\t" + msg);
}