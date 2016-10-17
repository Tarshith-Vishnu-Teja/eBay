
/*
 * GET users listing.
 */
var mysql = require('./mysql');
var ejs = require("ejs");
var cryptoJS = require("crypto-js");
var hashPW = require('./hashPW');
var fileSystem = require('file-system');

//---------------------------------------------------INITIAL SIGN IN AND REGISTER REQUESTS-----------------------------

exports.signInRequest = function(req, res){
	var loginEmail = req.body.jsonDetails.loginEmail;
	var loginPassword = req.body.jsonDetails.loginPassword;
	var date = new Date();
	loginPassword = hashPW.encryptPW(loginPassword);

	var getUser = "select * from users where email_id = '" + loginEmail + "' and password = '" + loginPassword + "'";
	mysql.run_aQuery(getUser, function(err, results) {
        if (err) {
            throw err;
        } else {
            if (results.length > 0) {
                console.log("valid Login");
                console.log(results[0].last_logged_in);
                
                fileSystem.appendFile('public/myLogs/myLogs.txt', 'Logged In at ' + date + ' As: ' + loginEmail + '\n\n', function(err){
                	console.log("Failed to Write into File!");
                });
                req.session.email_id = loginEmail;	//------Session Initiated on Login Success-----
                req.session.cart = [];
                req.session.totalPrice = 0;
                res.send({
            		"status" : "validLogin",
            		"statusCode" : "200"
            	});
            } else {
                console.log("Invalid Login");
                res.send({
            		"status" : "403"
            	});
            }
        }
    });   
};

exports.signUpRequest = function(req, res){
    var date = new Date();
	
	var firstname = req.body.jsonDetails.firstname;
	var lastname = req.body.jsonDetails.lastname;
	var dateOfBirth = req.body.jsonDetails.dateOfBirth;
	var registerEmail = req.body.jsonDetails.registerEmail
	var registerPassword = req.body.jsonDetails.registerPassword;
	var reenterRegisterEmail = req.body.jsonDetails.reenterRegisterEmail;
	var phoneNumber = req.body.jsonDetails.phoneNumber;
	var location = req.body.jsonDetails.location;
	
	//Checking If the User Already Exists or Not
	var getUser = "select * from users where email_id = '" + registerEmail + "'";
	mysql.run_aQuery(getUser, function(err, results) {
        if (err) {
            throw err;
        } else {
            if (results.length > 0) {
                fileSystem.appendFile('public/myLogs/myLogs.txt', 'Existing User ' + registerEmail + ' tried to Sign Up at: ' + date + '\n\n', function(err){
                    console.log("Failed to Write into File!");
                });
                console.log("Already Exists");
                res.send({
            		"loginStatus" : "alreadyExists",
            		"statusCode": 403
            	});
            } else {												//If User Does Not Exist, Create a New User
                console.log("New Entry");
                encryptedPW = hashPW.encryptPW(registerPassword);
                var insertUser = 'insert into ebay.users (firstname, lastname, email_id, password, phoneNumber, dateOfBirth, location) values ("' + firstname + '", "' + lastname + '", "' + registerEmail + '", "' + encryptedPW + '", "' + phoneNumber + '", "' + dateOfBirth + '", "' + location + '")';
                mysql.run_aQuery(insertUser, function(err,res){
          		  if(err) throw err;
          		  //console.log('Last insert ID:', res);
          		});
                fileSystem.appendFile('public/myLogs/myLogs.txt', 'New User ' + registerEmail + ' Signed Up at: ' + date + '\n\n', function(err){
                    console.log("Failed to Write into File!");
                });
                res.send({
            		"loginStatus" : "newEntry",
            		"statusCode" : 200
            	});
            }
        }
    });	
};
//------------------------------------------------END OF INITIAL SIGN IN AND REGISTER REQUESTS-----------------------------



//--------------------------------------LOADING PAGES------------------------------------

