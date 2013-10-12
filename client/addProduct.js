
Template.addProduct.events({
  "click #new-product-submit": function(evt){
    evt.preventDefault();
    var creatorId = Meteor.userId();
    if (!creatorId){
      alert("Please sign in first");
      return ;
    }
    var info = {
      name: $("#new-name-input").val(),
      initialPrice: parseFloat($("#new-price-input").val()),
      fundNeeded: parseFloat($("#new-funding-input").val()),
      description: $("#new-desc-input").val(),
      fundRaised: 0,
      numCopiesSold: 0,
      daysNeeded: parseFloat($('#days-needed-input').val()),
      creatorId: creatorId,
    }
    Meteor.call("addProduct", info, function(err){
      if (err) {
        alert(err.reason);
      } else {
        Meteor.Router.to("/purchase/"+info.name);
      }
    })
  }
})