Meteor.startup(function(){
  if (Products.find().count()==0){
    Products.insert({
      name: "phone-guitar",
      minPrice: 10,
      fundingNeeded: 2000,
      numCustomers: 43
    })
  }
})