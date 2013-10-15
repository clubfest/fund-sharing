
Template.donate.rendered = function(){
  $('.progressbar').progressbar({
    value: Session.get('donated'),
    max: Session.get('needed'),
  });

  if (Session.get('isAdmin')){
    $.fn.editable.defaults.mode = 'inline';
    $('.editable:not(.editable-click)').editable('destroy').editable({
      success: function(response, newValue) {
        var options = {};
        options[this.dataset.category] = newValue;
        Meteor.call("updateProduct", Session.get("productId"), options, function(err){
          if (err) alert(err.reason);
        });
    }});
  }
}

Template.donate.events({
  "click #purchase-submit": function(){
    var support = $("#support-input").val();
    if (!support) support = 0;
    support = parseFloat(support);
    if (support < 0) {
      alert("support must be positive.");
      return ;
    }
    var email = $('#email-input').val();
    var comment = prompt("Comment or Request")
    if (comment===null) return;
    var options = {
      name: Session.get("name"),
      support: support,
      email: email,
      comment: comment,
    };
    Meteor.call("savePurchase", options, function(err){
      if (err) {
        alert(err.reason);
      } else {
        Meteor.Router.to('/profile');
      }
    });
  }
})

  // 'click #donation-submit': function(){
  //   var amount = parseFloat($('#donation-input').val());
  //   console.log($('donation-input').val())
  //   if (amount<=0){
  //     alert('Thanks for nothing');
  //     return ;
  //   }
  //   options = {
  //     amount: amount,
  //     productId: Session.get('productId'),
  //   }
  //   Meteor.call('donate', options, function(err){
  //     if (err) return err.reason;
  //   })
  // },