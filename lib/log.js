var AWS    = require('aws-sdk');

exports.write = function(component, msg, level) {
	var logLevels = null;
	var queueLevels = null;

	if(this.loggingConfig && this.loggingConfig.logLevels) {
		logLevels = this.loggingConfig.logLevels;
		queueLevels = this.loggingConfig.queueLevels;
	}

	var dateTime = new Date();
	level = level || "INFO";

	if(!logLevels || logLevels.indexOf(level) > -1) {
		var logEntry = "DateTime=" + dateTime + "\tLevel=" + level + "\tComponent=" + component + "\t" + msg + "\r";
		console.log(logEntry);
	}
	if ((!queueLevels || queueLevels.indexOf(level) > -1) && this.sqsConfig) {
		try {
			var url = this.sqsConfig.url ? this.sqsConfig.url : "https://sqs.us-west-2.amazonaws.com/961961469659/embed-monitor-events";
			console.log("Writing to SQS at " + url);

			var sqs;

			if(this.sqsConfig.key && this.sqsConfig.secret && this.sqsConfig.region) {
				sqs = new AWS.SQS({
	            	accessKeyId: this.sqsConfig.key,
	            	secretAccessKey: this.sqsConfig.secret,
	        	    region: this.sqsConfig.region
	        	});
			} else {
				 sqs = new AWS.SQS();
			}

			var messageBody = "{ \"dateTime\":\"" + dateTime + "\", \"level\":\"" + level + "\", \"Component\":\"EmbedMonitor\", \"MonitorComponent\":\"" + component + "\", \"message\":\"" + msg.toString().replace(/[\r\n]+/gim, " ").replace(/[\"]+/gim, "\\\"") + "\" }"
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

exports.init = function(sqsConfig, loggingConfig) {
	this.sqsConfig = sqsConfig;
	this.loggingConfig = loggingConfig;
	console.log("WORKER", "Setting AWS region to " + sqsConfig.region);
	console.log("WORKER", "Logging levels set to " + loggingConfig.logLevels.join(","));
	AWS.config.update({ region: sqsConfig.region });
}