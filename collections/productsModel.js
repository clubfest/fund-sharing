Products = new Meteor.Collection("products");
Purchases = new Meteor.Collection("purchases");

Meteor.methods({
  savePurchase: function(options){
    check(options.support, Number);
    Purchases.insert({
      name: options.name,
      support: options.support,
    });
    var minPrice = Products.findOne({name: options.name})["minPrice"]
    Products.update({name: options.name}, {
      $inc: {fundRaised: options.support + minPrice}
    });
  }
})
