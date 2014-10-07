var nodeMailer = require('nodemailer');
var config     = require('./config/config.js');

var account    = config.mailer.account  || "gettyembed@gmail.com";
var password   = config.mailer.password || "Ph0t0graph";
var fromName   = config.mailer.name     || "Getty Embed Alert";

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
            log(error, "ERROR");
        } else {
            log("Message sent: " + response.messageId);
        }

        smtpTransport.close();
    });
}

function log(msg, level) {
    console.log("Level=" + (level || "INFO") + "\tComponent=ALERT_MANAGER\t" + msg);
}