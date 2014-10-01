var url  = require('url'),
    http = require('http');

var execute = function() {
  var theUrl = url.parse(this.urlToCheck);
  var self = this;

  var options = {
    host: theUrl.hostname,
    path: theUrl.path,
    port: theUrl.port,

  }

  var req = http.request(options, function(response) {
    var responseText = '';

    response.on('data', function (chunk) {
      responseText += chunk;
    });

    response.on('end', function() {
      if(response.statusCode != 200) {
        self.failure("Non-200", responseText);
      }
      else {
        self.success(responseText);
      }
    })

  });

  req.end();  
}

module.exports = function(urlToCheck, success, failure) {
  this.taskName = "HTTP Loader";
  this.urlToCheck = urlToCheck;
  this.success = success || function(responseText) {};
  this.failure = failure || function(failureReason) {};
  this.execute = execute;
}