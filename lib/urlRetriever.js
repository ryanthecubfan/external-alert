var url  = require('url'),
    http = require('http'),
    req  = require('request'),
    Q    = require('q'),
    log  = require('./log.js');

exports.execute = function(urlToCheck) {
    var component      = "CDN_WORKFLOW";
    log.write(component, "Attempting to load URL: " + urlToCheck);
    var deferred = Q.defer();

    var theUrl = url.parse(urlToCheck);

    var options = {
        host: theUrl.hostname,
        path: theUrl.path,
        port: theUrl.port,
    }
    
    try {
        req(urlToCheck, function(err, resp, body) {
            if(err) {
                deferred.reject(new Error("Failed to connect to url '" + urlToCheck + "', with error:\r\n" + err + "\r\n"));
            } else {
                if(resp.statusCode == 200) {
                    log.write(component, "Successfully loaded URL: " + urlToCheck);
                    deferred.resolve(body);
                } else {
                    deferred.reject(new Error("Failed to load page at '" + urlToCheck + "' with Http Status Code of '" + resp.statusCode + "'\r\nresponse:\r\n" + resp.body));
                }
            }
        });
    }
    catch(Err) {
        log.write(component, "***ERROR***")
        deferred.reject(new Error("Failed to connect to url '" + urlToCheck + "', with error:\r\n" + Err + "\r\n"));
    }

    return deferred.promise;
}
