var Mailer = require('../lib/mailer.js');
var mailer = new Mailer()

mailer.sendMail("Test Message", "This is the body of the message");