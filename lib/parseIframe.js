var cheerio = require('cheerio');

var execute = function() {
	try {
	    var $ = cheerio.load(this.data);
	    var imageSource = "http:" + $('.assetcomp').attr('src');
	    this.success(imageSource);
	}
	catch(err) {
    	this.failure(err);
	}
}

module.exports = function(data, success, failure) {
    this.taskName = "Parse IFrame";
    this.data = data;
    this.success = success || function(data) {};
    this.failure = failure || function(reason) {};
    this.execute = execute;
}