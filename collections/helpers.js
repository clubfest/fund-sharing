
checkLogin = function(message){
  if (!message) message = "Please sign in first";
  var userId = Meteor.userId();
  if (!userId){
    throw new Meteor.Error(413, message);
  }
  return userId;
}