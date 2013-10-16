
Meteor.publish('currentUser', function(){
  return Meteor.users.find({_id: this.userId},{
    fields: {
      _id: 1,
      money: 1,
      "profile.name": 1,
      "services.facebook.email": 1,
      "services.facebook.accessToken": 1,
    }
  })
});