exports.loadHome = function(req, res){
    var date = new Date();
	if(req.session.email_id){
        fileSystem.appendFile('public/myLogs/myLogs.txt', '' + req.session.email_id + ' Requested Home Page at ' + date + '\n\n', function(err){
            console.log("Failed to Write into File!");
        });
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('userHome');
	}
	else res.render('signUp', { title: 'Ebay Sign Up' });
};

exports.loadProfile = function(req, res){
    var date = new Date();
	if(req.session.email_id){
        fileSystem.appendFile('public/myLogs/myLogs.txt', '' + req.session.email_id + ' Requested Profile Page at ' + date + '\n\n', function(err){
            console.log("Failed to Write into File!");
        });
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('userProfile');	           
	}
	else res.render('signUp', { title: 'Ebay Sign Up' });
};

exports.shoppingCart = function(req, res){
    var date = new Date();
	if(req.session.email_id){
        fileSystem.appendFile('public/myLogs/myLogs.txt', '' + req.session.email_id + ' Requested Shopping Cart Page at ' + date + '\n\n', function(err){
            console.log("Failed to Write into File!");
        });
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('shoppingCart');
	}
	else res.render('signUp', { title: 'Ebay Sign Up' });
};

exports.checkOut = function(req, res){
    var date = new Date();
    if(req.session.email_id){
        fileSystem.appendFile('public/myLogs/myLogs.txt', '' + req.session.email_id + ' Requested Check Out Page at ' + date + '\n\n', function(err){
            console.log("Failed to Write into File!");
        });
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
       res.render('creditCardValidation');	
    }
    else res.render('signUp', { title: 'Ebay Sign Up' });
}

//-----------------------------------END OF LOADING PAGES-------------------------------------

//-----------------------------------------GET DETAILS FOR PAGES-------------------------------
exports.getDetails = function(req, res){
    var date = new Date();
    var getDetailsQuery = "SELECT * FROM ebay.users where email_id = '" + req.session.email_id+ "'";
    mysql.run_aQuery(getDetailsQuery, function(err, results) {
        if (err) {
            throw err;
        } else {
            if (results.length > 0) {
                console.log("location = " + results[0].location);
                res.send({ 
                    "statusCode" : 200,
                    "firstname" : results[0].firstname,
                    "dateOfBirth" : results[0].dateOfBirth,
                    "phoneNumber" : results[0].phoneNumber,
                    "location" : results[0].location,
                    "rows" : results,
                    "totalPrice" : req.session.totalPrice
                });
            }
            else {
                res.send({
                    "statusCode" : 403,
                    "error" : "Empty DB Response"
                })
                console.log("response from DB Empty");
            }
        }
    });
}

exports.getAds = function(req, res){
    var date = new Date();
	var date = new Date();
    var getAdsQuery = "SELECT product_id, dateOfBirth, item_name, item_description, type_of_price_tag, duration, item_price, item_quantity, sell_product.email_id, firstname, phoneNumber, location FROM ebay.sell_product, ebay.users where sell_product.email_id != '" + req.session.email_id+ "' and sell_product.email_id = users.email_id";
    mysql.run_aQuery(getAdsQuery, function(err, results) {
        if (err) {
            throw err;
        } else {
            if (results.length > 0) {
                fileSystem.appendFile('public/myLogs/myLogs.txt', 'Loaded All the Ads for ' + req.session.email_id + '\n\n', function(err){
                    console.log("Failed to Write into File!");
                });
                var updateLastLoginTimeQuery = "UPDATE ebay.users set last_logged_in = '" + date + "' WHERE email_id = '" + req.session.email_id + "'";
                mysql.run_aQuery(updateLastLoginTimeQuery, function(err, results) {
                    if (err) {
                        throw err;
                    } 
                    else 
                        console.log("Last Log In details Updation Successfull");
                });
                res.send({ 
                    "statusCode" : 200,
                    "rows" : results
                });
            }
            else {
                res.send({
                    "statusCode" : 403,
                    "error" : "Empty DB Response"
                })
                console.log("response from DB Empty");
            }
        }
    });
};

