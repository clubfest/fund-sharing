

////// User
Handlebars.registerHelper("isAdmin", function(){
  return Session.get("isAdmin");
});

Handlebars.registerHelper("email", function(){
  return Meteor.user().emails[0].address;
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
  if (!date) return 'T.B.A.';
  date = date.split(" ");
  var ret = date[1] + ' ' + date[2] 
  if ((new Date()).getFullYear() !== parseInt(date[3])){
    ret += ', ' + date[3];
  }
  return ret;
})
