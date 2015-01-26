var mailer = require('./mailer.js'),
    log    = require('./log.js');

var results = {};
var component = "FAILURE_TRACKER";

exports.addResult = function(workflowConfig, errorDetails) {
    var resultSet = results[workflowConfig.workflowName];
    if(!resultSet) {
        resultSet = {};
        resultSet.workflowResults = [];
        results[workflowConfig.workflowName] = resultSet;
    }

    var wfResults = results[workflowConfig.workflowName].workflowResults;

    if(wfResults.length >= workflowConfig.attemptsToTrack) {
        wfResults.shift();
    }

    if(errorDetails) {
        wfResults.push({ errorDetails: errorDetails, timestamp: Date.now() });

        log.write(component, "Failure Added: " + workflowConfig.workflowName + ": " + wfResults.length);

        if(countFailures(wfResults) >= workflowConfig.threshold) {
            var subject = "Error in " + workflowConfig.workflowName;
            log.write(component, wfResults.length + " consecutive failures in workflow '" + workflowConfig.workflowName + "'.  Sending email to '" + workflowConfig.mailRecipients + "'", "CRITICAL");
            mailer.sendMail(subject, buildBody(results[workflowConfig.workflowName]), workflowConfig.mailRecipients);
            log.write(component, 'clearing workflow failures');
            results[workflowConfig.workflowName] = null;
        }
    } else {
        wfResults.push( { timestamp: Date.now() })
    }
}

function buildBody(resultSet) {
    var result = "";
    for(var i = 0; i < resultSet.workflowResults.length; i++) {
        var wfResults = resultSet.workflowResults[i];

        if(result.errorDetails) {
            result += "Failure at: " + new Date(wfResults.timestamp).toISOString() + "\r\n";
            result += wfResults.errorDetails + "\r\n";
        } else {
            result += "Success at: " + new Date(wfResults.timestamp).toISOString() + "\r\n";
        }
    }
    return result;
}

function countFailures(wfResults) {
    var failures = 0;
    for(var i = 0; i < wfResults.length; i++) {
        if(wfResults[i].errorDetails) {
            failures++;
        }
    }
    return failures;
}