Meteor.startup(function(){
  if (Products.find().count()==0){
    Products.insert({
      name: "phone-guitar",
      initialPrice: 10,
      fundNeeded: 2000,
      numCopiesSold: 43,
      description: "<p>An app for playing music on your phone</p>"
    })
  }
})