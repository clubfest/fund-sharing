
Template.purchase.product = function(){
  return Products.findOne({name: Session.get("name")});
}

Template.purchase.events({
  "click #purchase-submit": function(){
    Meteor.Router.to('/products');
  }
})