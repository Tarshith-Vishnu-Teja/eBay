
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , session = require('client-sessions');

var app = express();

app.use(session({   
	  
	cookieName: 'session',    
	secret: 'ebay_test',    
	duration: 30 * 60 * 1000,    //setting the time for active session
	activeDuration: 5 * 60 * 1000,  

}));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/home', user.loadHome);
app.get('/profile', user.loadProfile);
app.get('/shoppingCart', user.shoppingCart);
app.get('/logOut', user.logOut);
app.get('/checkOut', user.checkOut);

app.post('/signInRequest', user.signInRequest);
app.post('/signUpRequest', user.signUpRequest);
app.post('/getDetails', user.getDetails);
app.post('/sellItem', user.sellItem);
app.post('/getAds', user.getAds);
app.post('/getMySellingItems', user.getMySellingItems);
app.post('/addToCart', user.addToCart);
app.post('/getItemsInCart', user.getItemsInCart);
app.post('/removeItemFromCart', user.removeItemFromCart);
app.post('/validate', user.validate);
app.post('/buyItem', user.buyItem);
app.post('/showMyPurchases', user.showMyPurchases);
app.post('/showMySales', user.showMySales);
app.post("/placeBid", user.placeBid);
app.post('/getBidders', user.getBidders);
app.post('/showMyBids', user.showMyBids);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
