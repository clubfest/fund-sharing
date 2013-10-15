
Template.profile.purchases = function(){
  var user = Meteor.user();
  if (!user) return ;
  var purchases = Purchases.find({userId: user._id}).fetch();
  var products = Products.find().fetch();
  var totalRefund = 0;
  for (var i=0; i<products.length; i++){
    for (var j=0; j<purchases.length; j++){
      if (purchases[j].productId == products[i]._id){
        var product = products[i];
        var purchase = purchases[j];
        purchases[j].name = product.name;
        purchases[j].status = product.status;
        purchases[j].releaseDate = product.releaseDate;

        var donationsNeeded = product.fundNeeded - product.donations;
        if (product.status == "conceiving" && product.fundRaised > 0) {
          purchases[j].availableRefund = 0;
        } else {
          // var share = purchase.possibleRefund / product.fundNeeded;
          // Math.floor(purchase.possibleRefund - donationsNeeded * share - purchase.claimedRefund);
          var paidShare = purchase.paid / product.fundNeeded;
          var deservedRefund = Math.floor(purchase.paid - donationsNeeded * paidShare - purchase.claimedRefund);
          purchases[j].availableRefund = Math.min(deservedRefund, purchase.possibleRefund);
          
          totalRefund += purchases[j].availableRefund
        }
      }
    }
  }
  Session.set('totalRefund', totalRefund);
  return purchases;
}


Template.profile.totalRefund = function(){
  return Session.get('totalRefund');
}

Template.profile.projects = function(){
  var projects = Products.find({creatorId: Meteor.userId()});
  if (projects.length > 0){
    Session.set('hasProjects', true);
  } else {
    Session.set('hasProjects', false);
  }
  return projects;
}

Template.profile.hasProjects = function(){
  return true//Session.get('hasProjects')
}

Template.profile.money = function(){
  return Meteor.user().fundSharing.money
}

Template.profile.events({
  'click .donate-icon': function(evt){
    var purchaseId = evt.currentTarget.dataset.purchaseId;
    var purchase = Purchases.findOne(purchaseId);
    var amount = prompt("Amount to donate ($)")    
    if (!amount) return ;
    amount = parseFloat(amount);
    if (isNaN(amount)){
      alert("Invalid input");
      return ;
    } else if (amount<=0){
      alert("Thanks for nothing");
      return ;
    }
    options = {
      purchaseId: purchaseId,
      amount: amount,
    };

    Meteor.call('donate', options, function(err){
      if (err) alert(err.reason);
    });
  },
  'click #refund-btn': function(){
    if (Session.get('totalRefund') < 1) {
      alert('The current amount is too small to be refunded.');
      return ;
    }
    var ans = confirm("Are you sure?");
    if (!ans) return;

    // zero out all availableRefund and reduce out all possibleRefund
    Meteor.call("refundAll", function(err){
      if (err) alert(err.reason);
    });
  },
  'click .notify-icon': function(){
    alert('not implemened');
  },
  'click .release-button': function(evt){
    var productId = evt.currentTarget.dataset.productId;
    var status = 'shipping';
    var product = Products.findOne(productId);
    if (product.fundNeeded <= product.donations){
      var status = 'giving';
    }
    Meteor.call('updateProduct', productId, {status: status});
  }
})


