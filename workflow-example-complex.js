var _              = require('underscore'),
    urlRetriever   = require('./lib/urlRetriever.js'),
    config         = require('./config/config.js'),
    cheerio        = require('cheerio'),
    Q              = require('q'),
    log            = require('./lib/log.js');

var component = "";

exports.getAction = function(config) {
    component = config.workflowName;

    return function(done) {
        log.write(component, "Executing Workflow");
        urlRetriever.execute(config.url)
            .then(parsePreview)
            .then(urlRetriever.execute)
            .then(parseIFrame)
            .then(urlRetriever.execute)
            .then(function(data) {
                done();
                log.write(component, "Successfully created embed via '" + config.url + "', viewed the iframe, and loaded the image.")
            })
            .catch(function(message) {
                log.write(component, message, "ERROR");
                done(message);
            });
    }
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
        var imageSource = $('img.assetcomp').attr('src');
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
