/**
 * New node file
 */
var userProfile = angular.module('userProfile', ['ui.router']);
userProfile.config(function($stateProvider, $urlRouterProvider){
	$stateProvider.state('userProfile', {
		url : '/profile',
		views : {
			'navBar' : {
				templateUrl : 'templates/navBar.html'
			},
			'profileContent' : {
				templateUrl : 'templates/profileContent.html'
			}
		}
	})
	$urlRouterProvider.otherwise('/profile');
});

userProfile.controller('profileContentCtrl', function($scope, $http, $state){
	$http({
		method : "POST",
		url : "/getDetails"
	}).success(function(data){
		if(data.statusCode == 200){
			document.getElementById("hiUsername").innerHTML = "Hi " + data.firstname + "!";
			document.getElementById("dateOfBirth").innerHTML = data.dateOfBirth;
			document.getElementById("phoneNumber").innerHTML = data.phoneNumber;		
			document.getElementById("userHandle").innerHTML = data.firstname;
			document.getElementById("location").innerHTML = data.location;
		}
		else console.log("error retrieving details from server");
	});
});

userProfile.controller('getMySellingItems', function($scope, $http, $state){
	$http({
		method : "POST",
		url : "/getMySellingItems"
	}).success(function(data){
		if(data.statusCode == 200){
			document.getElementById("hiUsername").innerHTML = "Hi " + data.firstname + "!";
			document.getElementById("dateOfBirth").innerHTML = data.dateOfBirth;
			document.getElementById("phoneNumber").innerHTML = data.phoneNumber;		
			document.getElementById("userHandle").innerHTML = data.firstname;
			document.getElementById("location").innerHTML = data.location;
			$scope.itemsSelling = data.rows;
		}
		else console.log("error retrieving details from server");
	});

	var PriceTagType = "";
	$scope.fixedPrice = false;
	$scope.auction = false;
	$scope.showSellItemDiv = false;
	$scope.showMyCollectionsDiv = false;
	$scope.showMyPurchasesDiv = false;
	$scope.showMySalesDiv = false;
	$scope.showPurchasesEmptyDiv = false;
	$scope.showSalesEmptyDiv = false;
	$scope.showMyBidsDiv = false;
	
	$scope.showSellItem = function(){
		if($scope.showSellItemDiv == false){
			$scope.showSellItemDiv = true;
		}
		else 
			$scope.showSellItemDiv = false;
	}
	
	$scope.priceTagType = function(typeOfPriceTag){
		if(typeOfPriceTag == 'F'){
			$scope.fixedPrice = true;
			$scope.auction = false;
			$scope.auctionPriceType = "";
			$scope.durationAP = "";
			PriceTagType = 'F';
		}		
		else if(typeOfPriceTag == 'A'){
			$scope.auction = true;
			$scope.fixedPrice = false;
			$scope.fixedPriceType = "";
			$scope.durationFP = "";
			PriceTagType = 'A';
		}
	};
	
	$scope.sellItem = function(){
		if(PriceTagType == 'F'){
			$http({
				method : "POST",
				url : "/sellItem",
				data : {
					"PriceTagType" : PriceTagType,
					"itemName" : $scope.itemName,
					"itemDescription" : $scope.itemDescription,
					"fixedPrice" : $scope.fixedPriceType,
					"durationFP" : $scope.durationFP,
					"itemQuantity" : $scope.itemQuantity
				}
			}).success(function(data){
				if(data.statusCode == 200){
					$scope.itemName = "";
					$scope.itemDescription = "";
					$scope.fixedPriceType = "";
					$scope.durationFP = "";
					$scope.itemQuantity = "";
					$scope.itemsSelling = data.rows;
					console.log($scope.itemsSelling);
					$scope.showSellItemDiv = false;
				}
				else console.log("Message from Server: " + data.error + data.statusCode);
			});
		}
		else if(PriceTagType == 'A'){
			$http({
				method : "POST",
				url : "/sellItem",
				data : {
					"PriceTagType" : PriceTagType,
					"itemName" : $scope.itemName,
					"itemDescription" : $scope.itemDescription,
					"auctionPrice" : $scope.auctionPriceType,
					"durationAP" : $scope.durationAP,
					"itemQuantity" : $scope.itemQuantity,
					"timeFormat" : $scope.timeFormat
				}
			}).success(function(data){
				if(data.statusCode == 200){
					$scope.itemName = "";
					$scope.itemDescription = "";
					$scope.auctionPriceType = "";
					$scope.durationAP = "";
					$scope.itemQuantity = "";
					$scope.itemsSelling = data.rows;
					console.log($scope.itemsSelling);
				}
				else console.log("Message from Server: " + data.error);
			});
		}
	};

	$scope.showMyCollections = function(){
		$scope.showMyCollectionsDiv =! $scope.showMyCollectionsDiv;
	};

	$scope.showMyPurchases = function(){
		$scope.showMyPurchasesDiv =! $scope.showMyPurchasesDiv;
		$http({
			method : "POST",
			url : "/showMyPurchases"
		}).success(function(data){
			if(data.statusCode == 200){
				$scope.myPurchases = data.myPurchases;
			}
			else{
				console.log("Message from Server = " + data.error);
				$scope.showPurchasesEmptyDiv = true;
			}
		})
	}

	$scope.showMyBids = function(){
		$scope.showMyBidsDiv =! $scope.showMyBidsDiv;
		$http({
			method : "POST",
			url : "/showMyBids"
		}).success(function(data){
			if(data.statusCode == 200){
				$scope.myBids = data.myBids;
			}
			else{ 
				console.log("Message from Server = " + data.error);
				$scope.showBidsEmptyDiv = true;				
			}
		})
	}

	$scope.showMySales = function(){
		$scope.showMySalesDiv =! $scope.showMySalesDiv;
		$http({
			method : "POST",
			url : "/showMySales"
		}).success(function(data){
			if(data.statusCode == 200){
				$scope.mySales = data.mySales;
			}
			else{ 
				console.log("Message from Server = " + data.error);
				$scope.showSalesEmptyDiv = true;				
			}
		})
	}
});