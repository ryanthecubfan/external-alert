var urlRetriever   = require('../urlRetriever.js'),
    failureTracker = require('../failureTracker.js'),
    config         = require('../config/config.js'),
    log            = require('../log.js');

var mailRecipients = config.cdnWF.mailRecipients || "ryan.brewer@gettyimages.com";
var interval       = config.cdnWF.interval       || 60000;
var url            = config.cdnWF.url            || "http://embed-cdn.gettyimages.com/css/normalize.css";
var threshold      = config.cdnWF.threhold       || 3;
var component      = "CDN_WORKFLOW";

exports.createWorkflow = function() {
    var self = this;
    self.id = "Embed CDN Workflow";
    self.threshold = threshold;

    return { 
        action: function() {
            log.write(component, "Executing: " + self.id);
            urlRetriever.execute(url)
                .then(function(data) {
                    log.write(component, "Successfully loaded normalize.css from embed-cdn");
                })
                .catch(function(message) {
                    log.write(component, message, "ERROR");
                    failureTracker.addFailure(self, "Embed-CDN failed: \r\nReason:\r\n" + message, mailRecipients);
                });
        }, 
        interval: interval,
        workflowName: self.id
    };
}
