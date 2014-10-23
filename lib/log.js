var AWS 	= require('aws-sdk');

exports.write = function(component, msg, level) {
	var dateTime = new Date();
	level = level || "INFO";

	var logEntry = "DateTime=" + dateTime + "\tLevel=" + (level || "INFO") + "\tComponent=" + component + "\t" + msg + "\r";
	console.log(logEntry);

	if (level === "ERROR" && this.config) {
		try {
			var url = this.con.url ? this.con.url : "https://sqs.us-west-2.amazonaws.com/961961469659/embed-monitor-events";
			console.log("Writing to SQS at " + url);

			var sqs = new AWS.SQS();

			var messageBody = "{ \"dateTime\":\"" + dateTime + "\", \"level\":\"" + level + "\", \"Component\":\"EmbedMonitor\", \"MonitorComponent\":\"" + component + "\", \"message\":\"" + msg.toString().replace(/[\r\n]+/gim, " ") + "\" }"

			var params = {
			  MessageBody: messageBody,
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

exports.init = function(config) {
	this.config = config;
}