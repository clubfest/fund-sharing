Products = new Meteor.Collection("products");

Meteor.methods({
  savePurchase: function(options){
    var userId = Meteor.userId();
    if (!userId){
      throw new Meteor.Error(413, "Please sign in first");
    }
    check(options.support, Number);
    var initialPrice = Products.findOne({name: options.name})["initialPrice"]
    Products.update({name: options.name}, {
      $inc: {
        fundRaised: options.support + initialPrice,
        numCopiesSold: 1
      },
      $push: {
        orders: {
          userId: userId,
          paid: options.support + initialPrice,
        }
      }
    });

    Meteor.users.update(userId, {
      $inc: {
        "fundSharing.money": -(options.support + initialPrice)
      },
      $push: {
        'fundSharing.orders': {
          initialPrice: initialPrice,
          support: options.support,
          refunded: 0,
        }
      }
    });
  },
  addProduct: function(options){
    var userId = Meteor.userId();
    if (!userId){
      throw new Meteor.Error(413, "Please sign in first");
    }
    check(options.initialPrice, Number);
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
