
checkLogin = function(message){
  if (!message) message = "Please sign in first";
  var userId = Meteor.userId();
  if (!userId){
    throw new Meteor.Error(413, message);
  }
  return userId;
}

dateAbbrev = function(date){
  if (!date) return 'T.B.A.';
  date = date.split(" ");
  var ret = date[1] + ' ' + date[2] 
  if ((new Date()).getFullYear() !== parseInt(date[3])){
    ret += ', ' + date[3];
  }
  return ret;
}

nameAbbrev = function(name, len){
  len = len || 30;
  if (name.length > len){
    name = name.substring(0, len) + '..';
  }
  return name;
}

nameSpaced = function(name){
  name = name.split(" ");
  name = name.join('.');
  return name;
}