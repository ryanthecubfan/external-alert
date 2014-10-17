var AWS 	= require('aws-sdk'),
	config  = require('./config/config.js');

exports.write = function(component, msg, level) {
	var logEntry = "DateTime=" + new Date() + "\tLevel=" + (level || "INFO") + "\tComponent=SEARCH_WORKFLOW\t" + msg + "\r";
	console.log(logEntry);

	if (level === "ERROR") {
		try {
			var url = config.sqs && config.sqs.url ? config.sqs.url : "https://sqs.us-west-2.amazonaws.com/961961469659/embed-monitor-events";
			console.log("Writing to SQS at " + url);

			var sqs = new AWS.SQS();

			var params = {
			  MessageBody: logEntry,
			  QueueUrl: url,
			  DelaySeconds: 0
			};

			sqs.sendMessage(params, function(err, data) {
			  if (err) console.log("SQS Error: ", err, err.stack); 	// an error occurred
			  else     console.log("SQS Success Response: ", data); // successful response
			});
		} catch (error) {
			console.log(error);
		}
	}
}