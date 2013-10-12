Products = new Meteor.Collection("products");
Purchases = new Meteor.Collection("purchases");

Meteor.methods({
  savePurchase: function(options){
    var userId = Meteor.userId();
    if (!userId){
      throw new Meteor.Error(413, "Please sign in first");
    }
    check(options.support, Number);
    Purchases.insert({
      name: options.name,
      support: options.support,
    });
    var minPrice = Products.findOne({name: options.name})["minPrice"]
    Products.update({name: options.name}, {
      $inc: {
        fundRaised: options.support + minPrice,
        numCopiesSold: 1
      }
    });
    Meteor.users.update(userId, {
      $inc: {
        money: -(options.support + minPrice)
      }
    })
  },
  addProduct: function(options){
    var userId = Meteor.userId();
    if (!userId){
      throw new Meteor.Error(413, "Please sign in first");
    }
    check(options.minPrice, Number);
    check(options.fundNeeded, Number);
    check(options.daysNeeded, Number);
    if (options.name == 0){
      throw new Meteor.Error(413, "Please provide a name")
    }
    if (Products.findOne({name: options.name})){
      throw new Meteor.Error(413, "Please pick another name, as this name as been taken.");
    }
    Products.insert(options)
  }
})
