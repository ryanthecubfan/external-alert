module.exports = {
	embedWF: {
		mailRecipients: "ryan.brewer@gettyimages.com",
		alertSubject : "Embed Preview Workflow Failure - TEST",
		threshold: 3,
		interval: 10000,
		url: "http://localhost:3000/preview/1765189x"
	},
	cdnWF: {
		mailRecipients: "ryan.brewer@gettyimages.com",
		alertSubject : "Embed CDN Workflow Failure - TEST",
		threshold: 3,
		interval: 10000,
		url: "http://embed-cdn.gettyimages.com/css/normalize.css"

	},
	searchWF: {
		mailRecipients: "ryan.brewer@gettyimages.com",
		alertSubject : "Embed Search Workflow Failure - TEST",
		threshold: 3,
		interval: 10000,
		url: "http://www.gettyimages.com/embeds?phrase=rainier&clarifications=&family=creative&excludenudity=false"

	},
	mltWF: {
		mailRecipients: "ryan.brewer@gettyimages.com",
		alertSubject : "Embed More-like-this Workflow Failure - TEST",
		threshold: 3,
		interval: 10000,
		url: "http://www.gettyimages.com/embeds/494327331/more-like-this"

	},
	mailer: {
		defaultSubject: "Embed Uncaught Exception - TEST",
		uncaughtExceptionRecipients: "ryan.brewer@gettyimages.com",
		account: "gettyembed@gmail.com",
		password: "Ph0t0graph",
		name: "Getty Embed Alert"
	},
	sqs: {
		url: "https://sqs.us-west-2.amazonaws.com/961961469659/adastra-monitor-events"
	}
}