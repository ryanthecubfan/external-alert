var HttpLoader    = require('../httpLoader.js'),
    Mailer        = require('../mailer.js'),
    cheerio       = require('cheerio'),
    Q             = require('q');;

var mailRecipients = process.env.MAIL_RECIPIENTS || "ryan.brewer@gettyimages.com";
var previewUrl = process.env.PREVIEW_URL || "http://embed.gettyimages.com/preview/1765189";
var previewTimer = process.env.PREVIEW_TIMER || 60000;

exports.createWorkflow = function() {
    return { 
        action: function() {
            console.log("Executing preview loader task.");
            HttpLoader.execute(previewUrl)
                .then(parsePreview)
                .then(HttpLoader.execute)
                .then(parseIFrame)
                .then(HttpLoader.execute)
                .then(function(data) {
                    console.log("Successfully created embed via '" + previewUrl + "', viewed the iframe, and loaded the image.")
                })
                .catch(function(message) {
                    console.log("****************Embed Workflow Error****************");
                    console.log(message);
                    Mailer.sendMail("Embed Preview Failure", "Embed Preview failed: \r\n\r\nReason:\r\n\r\n" + message, mailRecipients);
                });
        }, 
        interval: previewTimer
    };
}

parsePreview = function(data) {
    console.log("Attempting to parse preview data.");
    var deferred = Q.defer()
    try {
        var content = JSON.parse(data);
        if(!content.embedTag) {
            deferred.reject(new Error("Embed tag not found on preview.\r\n\r\nData:\r\n\r\n" + data + "\r\n\r\n"));
        } else {
            var $ = cheerio.load(content.embedTag);
            var frameUrl = $('iframe').attr('src');
            if(frameUrl) {
                console.log("Successfully parsed frame URL from preview embed tag: " + frameUrl);
                deferred.resolve("http:" + frameUrl);
            } else {
                deferred.reject(new Error("iframe src not found on preview.\r\n\r\nData:\r\n\r\n" + data + "\r\n\r\n"));
            }
        }
    }
    catch(err) {
        deferred.reject(new Error("Failed to parse preview: \r\n\r\n" + err + "\r\n\r\nData:\r\n\r\n" + data + "\r\n\r\n"));
    }
    return deferred.promise;
}

parseIFrame = function(data) {
    console.log("Attempting to parse iframe content for image source.");
    var deferred = Q.defer();
    try {
        var $ = cheerio.load(data);
        var imageSource = $('.assetcomp').attr('src');
        if(imageSource) {
            console.log("Successfully parsed iframe content for image source: " + imageSource);
            deferred.resolve("http:" + imageSource);
        } else {
            deferred.reject(new Error("Could not find assetcomp src attribute.\r\n\r\nData:\r\n\r\n" + data + "\r\n\r\n"));         
        }
    }
    catch(err) {
        deferred.reject(new Error("Failed to parse iframe for .assetcomp image src attribute: \r\n\r\n" + err + "\r\n\r\nData:\r\n\r\n" + data + "\r\n\r\n"));
    }

    return deferred.promise;
}