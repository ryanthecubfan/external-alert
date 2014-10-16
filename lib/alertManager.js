var nodeMailer = require('nodemailer'),
    config     = require('./config/config.js'),
    log        = require('./log.js');

var account    = config.mailer.account  || "gettyembed@gmail.com";
var password   = config.mailer.password || "Ph0t0graph";
var fromName   = config.mailer.name     || "Getty Embed Alert";
var component = "ALERT_MANAGER";

exports.sendMail = function(subject, body, recipients) {
    // Use Smtp Protocol to send Email
    var smtpTransport = nodeMailer.createTransport({
        service: "gmail",
        auth: {
            user: account,
            pass: password
        }
    });

    var mail = {
        from: fromName + " <" + account + ">",
        to: recipients,
        subject: subject,
        text: body
    }

    smtpTransport.sendMail(mail, function(error, response){
        if(error) {
            log.write(component, error, "ERROR");
        } else {
            log.write(component, "Message sent: " + response.messageId);
        }

        smtpTransport.close();
    });
}