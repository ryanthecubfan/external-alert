exports.write = function(component, msg, level) {
	console.log("DateTime=" + new Date() + "\tLevel=" + (level || "INFO") + "\tComponent=SEARCH_WORKFLOW\t" + msg);
}