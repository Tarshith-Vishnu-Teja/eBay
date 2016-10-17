/**
 * New node file
 */
var creditCardValidation = angular.module('creditCardValidation', ['ui.router']);
creditCardValidation.config(function($stateProvider, $urlRouterProvider){
	$stateProvider.state('creditCardValidation', {
		url : '/creditCardValidation',
		views : {
			'creditCardValidation' : {
				templateUrl : 'templates/creditCardValidation.html'
			}
		}
	})
	$urlRouterProvider.otherwise('/creditCardValidation');
});

creditCardValidation.controller('creditCardValidationCtrl', function($scope, $http, $state){
	$http({
		method : "POST",
		url : "/getDetails"
	}).success(function(data){
		if(data.statusCode == 200){
			$scope.orderTotal = "Order Total = $" + data.totalPrice;
		}
		else
			console.log("Message from the server is = " + data.error);
	});


	$scope.validate = function(){
		console.log("reached here");
		console.log($scope.ccNumber, $scope.date, $scope.cvv);
		$http ({
			method : "POST",
			url : "/validate",
			data: {
				"ccNumber" : $scope.ccNumber,
				"date" : $scope.date,
				"cvv" : $scope.cvv
			}
		}).success(function(data){
			if(data.statusCode == "200"){
			console.log("Status Code = " + data.statusCode);
				errorMessagePara = document.getElementById("errorMessage");
				errorMessagePara.style.color = "green";
				var error = "Yoour Credit Card is Valid";
				document.getElementById("errorMessage").innerHTML = error.fontsize(3);
			}
			else if(data.statusCode == "CCNWrong"){
				console.log("Status Code = " + data.statusCode);
				errorMessagePara = document.getElementById("errorMessage");
				errorMessagePara.style.color = "red";
				var error = "One or more details Invalid(HINT: Credit Card Number)";
				document.getElementById("errorMessage").innerHTML = error.fontsize(3);
			}
			else if(data.statusCode == "CVVWrong"){
			errorMessagePara = document.getElementById("errorMessage");
				errorMessagePara.style.color = "red";
				var error = "One or more details Invalid(HINT: CVV)";
				document.getElementById("errorMessage").innerHTML = error.fontsize(3);
			}
			else{
			errorMessagePara = document.getElementById("errorMessage");
				errorMessagePara.style.color = "red";
				var error = "One or more details Invalid(HINT: Date)";
				document.getElementById("errorMessage").innerHTML = error.fontsize(3);
			}
		});
	};

	$scope.buyItem = function(){
		var billingInfo = {
			"country" : $scope.country, 
			"streetAddress" : $scope.streetAddress, 
			"city" : $scope.city, 
			"state" : $scope.state, 
			"zip" : $scope.zip,
			"phoneNumber" : $scope.phoneNumber
		}
		$http({
			method : "POST",
			url : "/buyItem",
			data : {
				"billingInfo" : billingInfo
			}
		}).success(function(data){
			if(data.statusCode == 200){
				console.log("Item Successfully added into the buyers list!");
				window.location = "/profile";
			}
			else
				console.log("Message from the server = " + data.error);
		});
	};
});