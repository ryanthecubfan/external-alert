var HttpLoader    = require('../httpLoader.js'),
    Mailer        = require('../mailer.js');

var mailRecipients = process.env.MAIL_RECIPIENTS || "ryan.brewer@gettyimages.com";
var cdnTimer = process.env.CDN_TIMER || 60000;
var cdnUrl = process.env.CDN_URL || "http://embed-cdn.gettyimages.com/css/normalize.css";

exports.createWorkflow = function() {
    return { 
        action: function() {
            console.log("Executing Embed-CDN loader task.");
            HttpLoader.execute(cdnUrl)
                .then(function(data) {
                    console.log("Successfully loaded normalize.css from embed-cdn");
                })
                .catch(function(message) {
                    console.log("****************Embed-CDN Workflow Error****************");
                    console.log(message);
                    //Mailer.sendMail("Embed-CDN Failure", "Embed-CDN failed: \r\n\r\nReason:\r\n\r\n" + message, mailRecipients);
                });
        }, 
        interval: cdnTimer
    };
}