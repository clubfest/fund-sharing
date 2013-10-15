
Meteor.methods({
  'donate': function(options){
    var userId = checkLogin();
    var purchase = Purchases.findOne({_id: options.purchaseId, userId: userId});
    if (!purchase) throw new Meteor.Error(413, 'invalid purchase info');
    var product = Products.findOne(purchase.productId);
    // Update the person's donation details
    var newAmount = {
      donations: purchase.donations + options.amount,
      possibleRefund: purchase.possibleRefund - options.amount,
    };
    if (purchase.possibleRefund < options.amount){
      newAmount.possibleRefund = 0;
    }
    Purchases.update({_id: options.purchaseId, userId: userId}, {
      $set: newAmount
    });
    // Update the price
    var totalDonations = product.donations + options.amount;
    Products.update(product._id, {
      $set: {
        donations: totalDonations,
        price: Math.ceil((product.fundNeeded - totalDonations)/product.numCopiesSold),
      }
    });
  },
})