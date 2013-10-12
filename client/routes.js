Meteor.Router.add({
  '/': 'about',

  '/products': 'products',

  '*': 'not_found'
});