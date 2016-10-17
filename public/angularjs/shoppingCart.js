/**
 * New node file
 */
var shoppingCart = angular.module('shoppingCart', ['ui.router']);
shoppingCart.config(function($stateProvider, $urlRouterProvider){
	$stateProvider.state('shoppingCart', {
		url : '/shoppingCart',
		views : {
			'navBar' : {
				templateUrl : 'templates/navBar.html'
			},
			'shoppingCart' : {
				templateUrl : 'templates/shoppingCart.html'
			}
		}
	})
	$urlRouterProvider.otherwise('/shoppingCart');
});

shoppingCart.controller('shoppingCartCtrl', function($scope, $http, $state){
	$http({
		method : "POST",
		url : "/getDetails"
	}).success(function(data){
		if(data.statusCode == 200){
			document.getElementById("hiUsername").innerHTML = "Hi " + data.firstname + "!";
			document.getElementById("dateOfBirth").innerHTML = data.dateOfBirth;
			document.getElementById("phoneNumber").innerHTML = data.phoneNumber;			
		}
		else console.log("error retrieving details from server");
	});
	
});

shoppingCart.controller('cartCheckoutCtrl', function($scope, $http, $state){
	$scope.cartEmptyMessage = true;
	$scope.cartOccupied = false;

	$http({
		method : "POST",
		url : "/getItemsInCart"
	}).success(function(data){
		if(data.statusCode = 200){
			console.log("items in the cart from req.session.cart = " + JSON.stringify(data.itemsInCart));
			$scope.itemsInCart = data.itemsInCart;
			$scope.totalPriceOfItemsInCart = "Total: $" + data.totalPriceOfItemsInCart;
			console.log("data.totalPriceOfItemsInCart = " + data.totalPriceOfItemsInCart);
			if(data.totalPriceOfItemsInCart != "0"){
				console.log("cart not empty");
				$scope.cartEmptyMessage = false;
				$scope.cartOccupied = true;
			}
			else {
				console.log("cart empty");
			}

		}
		else
			console.log("Message from Server = " + data.error);
	});

	$scope.removeItemFromCart = function(itemName, userItemQuantity, itemPrice){
		$http({
			method : "POST",
			url : "/removeItemFromCart",
			data : {
				"itemName" : itemName,
				"userItemQuantity" : userItemQuantity,
				"itemPrice" : itemPrice
			}
		}).success(function(data){
			if(data.statusCode == 200){
				$scope.itemsInCart = data.itemsInCart;
				$scope.totalPriceOfItemsInCart = "Total: $" + data.totalPriceOfItemsInCart;
				console.log("totalPriceOfItemsInCart = " + data.totalPriceOfItemsInCart);
				if(data.totalPriceOfItemsInCart = "0"){
					console.log("cart empty");
					$scope.cartEmptyMessage = true;
					$scope.cartOccupied = false;
				}
				else {
					console.log("cart not empty");
				}
			}
			else
				console.log("Failed Removing the object");
		})
	}
});