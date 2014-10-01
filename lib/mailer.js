var nodeMailer = require('nodemailer');

var fromEmail = process.env.FROM_EMAIL || "gettyembed@gmail.com";
var fromName = process.env.FROM_NAME || "Getty Embed Alert";
var emailPassword = process.env.EMAIL_PASSWORD || "Ph0t0graph";

exports.sendMail = function(subject, body, recipients) {
    // Use Smtp Protocol to send Email
    var smtpTransport = nodeMailer.createTransport({
        service: "gmail",
        auth: {
            user: fromEmail,
            pass: emailPassword
        }
    });

    var mail = {
        from: fromName + " <" + fromEmail + ">",
        to: recipients,
        subject: subject,
        text: body
    }

    smtpTransport.sendMail(mail, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }

        smtpTransport.close();
    });
  }
