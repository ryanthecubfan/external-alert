var urlRetriever   = require('../urlRetriever.js'),
    failureTracker = require('../failureTracker.js'),
    config         = require('../config/config.js'),
    cheerio        = require('cheerio'),
    Q              = require('q'),
    log            = require('../log.js');

var mailRecipients = config.embedWF.mailRecipients || "ryan.brewer@gettyimages.com";
var url            = config.embedWF.url            || "http://embed.gettyimages.com/preview/1765189";
var interval       = config.embedWF.interval       || 60000;
var threshold      = config.embedWF.threshold      || 3;
var component      = "PREVIEW_WORKFLOW";

exports.createWorkflow = function() {
    var self = this;
    self.id = "Embed Preview Workflow";
    self.threshold = threshold;

    return { 
        action: function() {
            log.write(component, "Executing: " + self.id);
            urlRetriever.execute(url)
                .then(parsePreview)
                .then(urlRetriever.execute)
                .then(parseIFrame)
                .then(urlRetriever.execute)
                .then(function(data) {
                    failureTracker.clearFailures(self);
                    log.write(component, "Successfully created embed via '" + url + "', viewed the iframe, and loaded the image.")
                })
                .catch(function(message) {
                    log.write(component, message, "ERROR");
                    failureTracker.addFailure(self, "Embed Preview failed: \r\nReason:\r\n" + message, mailRecipients);
                });
        }, 
        interval: interval,
        workflowName: self.id
    };
}

parsePreview = function(data) {
    log.write(component, "Attempting to parse preview data.");
    var deferred = Q.defer()
    try {
        var content = JSON.parse(data);
        if(!content.embedTag) {
            deferred.reject(new Error("Embed tag not found on preview.\r\nData:\r\n" + data + "\r\n"));
        } else {
            var $ = cheerio.load(content.embedTag);
            var frameUrl = $('iframe').attr('src');
            if(frameUrl) {
                log.write(component, "Successfully parsed frame URL from preview embed tag: " + frameUrl);
                deferred.resolve("http:" + frameUrl);
            } else {
                deferred.reject(new Error("iframe src not found on preview.\r\nData:\r\n" + data + "\r\n"));
            }
        }
    }
    catch(err) {
        deferred.reject(new Error("Failed to parse preview: \r\n" + err + "\r\nData:\r\n" + data + "\r\n"));
    }
    return deferred.promise;
}

parseIFrame = function(data) {
    log.write(component, "Attempting to parse iframe content for image source.");
    var deferred = Q.defer();
    try {
        var $ = cheerio.load(data);
        var imageSource = $('.assetcomp').attr('src');
        if(imageSource) {
            log.write(component, "Successfully parsed iframe content for image source: " + imageSource);
            deferred.resolve("http:" + imageSource);
        } else {
            deferred.reject(new Error("Could not find assetcomp src attribute.\r\nData:\r\n" + data + "\r\n"));         
        }
    }
    catch(err) {
        deferred.reject(new Error("Failed to parse iframe for .assetcomp image src attribute: \r\n" + err + "\r\nData:\r\n" + data + "\r\n"));
    }

    return deferred.promise;
}
