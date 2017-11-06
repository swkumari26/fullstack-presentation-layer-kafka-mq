var http=require('http');
var assert = require('assert');
var request = require('request');

describe('Api tests', function(){
	var token="";
	it('Signup user if the data sent is valid', function(done){
		var myJSONObject = { 
			"firstname":"Mocha1",
			"lastname":"MochaLName",
			"email":"mocha1@mocha.com",
			"password":"mocha1pass"
		 };

		request({
    		     url: "http://localhost:3001/user/signUp",
    		     method: "POST",
    		     json: true, 
    		     body: myJSONObject
		}, function (error, res, body){
			if(error)
			   console.log("error in signUp",error);
			assert.equal(200, res.statusCode);
			done();		
		});	
	});

      it('Verify login credentials; success if authorized user', function(done){
                var myJSONObject = { 
                        "email":"mocha1@mocha.com",
                        "password":"mocha1pass"
                 };      

                request({
                     url: "http://localhost:3001/user/doLogin",
                     method: "POST",
                     json: true,  
                     body: myJSONObject
                }, function (error, res, body){
			token = body.token;
			if(error)
			    console.log("error in doLogin",error);
			assert.equal(200, res.statusCode);
                        done();
                });
        });

	it('Create folder for authorized user', function(done){
                var myJSONObject = {
			"folderPath":"test" 
		};      

                request({
                     url: "http://localhost:3001/uploadData/createFolder",
                     headers: {	'Authorization': token  },
		     method: "POST",
                     json: true,  
                     body: myJSONObject
                }, function (error, res, body){
                        if(error)
			   console.log("error in createFolder",error);
			assert.equal(200, res.statusCode);
                        done();
                });
        });

        it('Delete folder if path is correct and user is authorized', function(done){
                var myJSONObject = {
                        "folderPath":"test"
                };

                request({
                     url: "http://localhost:3001/uploadData/deleteFolder",
                     headers: { 'Authorization': token  },
                     method: "POST",
                     json: true,
                     body: myJSONObject
                }, function (error, res, body){
                        if(error)
                           console.log("error in deleteFolder",error);
                        assert.equal(200, res.statusCode);
                        done();
                });
        });

	it('Show all available users to share content', function(done){
                request({
                     url: "http://localhost:3001/user/getUsers",
                     headers: { 'Authorization': token  },
                     method: "GET",
                }, function (error, res, body){
                        if(error)
                           console.log("error in deleteFolder",error);
                        assert.equal(200, res.statusCode);
			 done();
                });
        });


});
