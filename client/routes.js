Meteor.Router.add({
  '/': 'about',
  '/products': 'products',
  '/purchase/:name': function(name){
    Session.set("name", name);
    var info = Products.findOne({name: Session.get("name")});
    if (info.status=='conceiving'){
      return "purchase";
    } else if (1) {
      return "donate"
    }
  },
  '/addProduct': 'addProduct',
  '/profile': 'profile',
  '*': 'not_found'
});