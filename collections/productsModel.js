Products = new Meteor.Collection("products");

Meteor.methods({
  addProduct: function(options){
    // Validation
    var userId = checkLogin();
    check(options.initialPrice, Number);
    check(options.fundNeeded, Number);
    check(options.daysNeeded, Number);
    if (options.name == 0){
      throw new Meteor.Error(413, "Please provide a name")
    }
    if (Products.findOne({name: options.name})){
      throw new Meteor.Error(413, "Please pick another name, as this name as been taken.");
    }

    // additional info
    options.price = options.initialPrice;
    options.donations = 0;
    options.numCopiesSold= 0;
    options.fundRaised = 0;
    options.creatorId = userId;
    options.status = "conceiving";
    
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
