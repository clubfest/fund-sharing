
Meteor.methods({
  'refundAll': function(){
    var user = Meteor.user();
    if (!user) throw new Meteor.Error('Please sign in first.');
    var purchases = Purchases.find({userId: user._id}).fetch();
    var products = Products.find().fetch();
    var totalRefund = 0;
    for (var i=0; i<products.length; i++){
      for (var j=0; j<purchases.length; j++){
        if (purchases[j].productId == products[i]._id){
          var product = products[i];
          var purchase = purchases[j];
          var donationsNeeded = product.fundNeeded - product.donations;
          if (product.status == "conceiving" && product.fundRaised > 0) {
            purchases[j].availableRefund = 0;
          } else {                    
            var paidShare = purchase.paid / product.fundNeeded;
            var deservedRefund = Math.floor(purchase.paid - donationsNeeded * paidShare - purchase.claimedRefund);
            purchases[j].availableRefund = Math.min(deservedRefund, purchase.possibleRefund);
            totalRefund += purchases[j].availableRefund
          }
        }
      }
    }
    // Add money to user's account
    Meteor.users.update(user, {
      $inc: {
        "fundSharing.money": totalRefund,
      }
    });
    for (var j=0; j<purchases.length; j++){      
      Purchases.update(purchases[j]._id, {
        $inc: {
          claimedRefund: purchases[j].availableRefund,
          possibleRefund: -purchases[j].availableRefund,
        }
      })
    }
  }
})