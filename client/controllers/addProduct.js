
Template.addProduct.events({
  "click #new-product-submit": function(evt){
    evt.preventDefault();
    var creatorId = Meteor.userId();
    if (!creatorId){
      alert("Please sign in first");
      return ;
    }
    var name = $("#new-name-input").val();
    var fundNeeded = parseFloat($("#new-funding-input").val());
    var daysNeeded = parseFloat($('#days-needed-input').val());
    var initialPrice = parseFloat($("#new-price-input").val());

    if (isNaN(initialPrice) || isNaN(fundNeeded) || isNaN(daysNeeded)){
      throw new Meteor.Error(413, "Please input numbers"); 
    }

    Meteor.call("addProduct", name, fundNeeded, daysNeeded, initialPrice, function(err){
      if (err) {
        alert(err.reason);
      } else {
        Meteor.Router.to("/purchase/"+name);
      }
    })
  }
})