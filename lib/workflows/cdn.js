var HttpLoader   = require('../httpLoader.js'),
    AlertManager = require('../alertManager.js');

var mailRecipients = process.env.MAIL_RECIPIENTS || "ryan.brewer@gettyimages.com";
var timer = process.env.CDN_TIMER || 60000;
var url = process.env.CDN_URL || "http://embed-cdn.gettyimages.com/css/normalize.css";
var threshold = process.env.CDN_THRESHOLD || 3;

exports.createWorkflow = function() {
    return { 
        action: function() {
            console.log("Executing Embed-CDN loader task.");
            HttpLoader.execute(url)
                .then(function(data) {
                    console.log("Successfully loaded normalize.css from embed-cdn");
                })
                .catch(function(message) {
                    console.log("****************Embed-CDN Workflow Error****************");
                    console.log(message);
                    AlertManager.sendMail("Embed-CDN Failure", "Embed-CDN failed: \r\n\r\nReason:\r\n\r\n" + message, mailRecipients);
                });
        }, 
        interval: timer
    };
}