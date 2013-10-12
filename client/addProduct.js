
Template.addProduct.events({
  "click #new-product-submit": function(evt){
    evt.preventDefault();
    var info = {
      name: $("#new-name-input").val(),
      minPrice: parseFloat($("#new-price-input").val()),
      fundNeeded: parseFloat($("#new-funding-input").val()),
      description: $("#new-desc-input").val(),
      fundRaised: 0,
      copiesSold: 0,
      daysNeeded: parseFloat($('#days-needed-input').val()),
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