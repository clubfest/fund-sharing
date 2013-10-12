
Template.purchase.product = function(){
  var info = Products.findOne({name: Session.get("name")});
  Session.set('raised', info.fundRaised);
  Session.set('needed', info.fundNeeded);
  return info
}

Template.purchase.rendered = function(){
  $('#fund-progressbar').progressbar({
    value: Session.get('raised'),
    max: Session.get('needed'),
  })
}

Template.purchase.events({
  "click #purchase-submit": function(){
    var support = parseFloat($("#support-input").val());
    if (!support || support < 0) {
      alert("support must be positive.");
      return ;
    }
    Meteor.call("savePurchase", {
      name: Session.get("name"),
      support: support,
    })
  }
})