exports.getMySellingItems = function(req, res){
    var date = new Date();
	var getMySellingItemsQuery = "SELECT product_id, dateOfBirth, item_name, item_description, type_of_price_tag, duration, item_price, item_quantity, sell_product.email_id, firstname, lastname, phoneNumber, location FROM ebay.sell_product, ebay.users where sell_product.email_id = '" + req.session.email_id+ "' and sell_product.email_id = users.email_id";
	mysql.run_aQuery(getMySellingItemsQuery, function(err, results) {
        if (err) {
            throw err;
        } else {
            if (results.length > 0) {
                fileSystem.appendFile('public/myLogs/myLogs.txt', '' + req.session.email_id + ' Clicked Button ID: View My Advertisements at ' + date + '\n\n', function(err){
                    console.log("Failed to Write into File!");
                });
            	res.send({ 
            		"statusCode" : 200,
            		"firstname" : results[0].firstname,
            		"dateOfBirth" : results[0].dateOfBirth,
            		"phoneNumber" : results[0].phoneNumber,
            		"location" : results[0].location,
            		"rows" : results
            	});
            }
            else {
            	res.send({
                    "statusCode" : 403,
                    "error" : "Empty DB Response"
                })
            	console.log("response from DB Empty");
            }
        }
	});
}

exports.getItemsInCart = function(req, res){
    var date = new Date();
    fileSystem.appendFile('public/myLogs/myLogs.txt', '' + req.session.email_id + ' Requested for Items In Cart at ' + date +'\n\n', function(err){
        console.log("Failed to Write into File!");
    });
    res.send({
        "statusCode" : 200,
        "itemsInCart" : req.session.cart,
        "totalPriceOfItemsInCart" : req.session.totalPrice
    })
};

exports.getBidders = function(req, res){
    var date = new Date();
    var typeOfPriceTag = req.body.typeOfPriceTag;
    var productId = req.body.productId;

    var getBiddersQuery = "SELECT buyer_email, total_priceOfThisItem FROM ebay.buy_product WHERE product_id = '" + productId + "'";
    mysql.run_aQuery(getBiddersQuery, function(err, results) {
        if (err) {
            throw err;
        } else {
            if (results.length > 0) {
                fileSystem.appendFile('public/myLogs/myLogs.txt', '' + req.session.email_id + ' Clicked on link ID: AllBids and Requested List of Bidders for Product ID: ' + productId + ' at ' + date + '\n\n', function(err){
                    console.log("Failed to Write into File!");
                });
                res.send({ 
                    "statusCode" : 200,
                    "bidders" : results
                });
            }
            else {
                res.send({
                    "statusCode" : 403,
                    "error" : "No Bidders Yet!"
                })
                console.log("response from DB Empty");
            }
        }
    });
}

exports.showMyPurchases = function(req, res){
    var date = new Date();
    var showMyPurchasesQuery = "SELECT bill_id, item_name, quantity_bought, seller_email_id, firstname, buyer_email, product_id, total_priceOfThisItem FROM ebay.buy_product, ebay.users where users.email_id = buy_product.buyer_email and buyer_email = '" + req.session.email_id + "'  and buy_product.type_of_price_tag = 'F'";
    mysql.run_aQuery(showMyPurchasesQuery, function(err, results){
        if (err) {
            throw err;
        } else {
            if (results.length > 0) {
                fileSystem.appendFile('public/myLogs/myLogs.txt', '' + req.session.email_id + ' Clicked Button ID: ViewMyPurchases at ' + date + '\n\n', function(err){
                    console.log("Failed to Write into File!");
                });
                res.send({ 
                    "statusCode" : 200,
                    "myPurchases" : results
                });
            }
            else {
                res.send({
                    "statusCode" : 403,
                    "error" : "Empty DB Response"
                })
                console.log("response from DB Empty");
            }
        }
    })
};

