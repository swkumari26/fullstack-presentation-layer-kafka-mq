var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/cmpe273lab2";
var kafka = require('./kafka/client');

module.exports = function(passport) {
	  // serialize sessions
	  passport.serializeUser(function(user, done) {
		  console.log("user is:",user);
		console.log("email id in serialized",user.email);
	    done(null, user.email);
	  });
	  passport.deserializeUser(function(email, done) {
		  console.log("inside deserialized",email);
	        try {
	        	kafka.make_request('login_topic',{"email":email}, function(err,user){
	                if(err){
	                    done(err,{});
	                }
	                else
	                {	console.log("\nresults:",user);
	                    if(user.code==="201"){
	                        done(null,user.value);
	                    }
	                    else {
	                        done(null,false);
	                    }
	                }
	                });
	        }
	        catch (e){
	            done(e,{});
	        }
	  });
    passport.use('login', new LocalStrategy({
    		usernameField:'email',
    		passwordField:'password'
    		},
    		function(email, password, done) {
    	console.log("inside passport login",email);
        try {
        	kafka.make_request('login_topic',{"email":email,"password":password}, function(err,user){
                if(err){
                    done(err,{});
                }
                else
                {	console.log("\nresults:",user.value);
                if(user.code==="201"){
                    done(null,user.value);
                	}
                else {
                    done(null,false);
                	}
                }
            });
        }
        catch (e){
            done(e,{});
        }
    }));
};


