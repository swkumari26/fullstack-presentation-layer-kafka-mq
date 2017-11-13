var http=require('http');
var assert = require('assert');
var request = require('request');

describe('Api tests', function(){
	it('Signup user if the data sent is valid', function(done){
		var myJSONObject = { 
			"firstname":"Mocha1",
			"lastname":"MochaLName",
			"email":"mocha1@mocha.com",
			"password":"mocha1pass"
		 };

		request({
    		     url: "http://localhost:3001/user/signUp",
                 credentials:'include',
    		     method: "POST",
    		     json: true, 
    		     body: myJSONObject
		}, function (error, res, body){
			if(error)
			   console.log("error in signUp",error);
			assert.equal(201, res.statusCode);
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
                     credentials:'include',
                     json: true,  
                     body: myJSONObject
                }, function (error, res, body){
			if(error)
			    console.log("error in doLogin",error);
			assert.equal(201, res.statusCode);
                        done();
                });
        });

	it('Create folder for authorized user', function(done){
                var myJSONObject = {
			"folderPath":"test", 
            "userFolder":"mocha1"
		};      

                request({
                     url: "http://localhost:3001/uploadData/createFolder",
                     credentials:'include',
		             method: "POST",
                     json: true,  
                     body: myJSONObject
                }, function (error, res, body){
                        if(error)
			   console.log("error in createFolder",error);
			assert.equal(201, res.statusCode);
                        done();
                });
        });

        it('star a content', function(done){
                var myJSONObject = {
                        "path":"test"
                };        
                request({
                     url: "http://localhost:3001/uploadData/markStar",
                     credentials:'include',
                     method: "POST",
                     json: true,  
                     body: myJSONObject
                }, function (error, res, body){
                        if(error)
               console.log("error in createFolder",error);
            assert.equal(201, res.statusCode);
                        done();
                });
        });     

        it('Delete folder if path is correct and user is authorized', function(done){
                var myJSONObject = {
                        "path":"test",
                        "userFolder":"mocha1"
                };

                request({
                     url: "http://localhost:3001/uploadData/deleteContent",
                     method: "POST",
                     credentials:'include',
                     json: true,
                     body: myJSONObject
                }, function (error, res, body){
                        if(error)
                           console.log("error in deleteFolder",error);
                        assert.equal(201, res.statusCode);
                        done();
                });
        });

	it('get all the user details when user is logged in and page is refreshed', function(done){
                request({
                     url: "http://localhost:3001/user/loginRefresh",
                     credentials:'include',
                     method: "GET",
                }, function (error, res, body){
                        if(error)
                           console.log("error in login refresh",error);
                        assert.equal(201, res.statusCode);
			 done();
                });
        });   
            
    it('create a group', function(done){
                var myJSONObject = {
                        "name":"mochaGroup"
                };        
                request({
                     url: "http://localhost:3001/uploadData/createGroup",
                     credentials:'include',
                     method: "POST",
                     json: true,  
                     body: myJSONObject
                }, function (error, res, body){
                        if(error)
               console.log("error in creategroup",error);
            assert.equal(201, res.statusCode);
                        done();
                });
        });  
    it('add member to a group', function(done){
                var myJSONObject = {
                        "name":"mochaGroup",
                        "id":"user10"
                };        
                request({
                     url: "http://localhost:3001/uploadData/addMember",
                     credentials:'include',
                     method: "POST",
                     json: true,  
                     body: myJSONObject
                }, function (error, res, body){
                        if(error)
            assert.equal(201, res.statusCode);
                        done();
                });
        });   
    it('remove member from a group', function(done){
                var myJSONObject = {
                        "name":"mochaGroup",
                        "id":"user10"
                };        
                request({
                     url: "http://localhost:3001/uploadData/removeMember",
                     credentials:'include',
                     method: "POST",
                     json: true,  
                     body: myJSONObject
                }, function (error, res, body){
                        if(error)
            assert.equal(201, res.statusCode);
                        done();
                });
        });  
    it('delete a group', function(done){
                var myJSONObject = {
                        "name":"mochaGroup"
                };        
                request({
                     url: "http://localhost:3001/uploadData/removeMember",
                     credentials:'include',
                     method: "POST",
                     json: true,  
                     body: myJSONObject
                }, function (error, res, body){
                        if(error)
            assert.equal(201, res.statusCode);
                        done();
                });
        });                   


});