exports.showMyBids = function(req, res){
    var date = new Date();
    var showMyBidsQuery = "SELECT bill_id, item_name, quantity_bought, seller_email_id, firstname, buyer_email, product_id, total_priceOfThisItem FROM ebay.buy_product, ebay.users where users.email_id = buy_product.buyer_email and buyer_email = '" + req.session.email_id + "'  and buy_product.type_of_price_tag = 'A'";
    mysql.run_aQuery(showMyBidsQuery, function(err, results){
        if (err) {
            throw err;
        } else {
            if (results.length > 0) {
                fileSystem.appendFile('public/myLogs/myLogs.txt', '' + req.session.email_id + ' Clicked Button ID: ViewMyBids at ' + date + '\n\n', function(err){
                    console.log("Failed to Write into File!");
                });
                console.log("showMyBids = " + JSON.stringify(results));
                res.send({ 
                    "statusCode" : 200,
                    "myBids" : results
                });
            }
            else {
                res.send({
                    "statusCode" : 403,
                    "error" : "Empty DB Response"
                })
                console.log("response from DB Empty");
            }
        }
    })
}

exports.showMySales = function(req, res){
    var date = new Date();
    var showMySalesQuery = "SELECT bill_id, item_name, quantity_bought, seller_email_id, firstname, buyer_email, product_id, total_priceOfThisItem FROM ebay.buy_product, ebay.users where users.email_id = buy_product.buyer_email and seller_email_id = '" + req.session.email_id + "'";
    mysql.run_aQuery(showMySalesQuery, function(err, results){
        if (err) {
            throw err;
        } else {
            if (results.length > 0) {
                fileSystem.appendFile('public/myLogs/myLogs.txt', '' + req.session.email_id + ' Clicked Button ID: ViewMySales at ' + date + '\n\n', function(err){
                    console.log("Failed to Write into File!");
                });
                res.send({ 
                    "statusCode" : 200,
                    "mySales" : results
                });
            }
            else {
                res.send({
                    "statusCode" : 403,
                    "error" : "Empty DB Response"
                })
                console.log("response from DB Empty");
            }
        }
    });
}
//-----------------------------------------END OF GET DETAILS FOR PAGES-------------------------------


