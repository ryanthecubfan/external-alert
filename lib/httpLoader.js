var url  = require('url'),
    http = require('http'),
    Q    = require('q');

exports.execute = function(urlToCheck) {
    console.log("Attempting to load URL: " + urlToCheck);
    
    var deferred = Q.defer();

    var theUrl = url.parse(urlToCheck);

    var options = {
        host: theUrl.hostname,
        path: theUrl.path,
        port: theUrl.port,
    }

    http.request(options, function(response) {
        var responseText = '';

        response.on('data', function (chunk) {
            responseText += chunk;
        });

        response.on('end', function() {
            if(response.statusCode != 200) {
                deferred.reject(new Error("Failed to load page at '" + urlToCheck + "' with Http Status Code of '" + response.statusCode + "'\r\n\r\nresponse:\r\n\r\n" + responseText));
            }
            else {
                console.log("Successfully loaded URL: " + urlToCheck);
                deferred.resolve(responseText);
            }
        })
    }).end();

    return deferred.promise;
}