/**
 * New node file
 */

var ebaysignup = angular.module('ebaysignup', ['ui.router']);
ebaysignup.config(function($stateProvider, $urlRouterProvider){
	$stateProvider.state('ebaySignup', {
		url : '/',
		views : {
			'loadImage' : {
				templateUrl : 'templates/loadImage.html'
			},
			'credentials' : {
				templateUrl : 'templates/credentials.html'
			}
		}
	})
	$urlRouterProvider.otherwise('/');
});


ebaysignup.controller('signupCtrl', function($scope, $http){
	$scope.signIn = function(){
		var loginEmail = $scope.loginEmail;
		var loginPassword = $scope.loginPassword;
		var jsonDetails = {
			"loginEmail" : loginEmail, 
			"loginPassword": loginPassword
		};
		$http({
			method : "POST",
			url : "/signInRequest",
			data : {
				"jsonDetails" : jsonDetails
			}
		}).success(function(data){
			if(data.statusCode == "200"){
				console.log("valid login");
				window.location = "/home";
			}
			else{
				alert("Invalid Login Details");
			}
		});
	};

	$scope.signUp = function(){
		var firstname = $scope.firstname;
		var lastname = $scope.lastname;
		var dateOfBirth = document.getElementById("DATEPicker").value;
		var registerEmail = $scope.registerEmail;
		var registerPassword = $scope.registerPassword;
		var reenterRegisterEmail = $scope.reenterRegisterEmail;
		var phoneNumber = $scope.phoneNumber;

		$scope.matchingEmails = false;

		if(reenterRegisterEmail != registerEmail){
			$scope.matchingEmails = true;
		}
		else{
			var jsonDetails = {
				"firstname" : firstname, 
				"lastname" : lastname, 
				"dateOfBirth" : dateOfBirth, 
				"registerEmail" : registerEmail, 
				"registerPassword" : registerPassword,
				"reenterRegisterEmail" : reenterRegisterEmail,
				"phoneNumber" : phoneNumber,
				"location" : $scope.location
			};
			$http({
				method : "POST",
				url : "/signUpRequest",
				data : {
					"jsonDetails" : jsonDetails
				}
			}).success(function(data){
				if(data.statusCode == 403){
					alert("User Already Exists, Please Sign In!");
				}
				else window.location = "/";
			})
		}
	}

});