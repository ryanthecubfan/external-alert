var alertManager = require('./alertManager.js'),
    log          = require('./log.js');

var failures = {};
var component = "FAILURE_TRACKER";

exports.addFailure = function(workflowConfig, details) {
    var failureSet = failures[workflowConfig.workflowName];
    if(!failureSet) {
        failureSet = {};
        failureSet.items = [];
        failures[workflowConfig.workflowName] = failureSet;
    }

    var arr = failures[workflowConfig.workflowName].items;
    arr.push({ details: details, timestamp: Date.now() });

    log.write(component, "Failure Added: " + workflowConfig.workflowName + ": " + arr.length);

    if(arr.length >= workflowConfig.threshold) {
        var subject = "Error in " + workflowConfig.workflowName;
        log.write(component, arr.length + " consecutive failures in workflow '" + workflowConfig.workflowName + "'.  Sending email to '" + workflow.mailRecipients + "'", "CRITICAL");
        alertManager.sendMail(subject, buildBody(failures[workflowConfig.workflowName]), workflowConfig.mailRecipients);
        log.write(component, 'clearing workflow failures');
        failures[workflowConfig.workflowName] = null;
    }
}

exports.clearFailures = function(workflowConfig) {
    failures[workflowConfig.workflowName] = null;
}

function buildBody(failureSet) {
    var result = "";
    for(var i = 0; i < failureSet.items.length; i++) {
        result += "Failure at: " + new Date(failureSet.items[i].timestamp).toISOString() + "\r\n";
        result += failureSet.items[i].details + "\r\n";
    }
    return result;
}
