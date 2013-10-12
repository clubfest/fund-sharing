
Template.purchase.product = function(){
  return Products.findOne({name: Session.get("name")});
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
    Meteor.Router.to('/products');
  }
})