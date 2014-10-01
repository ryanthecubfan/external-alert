var url  = require('url'),
    http = require('http'),
    Q    = require('q');

exports.execute = function(urlToCheck) {
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
                deferred.reject("Failed to load page at '" + urlToCheck + "' with Http Status Code of '" + response.StatusCode + "'\r\n\r\nresponse:\r\n\r\n" + responseText);
            }
            else {
                deferred.resolve(responseText);
            }
        })
    }).end();

    return deferred.promise;
}