Products = new Meteor.Collection("products");

function checkLogin(message){
  if (!message) message = "Please sign in first";
  var userId = Meteor.userId();
  if (!userId){
    throw new Meteor.Error(413, message);
  }
  return userId;
}
Meteor.methods({
  savePurchase: function(options){
    var userId = checkLogin();
    check(options.support, Number);
    var product = Products.findOne({name: options.name});
    var paid = product.price + options.support;
    var status = product.status;
    if (status=="conceiving" &&
        product.fundRaised + paid >= product.fundNeeded){
      status = 'building';
    }
    if (status=="shipping" &&
        product.donations >= product.fundNeeded){
      status = "giving";
    }
    newPrice = Math.ceil((product.fundNeeded-product.donations)/(product.numCopiesSold+1));
    if (newPrice < product.price){
      product.price = newPrice
    }
    var updateOptions = {
      fundRaised: product.fundRaised + paid,
      numCopiesSold: product.numCopiesSold + 1,
      status: status,
      price: newPrice,
    }
    Products.update({name: options.name}, {
      $set: updateOptions,
      $push: {
        orders: {
          userId: userId,
          email: options.email,
          paid: paid,
        }
      }
    });
    Meteor.users.update(userId, {
      $inc: {
        "fundSharing.money": -paid
      },
      $push: {
        'fundSharing.orders': {
          paid: paid,
          email: options.email,
          refunded: 0,
        }
      }
    });
  },
  addProduct: function(options){
    var userId = checkLogin();
    check(options.initialPrice, Number);
    check(options.fundNeeded, Number);
    check(options.daysNeeded, Number);
    
    options.price = options.initialPrice;
    options.donations = 0;

    if (options.name == 0){
      throw new Meteor.Error(413, "Please provide a name")
    }
    if (Products.findOne({name: options.name})){
      throw new Meteor.Error(413, "Please pick another name, as this name as been taken.");
    }
    Products.insert(options);
  },
  updateProduct: function(productId, options){
    if (typeof options.initialPrice != 'undefined') {
      options.initialPrice = parseFloat(options.initialPrice);
      if (options.initialPrice==="NaN"){
        throw new Meteor.Error(413, "Not a number")
      }
      check(options.initialPrice, Number);
      options.price = options.initialPrice;
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
    var userId = checkLogin("Not authorized");
    var product = Products.findOne(productId);
    Products.update(productId, {
      $set: options
    });
  }
})
