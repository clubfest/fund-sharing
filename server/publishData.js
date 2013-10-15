
Meteor.publish('currentUser', function(){
  return Meteor.users.find({_id: this.userId},{
    fields: {
      _id: 1,
      fundSharing: 1,
    }
  })
});