var cheerio = require('cheerio'),
	Q		= require('q');

exports.execute = function(data) {
	var deferred = Q.defer()
	try {
	    var content = JSON.parse(data);
	    var $ = cheerio.load(content.embedTag);
	    var src = "http:" + $('iframe').attr('src');
	    deferred.resolve(src);
	}
	catch(err) {
    	deferred.reject("Failed to parse preview: \r\n\r\n" + err + "\r\n\r\nContent:\r\n\r\n" + data);
	}
	return deferred.promise;
}