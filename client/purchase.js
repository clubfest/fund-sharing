
Template.purchase.isAdmin = function(){
  return ;
}
Template.purchase.product = function(){
  var info = Products.findOne({name: Session.get("name")});
  Session.set('raised', info.fundRaised);
  Session.set('needed', info.fundNeeded);
  Session.set('creatorId', info.creatorId);
  Session.set('productId', info._id)
  Session.set('isAdmin', Meteor.userId() === Session.get('creatorId'))
  return info
}

Template.purchase.rendered = function(){
  $('#fund-progressbar').progressbar({
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
    var support = parseFloat($("#support-input").val());
    if (support < 0) {
      alert("support must be positive.");
      return ;
    }
    Meteor.call("savePurchase", {
      name: Session.get("name"),
      support: support,
    });
  }
})