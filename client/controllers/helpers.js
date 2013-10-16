

////// User
Handlebars.registerHelper("isAdmin", function(){
  return Session.get("isAdmin");
});

Handlebars.registerHelper("email", function(){
  var user = Meteor.user();
  if (user) return user.services.facebook.email;
})

///// status
Handlebars.registerHelper('isConceiving', function(status, options){
  if (status=="conceiving") return options.fn(this);
});
Handlebars.registerHelper('isBuilding', function(status, options){
  if (status=="building") return options.fn(this);
});
Handlebars.registerHelper('isShipping', function(status, options){
  if (status=="shipping") return options.fn(this);
});
Handlebars.registerHelper('isGiving', function(status, options){
  if (status=="giving") return options.fn(this);
});

///// Product
Handlebars.registerHelper('product', function(){
  var info = Products.findOne({name: Session.get("name")});
  if (!info) return ;
  Session.set('donated', info.donations);
  Session.set('raised', info.fundRaised);
  Session.set('needed', info.fundNeeded);
  Session.set('creatorId', info.creatorId);
  Session.set('productId', info._id);
  Session.set('isAdmin', Meteor.userId() === Session.get('creatorId'));
  Session.set('status', info.status);
  return info;
});



//// Date
Handlebars.registerHelper('dateAbbrev', function(date){
  return dateAbbrev(date);
})
