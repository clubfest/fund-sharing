Purchases = new Meteor.Collection('purchases');

Meteor.methods({
  savePledge: function(name, support, userEmail){
    //validate
    var userId = checkLogin();
    if (!support) support = 0;
    check(support, Number);
    var product = Products.findOne({name: name});
    if (!product) throw new Meteor.Error("Can't find product with the given id");

    // If funding goal is reached
    var info = {};
    var paid = product.fairPrice + support;
    if (product.fundRaised + paid >= product.fundNeeded){
      info = transitionToBuilding(product);
      info.status = "building";
    }

    if (product.status != 'conceiving' || info.status == 'building'){
      info.fairPrice = computeFairPrice(product, paid);
      // info.nextPrice = computeNextPrice(product, paid);
    }
    // Update product
    Products.update(product._id, {
      $set: info,
      $inc: {
        numCopiesSold: 1,
        fundRaised: paid,
        currentFund: paid,
      },
      $push: { orders: {
        userId: userId,
        email: userEmail,
        paid: paid,
      }}
    });

    // Create purchase
    Purchases.insert({
      productId: product._id,
      userId: userId,
      paid: paid,
      possibleRefund: paid,
      email: userEmail,
      claimedRefund: 0,
      donations: 0,
      createdAt: new Date(),
    });

    // Change balance
    Meteor.users.update(userId, {
      $inc: {money: -paid}
    });
  },
});

function transitionToBuilding(product){
  var info = {}
  info.releaseDate = new Date();
  info.releaseDate.setDate(info.releaseDate.getDate()+product.daysNeeded);
  emailAboutBuilding(product, info.releaseDate);
  return info;
}

function emailAboutBuilding(product, releaseDate){
  Meteor.call('sendToMailingList', 
    nameSpaced(product.name)+'@funding.a.meteor.com', 
    product.creatorEmail, 
    product.mailingList, 
    product.creatorEmail,
    product.name+" has reached its funding goal",
    "We will inform you when it is released. The estimated date is "+
    releaseDate.toString(), function(err){
      if (err) alert(err.reason);
    }
  );
}



// savePurchase: function(options){
//     var userId = checkLogin();
//     if (!options.support) {
//       options.support = 0;
//     }
//     check(options.support, Number);
//     var product = Products.findOne({name: options.name});
//     var paid = product.initialPrice + options.support;
//     var status = product.status;
    
//     var releaseDate = product.releaseDate;
//     var mailingList = [];
    
//     if (status=="conceiving" &&
//         product.fundRaised + paid >= product.fundNeeded){
//       status = 'building';
//       releaseDate = new Date();
//       releaseDate.setDate(releaseDate.getDate()+product.daysNeeded);
//       // TODO: send notifications to every client and user
//       var creatorEmail = Meteor.users.findOne(product.creatorId).services.facebook.email;
//       for (var i=0; i<product.orders.length; i++){
//         mailingList.push(product.orders[i].email);
//       }
//       Meteor.call('sendToMailingList', nameSpaced(product.name)+'@funding.a.meteor.com', creatorEmail,
//         mailingList, creatorEmail, product.name + " has finished fund raising",
//         "We will let you know when it is finished. The estimated release date is "+releaseDate.toString()
//       );
//     } else if (status=="shipping" &&
//         product.donations >= product.fundNeeded){
//       status = "giving";
//       // TODO: send notifications to every user
//       var creatorEmail = Meteor.users.findOne(product.creatorId).services.facebook.email;
//       for (var i=0; i<product.orders.length; i++){
//         mailingList.push(product.orders[i].email);
//       }
//       Meteor.call('sendToMailingList', nameSpaced(product.name)+'@funding.a.meteor.com', creatorEmail,
//         mailingList, creatorEmail, product.name + " is now free",
//         "If you like this product, continue to support by donating."
//       );
//     }
//     // Possible decrease in price
//     // newPrice = Math.ceil((product.fundNeeded-product.donations)/(product.numCopiesSold+2));
//     // if (newPrice > product.price){
//     //   newPrice = product.price;
//     // }
//     var updateOptions = {
//       fundRaised: product.fundRaised + paid,
//       numCopiesSold: product.numCopiesSold + 1,
//       status: status,
//       // price: newPrice,
//       releaseDate: releaseDate,
//     }
//     // record the fund raised and record the clients' emails into the product
//     Products.update(product._id, {
//       $set: updateOptions,
//       $push: {
//         orders: {
//           userId: userId,
//           email: options.email,
//           paid: paid,
//         }
//       }
//     });
//     // record the purchase
//     Purchases.insert({
//       productId: product._id,
//       userId: userId,
//       paid: paid,
//       email: options.email,
//       claimedRefund: 0,
//       // possibleRefund: paid,
//       donations: 0,
//     });
//     // withdraw money from user
//     Meteor.users.update(userId, {
//       $inc: {money: -paid}
//     });
//   }