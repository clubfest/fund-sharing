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
  },
  updateProduct: function(productId, options){
    if (typeof options.initialPrice != 'undefined') {
      options.initialPrice = parseFloat(options.initialPrice);
      if (options.initialPrice==="NaN"){
        throw new Meteor.Error(413, "Not a number")
      }
      check(options.initialPrice, Number);
    }
    if (typeof options.fundNeeded != 'undefined') {
      options.initialPrice = parseFloat(options.fundNeeded);
      if (options.fundPrice==="NaN"){
        throw new Meteor.Error(413, "Not a number")
      }
      check(options.fundNeeded, Number);
    }
    if (typeof options.daysNeeded != 'undefined') {
      options.initialPrice = parseFloat(options.daysNeeded);
      if (options.daysPrice==="NaN"){
        throw new Meteor.Error(413, "Not a number")
      }
      check(options.daysNeeded, Number);
    }
    var userId = Meteor.userId();
    var product = Products.findOne(productId);
    if (userId !== product.creatorId){
      throw new Meteor.Error(413, "You are not authorized to change the content");
    }
    Products.update(productId, {
      $set: options
    });
  }
})
