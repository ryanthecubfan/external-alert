var cheerio = require('cheerio'),
	Q		= require('q');

exports.execute = function(data) {
	var deferred = Q.defer();
	try {
	    var $ = cheerio.load(data);
	    var imageSource = "http:" + $('.assetcomp').attr('src');
	    deferred.resolve(imageSource);
	}
	catch(err) {
    	deferred.reject("Failed to parse iframe for .assetcomp image src attribute: \r\n\r\n" + err + "\r\n\r\nData:\r\n\r\n" + data);
	}

	return deferred.promise;
}