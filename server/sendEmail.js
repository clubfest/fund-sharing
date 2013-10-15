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
  sendToMailingList: function (from, to, bcc, replyTo, subject, text) {
    check([from, subject, text], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    Email.send({
      from: from,
      to: to,
      bcc: cc,
      replyTo: replyTo,
      subject: subject,
      text: text
    });
  },
  'sendToClients': function(productId, subject, content){
    var product = Products.findOne(productId);
    var creatorEmail = Meteor.user().services.facebook.email;
    var mailingList = [];
    for (var i=0; i<product.orders.length; i++){
      mailingList.push(product.orders[i].email);
    }
    this.unblock();
    Email.send({
      from: nameDotted(product.name)+'@funding.a.meteor.com',
      to: creatorEmail,
      bcc: mailingList,
      replyTo: creatorEmail,
      subject: subject,
      text: content,
    });
  }
});