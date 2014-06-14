## About

This is an implementation of an idea to raise fund without a deadline (as supposed to KickStarter); I forgot where I read it.

The key is to refund early buyers evenly once the funding goal is reached and additional people continue to buy. For example, the the funding goal is $1000, and the price is $100, then after 10 persons pledged, then when the 11th person pledge, then the price should be lowered to $1000/11, which is roughly $91, so the first 10 people get $9 refund.

[Here is a Demo](http://fund.a.meteor.com)

## TODO

Add user interactions

Make it into a plug-in
* put the purchases inside the product
* store relevant product info in user.fundSharing to avoid sorting
* refactor conceiving, building, shipping and gifting

* How to hook user creation?
* TODO: use mailgun
