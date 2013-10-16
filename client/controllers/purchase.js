
Template.purchase.rendered = function(){
  $('.progressbar').progressbar({
    value: Session.get('raised'),
    max: Session.get('needed'),
  });


  if (Session.get('isAdmin')){
    $.fn.editable.defaults.mode = 'inline';
    $('.editable:not(.editable-click)').editable('destroy').editable({
      success: function(response, newValue) {
        updateProduct(this.dataset.category, newValue);
      }
    });
  }
}

Template.purchase.events({
  "click #purchase-submit": function(){
    var support = $("#support-input").val();
    if (!support) support = 0;
    support = parseFloat(support);
    if (support < 0) {
      alert("support must be positive.");
      return ;
    }
    // var email = $('#email-input').val();
    var user = Meteor.user();
    if (!user){
      alert("Please sign in first");
      return ;
    }
    Meteor.call("savePledge", Session.get("name"), support, user.services.facebook.email, function(err){
      if (err) {
        alert(err.reason);
      } else {
        Meteor.Router.to('/profile');
      }
    });      
  },
  'click .comment-icon': function(evt){
    var content = prompt("Email content:");
    if (!content) return ;
    var productId = evt.currentTarget.dataset.productId;
    Meteor.call('sendToClients', productId, "Comment on your product at funding.a.meteor.com", content, function(err){
      if (err) alert(err.reason);
    });
  }
});

function updateProduct(category, newValue){
  var productId = Session.get('productId');
  switch (category){
    case "initialPrice":
      newValue = parseFloat(newValue);
      Meteor.call("updateInitialPrice", productId, newValue, function(err){
        if (err) alert(err.reason);
      });
      break;
    case "daysNeeded":
      newValue = parseFloat(newValue);
      Meteor.call("updateDaysNeeded", productId, newValue, function(err){
        if (err) alert(err.reason);
      });
      break;
    case "fundNeeded":
      newValue = parseFloat(newValue);
      Meteor.call("updateFundNeeded", productId, newValue, function(err){
        if (err) alert(err.reason);
      });
      break;
    case "name":
      Meteor.call("updateName", productId, newValue, function(err){
        if (err) alert(err.reason);
      });
      break;
    case "description":
      Meteor.call("updateDescription", productId, newValue, function(err){
        if (err) alert(err.reason);
      });
      break;
    default:
      alert("update wrong field")
      break;
  }
}