//---------------------------------------------------SELL, ADD TO CART AND BUY---------------------------------
exports.sellItem = function(req, res){
    var date = new Date();
	var itemQuantity = req.body.itemQuantity;
	var itemName = req.body.itemName;
	var itemDescription = req.body.itemDescription;
	var durationFP = req.body.durationFP;
	var durationAP = req.body.durationAP;
    var timeFormat = req.body.timeFormat;
	
	if(req.body.PriceTagType == "F"){
		var fixedPrice = req.body.fixedPrice;
		
		var storeItemQuery = "INSERT INTO `ebay`.`sell_product` (`email_id`, `item_name`, `item_description`, `type_of_price_tag`, `duration`, `item_price`, `item_quantity`) VALUES ('" + req.session.email_id + "', '" + itemName + "', '" + itemDescription + "', '" + req.body.PriceTagType + "', '" + durationFP + "', '" + fixedPrice + "', '" + itemQuantity + "')";
		mysql.run_aQuery(storeItemQuery, function(err, results) {
	        if (err) {
	            throw err;
	        } else {
            	var getAllIMyItems = "SELECT product_id, item_name, item_description, type_of_price_tag, duration, item_price, item_quantity, sell_product.email_id, firstname, lastname, phoneNumber, location FROM ebay.sell_product, ebay.users where sell_product.email_id = '" + req.session.email_id+ "' and sell_product.email_id = users.email_id";
            	mysql.run_aQuery(getAllIMyItems, function(err, results) {
                    if (err) {
                        throw err;
                    } else {
                        if (results.length > 0) {
                            fileSystem.appendFile('public/myLogs/myLogs.txt', '' + req.session.email_id + ' Clicked Button ID: SellItem and ' + itemName + ' was put for sale for Fixed Price of ' + fixedPrice + ' at ' + date + '\n\n', function(err){
                                console.log("Failed to Write into File!");
                            });
                        	res.send({ 
                        		"statusCode" : 200,
                        		"rows" : results
                        	});
                        }
                        else {
                        	res.send({
                        		"statusCode" : 403,
                        		"error" : "Empty DB Response"
                        	})
                        	console.log("response from DB Empty");
                        }
                    }
            	});
	        }
		});
	}
	else if(req.body.PriceTagType == "A"){
		var auctionPrice = req.body.auctionPrice;
		var storeItemQuery = "INSERT INTO `ebay`.`sell_product` (`email_id`, `item_name`, `item_description`, `type_of_price_tag`, `duration`, `item_price`, `item_quantity`, `date_of_sale`, `available_till`) VALUES ('" + req.session.email_id + "', '" + itemName + "', '" + itemDescription + "', '" + req.body.PriceTagType + "', '" + durationAP + "', '" + auctionPrice + "', '" + itemQuantity + "', now(), DATE_ADD(date_of_sale, INTERVAL '" + durationAP + "' " + timeFormat + "))";
		mysql.run_aQuery(storeItemQuery, function(err, results) {
	        if (err) {
	            throw err;
	        } else {
	            if (results.length > 0) {
                    fileSystem.appendFile('public/myLogs/myLogs.txt', '' + req.session.email_id + ' Clicked Button ID: SellItem and ' + itemName + ' was put for sale for Auction Price of ' + auctionPrice + ' at ' + date + '\n\n', function(err){
                        console.log("Failed to Write into File!");
                    });
	            	res.send({"statusCode" : 403})
                    console.log("response from DB Empty");
	            }
	            else {
                    var getAllIMyItems = "SELECT product_id, item_name, item_description, type_of_price_tag, duration, item_price, item_quantity, sell_product.email_id, firstname, lastname, phoneNumber, location FROM ebay.sell_product, ebay.users where sell_product.email_id = '" + req.session.email_id+ "' and sell_product.email_id = users.email_id";
                    mysql.run_aQuery(getAllIMyItems, function(err, results) {
                        if (err) {
                            throw err;
                        } else {
                            if (results.length > 0) {
                                console.log("reached A");
                                res.send({ 
                                    "statusCode" : 200,
                                    "rows" : results
                                });
                            }
                            else {
                                res.send({
                                    "statusCode" : 403,
                                    "error" : "Empty DB Response"
                                })
                                console.log("response from DB Empty");
                            }
                        }
                    });
	            }
	        }
		});
	}
}

exports.addToCart = function(req, res){
    var date = new Date();
    var sellerFirstname = req.body.sellerFirstname;
    var sellerEmailId = req.body.sellerEmailId;
    var productId = req.body.productId;
    var itemName = req.body.itemName;
    var userItemQuantity = req.body.userItemQuantity;
    var totalAvailableQuantity = req.body.totalAvailableQuantity;
    var itemDescription = req.body.itemDescription;
    var itemPrice = req.body.itemPrice;
    var typeOfPriceTag = req.body.typeOfPriceTag;

    req.session.totalPrice += Number(userItemQuantity) * Number(itemPrice);
    console.log("sellerEmailId = " + sellerEmailId);

    fileSystem.appendFile('public/myLogs/myLogs.txt', '' + req.session.email_id + ' Clicked Button ID: addToCart and ' + itemName + ' with Product ID ' + productId + ' was added to cart at ' + date + '\n\n', function(err){
        console.log("Failed to Write into File!");
    });

    req.session.cart.push({
        "sellerFirstname" : sellerFirstname,
        "sellerEmailId" : sellerEmailId,
        "productId" : productId,
        "itemName" : itemName,
        "userItemQuantity" : userItemQuantity,
        "totalAvailableQuantity" : totalAvailableQuantity,
        "itemDescription" : itemDescription,
        "itemPrice" : itemPrice,
        "cartStatus" : "occupied"
    });
    res.send({
        "statusCode" : 200,
        "cart" : req.session.cart,
    })
}

