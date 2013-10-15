// Configure our domain to use mailgun
Meteor.startup(function(){
  process.env.MAIL_URL = 'smtp://postmaster%40funding.a.meteor.com:82d857fu4s83@smtp.mailgun.org:587'
})

// In your server code: define a method that the client can call
Meteor.methods({
  sendEmail: function (to, from, subject, text) {
    check([from, subject, text], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: text
    });
  },
  sendToMailingList: function (from, to, cc, replyTo, subject, text) {
    check([from, subject, text], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    Email.send({
      from: from,
      to: to,
      cc: cc,
      replyTo: replyTo,
      subject: subject,
      text: text
    });
  }
});