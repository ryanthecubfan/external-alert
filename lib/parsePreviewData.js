var cheerio = require('cheerio');

var execute = function() {
	try {
	    var content = JSON.parse(this.data);
	    var $ = cheerio.load(content.embedTag);
	    var src = "http:" + $('iframe').attr('src');
	    this.success(src);
	}
	catch(err) {
    	this.failure(err);
	}
}

module.exports = function(data, success, failure) {
    this.taskName = "Parse Preview";
    this.data = data;
    this.success = success || function(data) {};
    this.failure = failure || function(reason) {};
    this.execute = execute;
}