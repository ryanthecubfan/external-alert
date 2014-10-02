var cheerio = require('cheerio'),
	Q		= require('q');

exports.execute = function(data) {
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