exports.placeBid = function(req, res){
    var date = new Date();
    var sellerFirstname = req.body.sellerFirstname;
    var sellerEmailId = req.body.sellerEmailId;
    var productId = req.body.productId;
    var itemName = req.body.itemName;
    var userItemQuantity = req.body.userItemQuantity;
    var totalAvailableQuantity = req.body.totalAvailableQuantity;
    var itemDescription = req.body.itemDescription;
    var itemPrice = req.body.itemPrice;
    var typeOfPriceTag = req.body.typeOfPriceTag;
    var biddingPrice = req.body.biddingPrice;

    if(isNaN(userItemQuantity)){
    	console.log("User Quantity is not a number");
        res.send({
            "statusCode" : 402,
            "error" : "Enter all the Details Properly"
        })
    }
    else if(isNaN(biddingPrice)){
    	res.send({
    		 "statusCode" : 402,
             "error" : "Enter all the Details Properly"
    	})
    }
    else{
        console.log("biddingPrice = " + biddingPrice);
        var placeBidRequestQuery = "SELECT timediff(sell_product.available_till, now()) as timer, item_price FROM ebay.sell_product where product_id = '" + productId + "'";
        mysql.run_aQuery(placeBidRequestQuery, function(err, results) {
            if (err) {
                throw err;
            } else {
                if (results.length > 0) {
                    var timer = results[0].timer;                
                    if(!isNaN(Number(timer[0]))){
                        console.log("timer = " + results[0].timer);
                        if(Number(results[0].item_price) <= Number(biddingPrice)){
                            fileSystem.appendFile('public/myLogs/myLogs.txt', '' + req.session.email_id + ' Clicked Button ID: placeBid and ' + itemName + ' with Product ID ' + productId + ' was bidded for a Price of ' + biddingPrice + ' at ' + date + '\n\n', function(err){
                                console.log("Failed to Write into File!");
                            });
                            var updateItemPriceQuery = "UPDATE ebay.sell_product set item_price = '" + biddingPrice + "' WHERE product_id = '" + productId + "'";
                            mysql.run_aQuery(updateItemPriceQuery, function(err, results) {
                                if (err) {
                                    throw err;
                                } else {
                                    console.log("Updation Successfull");
                                }
                            });
                            var addItemToBuyTableQuery = "INSERT into ebay.buy_product (product_id, item_name, quantity_bought, buyer_email, seller_email_id, total_priceOfThisItem, type_of_price_tag) VALUES ('" + productId + "', '" + itemName + "', '" + userItemQuantity + "', '" + req.session.email_id + "', '" + sellerEmailId + "', '" + biddingPrice + "', '" + typeOfPriceTag + "')";
                            mysql.run_aQuery(addItemToBuyTableQuery, function(err, results) {
                                if (err) {
                                    throw err;
                                } else {
                                    console.log("Insertion Successfull");
                                    res.send({
                                        "statusCode" : 200,
                                        "timer" : timer
                                    })
                                }
                            });
                        }
                        else{
                            fileSystem.appendFile('public/myLogs/myLogs.txt', '' + req.session.email_id + ' Clicked Button ID: placeBid and ' + itemName + ' with Product ID ' + productId + ' and bid Failed at ' + date + '\n\n', function(err){
                                console.log("Failed to Write into File!");
                            });
                            res.send({
                                "statusCode" : 402,
                                "error" : "Place a Minimum Bid Value of " + itemPrice

                            })
                        }
                    }
                    else {
                        fileSystem.appendFile('public/myLogs/myLogs.txt', '' + req.session.email_id + ' Clicked Button ID: placeBid and ' + itemName + ' with Product ID ' + productId + ' and bid Failed at ' + date + '\n\n', function(err){
                            console.log("Failed to Write into File!");
                        });
                        res.send({
                            "statusCode" : 402,
                            "error" : "Time Up! Sorry You Can't Bid Anymore, better Luck Next Time!"
                        })
                    }
                }
                else {
                    res.send({
                        "statusCode" : 403,
                        "error" : "Empty DB Response"
                    })
                    console.log("response from DB Empty");
                }
            }
        });
    }
}

