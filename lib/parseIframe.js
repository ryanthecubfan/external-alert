var cheerio = require('cheerio'),
	Q		= require('q');

exports.execute = function(data) {
	var deferred = Q.defer();
	try {
	    var $ = cheerio.load(data);
	    var imageSource = $('.assetcomp').attr('src');
	    if(imageSource) {
	    	deferred.resolve("http:" + imageSource);
		} else {
    		deferred.reject(new Error("Could not found assetcomp src attribute.\r\n\r\nData:\r\n\r\n" + data + "\r\n\r\n"));			
		}
	}
	catch(err) {
    	deferred.reject(new Error("Failed to parse iframe for .assetcomp image src attribute: \r\n\r\n" + err + "\r\n\r\nData:\r\n\r\n" + data + "\r\n\r\n"));
	}

	return deferred.promise;
}