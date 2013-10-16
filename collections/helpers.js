
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
  var current = new Date();
  var year = date.getFullYear();
  var month = date.getMonth()+1;
  var day = date.getDate();
  var ret = month+'/'+day;
  if (year!==current.getFullYear()){
    ret += '/'+year
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