exports.removeItemFromCart = function(req,res){
    var date = new Date();
    var itemName = req.body.itemName;
    var userItemQuantity = req.body.userItemQuantity;
    var itemPrice = req.body.itemPrice;

    var i = 0;
    
    for (i = req.session.cart.length - 1; i >= 0; i--) {
        if (req.session.cart[i].itemName == itemName) {
            req.session.cart.splice(i, 1);
        }
    }
    req.session.totalPrice = req.session.totalPrice - (Number(userItemQuantity) * Number(itemPrice));
    fileSystem.appendFile('public/myLogs/myLogs.txt', '' + req.session.email_id + ' Clicked Button ID: removeItemFromCart and ' + itemName + ' and was removed from cart at ' + date + '\n\n', function(err){
        console.log("Failed to Write into File!");
    });
    res.send({
        "statusCode" : 200,
        "itemsInCart": req.session.cart,
        "totalPriceOfItemsInCart" : req.session.totalPrice
    });
}

exports.validate = function(req,res){
    var date = new Date();
    var ccNumber = req.body.ccNumber;
    var date = req.body.date;
    var cvv = req.body.cvv;
    
    var enteredDate = "";
    var enteredMonth = "";
    var enteredYear = "";

    var todaysFullDate = new Date();
    var currentMonth = todaysFullDate.getMonth() + 1;
    var currentDate = todaysFullDate.getDate();
    var currentYear = todaysFullDate.getFullYear();
    var dateStatus = "";

    if(isNaN(ccNumber)){
        res.send({
            "statusCode" : "CCNWrong"
        });
    }
    else if(isNaN(cvv)){
        res.send({
            "statusCode" : "CVVWrong"
        });
    }
    else{   
        for(var i = 0; i < 4; i++){                 //extracting Year
            enteredYear += date[i];
        }
        for(var j = 5; j < 7; j++){                 //extracting Month
            enteredMonth += date[j];
        }
        for(var k = 8; k < 10; k++){                //extracting Date
            enteredDate += date[k];
        }
        if(enteredYear > currentYear){              
            dateStatus = "OK";
        }
        else if(enteredYear == currentYear){        // if year is same, we have to check for month next
            if(enteredMonth > currentMonth){
                dateStatus = "OK";
            }   
            else if(enteredMonth == currentMonth){  //if month is same we have to check for date next
                if(enteredDate > currentDate){
                    dateStatus = "OK";
                }
                else {
                    dateStatus = "NotOK";
                }
            }
            else{
                dateStatus = "NotOK";
            }
        }
        else{
            dateStatus = "NotOK";
        }
        console.log("Entered Date = " + enteredMonth + "/" + enteredDate + "/" + enteredYear);
        console.log("Todays Date = " + currentMonth + "/" + currentDate + "/" + currentYear);
        console.log("Date Status = " + dateStatus + "; ccNumber.length = " + ccNumber.length + "; cvv.length = " + cvv.length);

        if(ccNumber.length == 16 && cvv.length == 3 && dateStatus == "OK"){
            fileSystem.appendFile('public/myLogs/myLogs.txt', '' + req.session.email_id + ' Clicked Button ID: validate and credit card was successfully validated at ' + date + '\n\n', function(err){
                console.log("Failed to Write into File!");
            });
            res.send({
                "statusCode" : "200"
            }); 
        }
        else if(ccNumber.length != 16){
            fileSystem.appendFile('public/myLogs/myLogs.txt', '' + req.session.email_id + ' Clicked Button ID: validate and credit card validation failed at ' + date + '\n\n', function(err){
                console.log("Failed to Write into File!");
            });
            res.send({
                "statusCode" : "CCNWrong"
            });
        }
        else if(cvv.length != 3){
            fileSystem.appendFile('public/myLogs/myLogs.txt', '' + req.session.email_id + ' Clicked Button ID: validate and credit card validation failed at ' + date + '\n\n', function(err){
                console.log("Failed to Write into File!");
            });
            res.send({
                "statusCode" : "CVVWrong"
            });
        }
        else {
            fileSystem.appendFile('public/myLogs/myLogs.txt', '' + req.session.email_id + ' Clicked Button ID: validate and credit card validation failed at ' + date + '\n\n', function(err){
                console.log("Failed to Write into File!");
            });
            res.send({
                "statusCode" : "dateWrong"
            });
        }
    }
}

