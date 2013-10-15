


// Template.purchase.isConceiving = function(){
//   return Session.get('status') == 'conceiving';
// }

Template.purchase.rendered = function(){
  $('.progressbar').progressbar({
    value: Session.get('raised'),
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
    

Template.purchase.events({
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
    Meteor.call("savePurchase", {
      name: Session.get("name"),
      support: support,
      email: email,
      comment: comment
    }, function(err){
      if (err) {
        alert(err.reason);
      } else {
        Meteor.Router.to('/profile');
      }
    });      
  }
});