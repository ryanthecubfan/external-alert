var alertManager = require('./alertManager.js');
var config     = require('./config/config.js');

var failures = {};

exports.addFailure = function(workflow, details, recipients) {
    var failureSet = failures[workflow.id];
    if(!failureSet) {
        failureSet = {};
        failureSet.recipients = recipients;
        failureSet.items = [];
        failures[workflow.id] = failureSet;
    }

    var arr = failures[workflow.id].items;
    arr.push({ details: details, timestamp: Date.now() });

    log("Failure Added: " + workflow.id + ": " + arr.length);

    if(arr.length >= workflow.threshold) {
        var subject = "Error in " + workflow.id;
        log(arr.length + " consecutive failures in workflow '" + workflow.id + "'.  Sending email to '" + recipients + "'", "CRITICAL");
        alertManager.sendMail(subject, buildBody(failures[workflow.id]), failures[workflow.id].recipients);
        log('clearing workflow failures');
        failures[workflow.id] = null;
    }
}

exports.clearFailures = function(workflow) {
    failures[workflow.id] = null;
}

function buildBody(failureSet) {
    var result = "";
    for(var i = 0; i < failureSet.items.length; i++) {
        result += "Failure at: " + new Date(failureSet.items[i].timestamp).toISOString() + "\r\n";
        result += failureSet.items[i].details + "\r\n";
    }
    return result;
}

function log(msg, level) {
    console.log("Level=" + (level || "INFO") + "\tComponent=FAILURE_TRACKER\t" + msg);
}