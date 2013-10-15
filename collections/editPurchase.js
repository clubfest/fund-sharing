Purchases = new Meteor.Collection('purchases');

Meteor.methods({
  savePurchase: function(options){
    var userId = checkLogin();
    if (!options.support) {
      options.support = 0;
    }
    check(options.support, Number);
    var product = Products.findOne({name: options.name});
    var paid = product.price + options.support;
    var status = product.status;
    
    var releaseDate = product.releaseDate;
    if (status=="conceiving" &&
        product.fundRaised + paid >= product.fundNeeded){
      status = 'building';
      releaseDate = new Date();
      releaseDate += releaseDate.setDate(releaseDate.getDate()+product.daysNeeded);
      // TODO: send notifications to every client and user
    } else if (status=="shipping" &&
        product.donations >= product.fundNeeded){
      status = "giving";
      // TODO: send notifications to every user
    }
    // Possible decrease in price
    newPrice = Math.ceil((product.fundNeeded-product.donations)/(product.numCopiesSold+2));
    if (newPrice > product.price){
      newPrice = product.price;
    }
    var updateOptions = {
      fundRaised: product.fundRaised + paid,
      numCopiesSold: product.numCopiesSold + 1,
      status: status,
      price: newPrice,
      releaseDate: releaseDate,
    }
    // record the fund raised and record the clients' emails into the product
    Products.update(product._id, {
      $set: updateOptions,
      $push: {
        orders: {
          userId: userId,
          email: options.email,
          paid: paid,
        }
      }
    });
    // record the purchase
    Purchases.insert({
      productId: product._id,
      userId: userId,
      paid: paid,
      email: options.email,
      claimedRefund: 0,
      possibleRefund: paid,
      donations: 0,
    });
    // withdraw money from user
    Meteor.users.update(userId, {
      $inc: {"fundSharing.money": -paid}
    });
  }
});