exports.buyItem = function(req, res){
    var date = new Date();
    console.log("Recieved following from the client: " + JSON.stringify(req.body.billingInfo));

    var billingInfo = req.body.billingInfo;
    var billingAddress = billingInfo.streetAddress.concat(", ", billingInfo.city,", ", billingInfo.state,", ", billingInfo.country,", ", billingInfo.zip);
    console.log("Stroing address as = " + billingAddress);

    if(billingInfo.streetAddress == null || billingInfo.city == null || billingInfo.state == null || billingInfo.country == null || billingInfo.zip == null){
        response.send({
            "statusCode" : 403,
            "error" : "Billing Information is not complete"
        });
    }
    else{
        for (i = 0; i < req.session.cart.length; i++){
            console.log("req.session.email_id = " + req.session.email_id);
            var addItemToBuyTableQuery = "insert into ebay.buy_product (product_id, item_name, quantity_bought, buyer_email, seller_email_id, total_priceOfThisItem, billing_address, type_of_price_tag) values "+"('" + req.session.cart[i].productId + "','" + req.session.cart[i].itemName + "','" + req.session.cart[i].userItemQuantity + "','" + req.session.email_id + "','" + req.session.cart[i].sellerEmailId + "','" + (Number(req.session.cart[i].itemPrice) * Number(req.session.cart[i].userItemQuantity)) + "','" + billingAddress+"', 'F')";
            mysql.run_aQuery(addItemToBuyTableQuery, function(err, results) {
                if (err) {
                    throw err;
                } else {
                    if (results.length > 0) {
                        res.send({ 
                            "statusCode" : 403,
                            "error" : "Empty DB Response"
                        });
                    }
                    else {
                        fileSystem.appendFile('public/myLogs/myLogs.txt', '' + req.session.email_id + ' Clicked Button ID: buy and user purchased all the items in the cart at ' + date + '\n\n', function(err){
                            console.log("Failed to Write into File!");
                        });
                        res.send({
                            "statusCode" : 200
                        })
                        console.log("response from DB Empty");
                    }
                }
            });
        }
    }

    for(var j = 0; j < req.session.cart.length; j++){
        var updateProductQuantity = req.session.cart[j].totalAvailableQuantity - req.session.cart[j].userItemQuantity;
        console.log("Updating Quantity:  " + updateProductQuantity);
        var updateProducts = "update ebay.sell_product set item_quantity ='" + updateProductQuantity + "' where product_id ='" + req.session.cart[j].productId + "' and email_id ='" + req.session.cart[j].sellerEmailId + "'";
        mysql.run_aQuery(updateProducts, function(err, results) {
            if (err) {
                throw err;
            } 
            else 
                console.log("Quantity Updation Successfull");
        });
    }
    req.session.cart = [];
    req.session.totalPrice = 0;
};

//---------------------------------------------------END OF SELL, ADD TO CART AND BUY---------------------------------

exports.logOut = function(req, res){
    var date = new Date();
    fileSystem.appendFile('public/myLogs/myLogs.txt', '' + req.session.email_id + ' Clicked Button ID: logOut and was logged out of the session at ' + date + '\n\n\n\n\n', function(err){
        console.log("Failed to Write into File!");
    });
	req.session.destroy();
	res.redirect('/');
};