Meteor.Router.add({
  '/': 'about',
  '/products': 'products',
  '/purchase/:name': function(name){
    Session.set("name", name);
    return "purchase";
  },
  '/addProduct': 'addProduct',

  '*': 'not_found'
});