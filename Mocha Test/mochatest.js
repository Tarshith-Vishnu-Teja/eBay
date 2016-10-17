/**
 * New node file
 */
var request = require('request')
, express = require('express')
,assert = require("assert")
,http = require("http");

describe('http tests', function(){
	
	it('Sign In Page', function(done){
		http.get('http://localhost:3000/', function(res) {
			assert.equal(200, res.statusCode);
			done();
		});
	});

	it('Validate Credentials', function(done) {
		request.post(
			    'http://localhost:3000/signInRequest',
			    { form: { "jsonDetails":{"loginEmail":"vishnu@gmail.com","loginPassword":"1111"} } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	
	it('Registration Page', function(done){
		request.post(
			    'http://localhost:3000/signUpRequest',
			    { form: {"jsonDetails" : {"firstname" : "Vishwa", "lastname" : "Teja", "dateOfBirth" : "1990-11-17", "registerEmail" : "vishwa@gmail.com", "location" : "Hyderabad", "phoneNumber	" : "9676266096", "reenterRegisterEmail" : "vishwa@gmail.com", "registerPassword" : "1111"}} },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	});

	it('loadHome', function(done){
		request.get(
			    'http://localhost:3000/home',
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	});
	
	it('loadProfile', function(done){
		request.get(
			    'http://localhost:3000/profile',
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	}); 