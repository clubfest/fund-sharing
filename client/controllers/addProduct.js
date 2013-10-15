
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