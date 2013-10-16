Products = new Meteor.Collection("products");

Meteor.methods({
  addProduct: function(name, fundNeeded, daysNeeded, initialPrice){
    // Check login
    var userId = checkLogin();
    var creator = Meteor.user();
    // validate
    validateName(name);
    validateFundNeeded(fundNeeded);
    validateDaysNeeded(daysNeeded);
    validateInitialPrice(initialPrice);
    // insert
    Products.insert({name: name,
      initialPrice: initialPrice,
      fairPrice: initialPrice,
      // nextPrice: initialPrice,
      daysNeeded: daysNeeded,
      fundNeeded: fundNeeded,
      currentFund: 0,
      fundRaised: 0, donations: 0,
      numCopiesSold: 0, status: 'conceiving',
      createdAt: new Date(), creatorId: userId,
      creatorName: creator.profile.name,
      creatorEmail: creator.services.facebook.email,
    });
  },
  updateName: function(productId, name){
    validateName(name);
    Products.update(productId, {$set: {name: name}});
  },
  updateDescription: function(productId, description){
    check(description, String);
    Products.update(productId, {$set: {description: description}});
  },
  updateFundNeeded: function(productId, fund){
    validateFundNeeded(fund);
    Products.update(productId, {$set: {fundNeeded: fund}});
  },
  updateDaysNeeded: function(productId, daysNeeded){
    validateDaysNeeded(daysNeeded);
    Products.update(productId, {$set: {daysNeeded: daysNeeded}});
  },
  updateInitialPrice: function(productId, price){
    validateInitialPrice(price);
    Products.update(productId, {$set: {
      initialPrice: price,
      fairPrice: price,
      nextPrice: price,
    }});
  },
})


function validateName(name){
  // Check name
  check(name, String);
  if (name.length == 0){
    throw new Meteor.Error(413, "Please provide a name")
  }
  if (Products.findOne({name: name})){
    throw new Meteor.Error(413, "Please pick another name, as this name has been taken.");
  }
}
function validateFundNeeded(fundNeeded){
  check(fundNeeded, Number);
  if (fundNeeded<0){
    throw new Meteor.Error(413, "Negative quantities are not allowed.")
  }
}
function validateDaysNeeded(daysNeeded){
  check(daysNeeded, Number);
  if (daysNeeded<0){
    throw new Meteor.Error(413, "Negative quantities are not allowed.")
  }
}
function validateInitialPrice(initialPrice){
  check(initialPrice, Number);
  if (initialPrice < 0) {
    throw new Meteor.Error(413, "Negative quantities are not allowed.")
  }
}
