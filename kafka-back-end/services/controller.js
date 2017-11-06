var mongo = require("./mongo"),
	listDir = require("./listDir");
exports.login = function(msg, callback){
    var res = {}, queryParam;
    	mongo.findData('users',msg,function(err,user){
            if (user) {
          	   res.code = "201";
         	   console.log("user id",user.id);
				listDir.walkUserDir(user.id,function(err,results){
					console.log("result",results);
						if(!results){
							console.log("adding empty content to user");
							user.contents = [];
							res.value = user;
							console.log("user in login",user);
							callback(null,res);
						}
						else{
						console.log("searching for content");
						mongo.findDataWithIn('contents',results,function(err,contents){
							console.log("contents from mongo",contents);
							if(err) res.code = "401";
							else {
								if(contents)
								user.contents = contents;
								else
								user.contents = [];
								}
				         	   res.value=user;   
				         	   console.log("user in login",user);
				         	   callback(null,res);
						});
					}
				}); 
             }
            else{
         	   res.code = "401";
         	   res.value="Invalid Credentials";
               callback(null,res);
            }
    });
};
exports.signUp = function(msg, callback){
    var res = {}, queryParam;
    	mongo.insertData('users',msg,function(err,user){
    		console.log("user is",user);
            if (user) {
         	   res.code = "201";
//        	   res.value=user;
            }
           else{
        	   console.log("err is",err.name);
        	   res.code = "401";
        	   res.value="Select a different email id";
           }
           console.log("responsee in controller signup",res); 
     	   callback(null,res)
    });
};