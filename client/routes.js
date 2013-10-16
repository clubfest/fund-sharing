Meteor.Router.add({
  '/': 'about',
  '/products': 'products',
  '/purchase/:name': function(name){
    Session.set("name", name);
    return "purchase"
  },
  '/donate/:name': function(name){
    Session.set('name', name);
    return 'donate';
  },
  '/addProduct': 'addProduct',
  '/profile': 'profile',
  '*': 'not_found'
});