var _              = require('underscore'),
    urlRetriever   = require('./lib/urlRetriever.js'),
    config         = require('./config/config.js'),
    Q			   = require('q'),
    log            = require('./lib/log.js');

var component = "";

exports.getAction = function(config) {
    component = config.workflowName;
    
    return function(done) {
        log.write(component, "Executing Workflow");
        urlRetriever.execute(config.url)
            .then(parseSearchHtml)
            .then(function(data) {
                log.write(component, "Successfully loaded embed search page");
                done();
            })
            .catch(function(message) {
                log.write(component, message, "ERROR");
                done(message);
            });
    }
}

function parseSearchHtml(data) {
	var deferred = Q.defer();

	if(!data) {
		deferred.reject(new Error("Search HTML was null"));
	} else {
		if(data.indexOf('<body class="embeds search_container" ng-app="EmbedApp">') == -1) {
			deferred.reject(new Error("Search HTML did not contain '" + '<body class="embeds search_container" ng-app="EmbedApp">' + "'"));
		}
		else {
			deferred.resolve("Success");
		}
	}

	return deferred.promise;
}
