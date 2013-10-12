
Template.purchase.product = function(){
  var info = Products.findOne({name: Session.get("name")});
  return info
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