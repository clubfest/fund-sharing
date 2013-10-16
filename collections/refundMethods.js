
Meteor.methods({
  'refund': function(purchaseId){
    var userId = checkLogin();
    var purchase = Purchases.findOne(purchaseId);
    if (purchase.userId !== userId){
      throw new Meteor.Error("This purchase does not belong to the current user.")
    }
    var product = Products.findOne(purchase.productId);
    // calculate available refund
    var donationsNeeded = product.fundNeeded - product.donations;
    // fundRaised is non-decreasing, when user obtains refund
    var leftOver = product.fundRaised - donationsNeeded;
    var availableRefund = Math.max(Math.floor(leftOver * purchase.paid / product.fundRaised - purchase.claimedRefund), 0);
    
    Meteor.users.update(userId, { $inc: {money: availableRefund} });
    Purchases.update(purchaseId, {$inc:{
      claimedRefund: availableRefund,
      possibleRefund: -availableRefund,
    }});
    Products.update(product._id, {$inc: {
      currentFund: -availableRefund
    }});
  },
})



// junk

// var availableRefund = leftOver * purchase.paid / product.fundRaised - purchase.claimedRefund;

// // TODO: don't refund all.
//   'refundAll': function(){
//     var user = Meteor.user();
//     if (!user) throw new Meteor.Error('Please sign in first.');
//     var purchases = Purchases.find({userId: user._id}).fetch();
//     var products = Products.find().fetch();
//     var totalRefund = 0;
//     for (var i=0; i<products.length; i++){
//       for (var j=0; j<purchases.length; j++){
//         if (purchases[j].productId == products[i]._id){
//           var product = products[i];
//           var purchase = purchases[j];
//           var donationsNeeded = product.fundNeeded - product.donations;
//           if (product.status == "conceiving" && product.fundRaised > 0) {
//             purchases[j].availableRefund = 0;
//           } else {
//             var paidShare = (purchase.paid - purchase.claimedRefund) / product.fundRaised;
//             var deservedRefund = Math.floor(purchase.paid - donationsNeeded * paidShare - purchase.claimedRefund);
//             purchases[j].availableRefund = Math.min(deservedRefund, purchase.possibleRefund);
//             totalRefund += purchases[j].availableRefund
//           }
//         }
//       }
//     }
//     console.log(purchases)
//     // Add money to user's account
//     Meteor.users.update(user, {
//       $inc: {
//         money: totalRefund,
//       }
//     });
//     // Update the fundRaised for that product
//     for (var i=0; i<products.length; i++){
//       Products.update(products[i]._id, {
        
//       })
//     }
//     for (var j=0; j<purchases.length; j++){      
//       Purchases.update(purchases[j]._id, {
//         $inc: {
//           claimedRefund: purchases[j].availableRefund,
//           possibleRefund: -purchases[j].availableRefund,
//         }
//       })
//     }
//   }