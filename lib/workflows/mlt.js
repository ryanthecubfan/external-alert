var urlRetriever   = require('../urlRetriever.js'),
    failureTracker = require('../failureTracker.js'),
    config         = require('../config/config.js'),
    Q			   = require('q'),
    log            = require('../log.js');

var mailRecipients = config.mltWF.mailRecipients || "ryan.brewer@gettyimages.com";
var interval       = config.mltWF.interval       || 60000;
var url            = config.mltWF.url            || "http://www.gettyimages.com/embeds/494327331/more-like-this";
var threshold      = config.mltWF.threhold       || 3;
var component      = "MLT_WORKFLOW";

exports.createWorkflow = function() {
    var self = this;
    self.id = "Embed Portal More-like-this Workflow";
    self.threshold = threshold;

    return { 
        action: function() {
            log.write(component, "Executing Workflow: " + self.id);
            urlRetriever.execute(url)
            	.then(parseMltHtml)
                .then(function(data) {
                    log.write(component, "Successfully loaded embed MLT page");
                })
                .catch(function(message) {
                    log.write(component, message, "ERROR");
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
