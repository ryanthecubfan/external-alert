var url  = require('url'),
    http = require('http'),
    req  = require('request'),
    Q    = require('q');

exports.execute = function(urlToCheck) {
    log("Attempting to load URL: " + urlToCheck);
    
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
                    log("Successfully loaded URL: " + urlToCheck);
                    deferred.resolve(body);
                } else {
                    deferred.reject(new Error("Failed to load page at '" + urlToCheck + "' with Http Status Code of '" + resp.statusCode + "'\r\nresponse:\r\n" + resp.body));
                }
            }
        });
    }
    catch(Err) {
        log("***ERROR***")
        deferred.reject(new Error("Failed to connect to url '" + urlToCheck + "', with error:\r\n" + Err + "\r\n"));
    }

    return deferred.promise;
}

function log(msg, level) {
    console.log("LEVEL=" + (level || "INFO") + "\tComponent=URL_RETRIEVER\t" + msg);
}