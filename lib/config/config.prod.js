module.exports = {
	embedWF : {
		mailRecipients: "appdevadastra-alerts@gettyimages.com",
		alertSubject : "Embed Preview Workflow Failure",
		threshold: 3,
		interval: 60000,
		url: "http://embed.gettyimages.com/preview/1765189"
	},
	cdnWF : {
		mailRecipients: "appdevadastra-alerts@gettyimages.com",
		alertSubject : "Embed CDN Workflow Failure",
		threshold: 3,
		interval: 60000,
		url: "http://embed-cdn.gettyimages.com/css/normalize.css"

	},
	searchWF : {
		mailRecipients: "appdevadastra-alerts@gettyimages.com",
		alertSubject : "Embed search Workflow Failure",
		threshold: 3,
		interval: 60000,
		url: "http://www.gettyimages.com/embeds?phrase=rainier&clarifications=&family=creative&excludenudity=false"

	},
	mltWF : {
		mailRecipients: "appdevadastra-alerts@gettyimages.com",
		alertSubject : "Embed More-like-this Workflow Failure",
		threshold: 3,
		interval: 60000,
		url: "http://www.gettyimages.com/embeds/494327331/more-like-this"

	},
	mailer : {
		defaultSubject: "Embed Uncaught Exception",
		uncaughtExceptionRecipients: "appdevadastra-alerts@gettyimages.com",
		account: "gettyembed@gmail.com",
		password: "Ph0t0graph",
		name: "Getty Embed Alert"
	}
}