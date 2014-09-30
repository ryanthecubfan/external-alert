var fs        = require('fs'),
    _         = require('underscore'),
    Scheduler = require('./lib/scheduler.js'),
    http	  = require('http');
var scheduler = new Scheduler()

scheduler.addTask(httpCheck, 5000)
scheduler.start()

function httpCheck() {
	var options = {}
	http.request(options, function(response) {

	})
}