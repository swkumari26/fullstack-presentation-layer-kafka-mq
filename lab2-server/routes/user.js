var mongo = require("./mongo")
	,path = require('path')
	,mkdirp = require('mkdirp')
	,fs = require('fs')
	,rimraf		= require('rimraf')
	,bcrypt = require('bcrypt')
	,salt = bcrypt.genSaltSync(10)
	,listDir = require("./listDir");
exports.createConnectionPool = function(callback){
	  if(!mongo.connectionsList)
	  {
	  	console.log("controllder here");
	  	mongo.createConnectionPool(function(connectionsList){
	  		console.log("connection poil length",connectionsList.length);
	  		callback();
	  	});
	  }
	  else{
		  console.log("connection else part poil length",mongo.connectionsList.length);
		  callback();
	  }
}
exports.markStar = function(msg, callback){
    var res = {}, queryParam;	
	console.log("path received",msg.path);
	var content_name = msg.user_folder+'/'+msg.path;
	queryParam = {content_name:content_name};
        mongo.updateData('contents',queryParam,function(err,user){
                   if (err) {
                	   res.code = "401";
                	   res.value = "Error occured while updating star content in database";
                	   callback(null,res);
                   }
                   else{
				listDir.walkUserDir(msg.user.id,function(err,results){
						if(!results){
							console.log("adding empty content to user");
							msg.user.contents = [];
							res.value = msg.user;
							callback(null,res);
						}
						else{
						console.log("searching for content");
						mongo.findDataWithIn('contents',results,function(err,contents){
							if(err) res.code = "401";
							else {
								if(contents)
								msg.user.contents = contents;
								else
								msg.user.contents = [];
								}
				         	   res.value=msg.user;   
				         	   callback(null,res);
						});
					}
				});
                   }
         	   });
};

exports.createFolder = function(msg, callback){
    var res = {}, queryParam;
	var folderPath = path.join(__dirname,'..','dropbox',msg.user_folder,msg.content_name);	
	console.log("path received",folderPath);
	mkdirp(folderPath, function (err) {
            if (!err) {
          	   res.code = "201";
         	   console.log("user id",msg.user.id);
         	   queryParam = {content_name:msg.content_name,user_folder:msg.user_folder,created_by:msg.user.id,created_on:new Date(),star:0};
         	   console.log("queryParameter in create folder:",queryParam);
         	   mongo.insertData('contents',queryParam,function(err,user){
                   if (err) {
                	   res.code = "401";
                	   res.value = "Error occured while inserting content in database";
                	   callback(null,res);
                   }
                   else{
				listDir.walkUserDir(msg.user.id,function(err,results){
						if(!results){
							console.log("adding empty content to user");
							msg.user.contents = [];
							res.value = msg.user;
							callback(null,res);
						}
						else{
						console.log("searching for content");
						mongo.findDataWithIn('contents',results,function(err,contents){
							if(err) res.code = "401";
							else {
								if(contents)
								msg.user.contents = contents;
								else
								msg.user.contents = [];
								}
				         	   res.value=msg.user;   
				         	   callback(null,res);
						});
					}
				});
                   }
         	   });
             }
            else{
         	   res.code = "401";
         	   res.value="Error occured in creating folder";
               callback(null,res);
            }
    });
};

exports.uploadFile = function(msg, callback){
    var res = {}, queryParam, content_name,content_path;
    content_path = path.join(__dirname,'..','dropbox',msg.user.id,msg.path,msg.name);
    content_name = msg.path+msg.name;
    console.log("path to write file:",content_path);
    	fs.writeFile(content_path, msg.data,{encoding:"base64"},function(err) {
            if (!err) {
          	   res.code = "201";
         	   console.log("user id",msg.user.id);
         	   queryParam = {content_name:content_name,user_folder:msg.user_folder,created_by:msg.user.id,created_on:new Date(),star:0};
         	   console.log("queryParameter in create folder:",queryParam);
         	   mongo.insertData('contents',queryParam,function(err,user){
                   if (err) {
                	   res.code = "401";
                	   res.value = "Error occured while inserting content in database";
                	   callback(null,res);
                   }
                   else{         	   
				listDir.walkUserDir(msg.user.id,function(err,results){
						if(!results){
							console.log("adding empty content to user");
							msg.user.contents = [];
							res.value = msg.user;
							callback(null,res);
						}
						else{
						console.log("searching for content");
						mongo.findDataWithIn('contents',results,function(err,contents){
							console.log("received contents metadata from mongo");
							if(err) res.code = "401";
							else {
								if(contents)
								msg.user.contents = contents;
								else
								msg.user.contents = [];
								}
				         	   res.value=msg.user;   
				         	   callback(null,res);
						});
					}
				}); 
                   }
         	   });
            }
            else{
         	   res.code = "401";
         	   res.value="Error occured in writing file";
               callback(null,res);
            }
    });
};

exports.deleteContent = function(msg, callback){
    var res = {}, queryParam;
	var contentPath = path.join(__dirname,'..','dropbox',msg.user_folder,msg.user_folder,msg.path);	
	console.log("path received",contentPath);
	if(contentPath.indexOf('.')>-1)
	{console.log("here");
	fs.readFile(contentPath,function(err,data){if(!err)console.log("data read",data); else console.log(err);});
		fs.unlink(contentPath, function (err) {
            if (!err) {
            	console.log("file deleted is:",contentPath);
          	   res.code = "201";
         	   console.log("user id",msg.user.id);
         	   queryParam = {content_name:msg.content_name,user_folder:msg.user_folder};
         	   console.log("queryParameter in delete content:",queryParam);
         	   mongo.insertData('contents',queryParam,function(err,user){
                   if (err) {
                	   res.code = "401";
                	   res.value = "Error occured while deleting content in database";
                	   callback(null,res);
                   }
                   else{
                	   listDir.walkUserDir(msg.user.id,function(err,results){
						if(!results){
							console.log("adding empty content to user");
							msg.user.contents = [];
							res.value = msg.user;
							callback(null,res);
						}
						else{
						console.log("searching for content");
						mongo.findDataWithIn('contents',results,function(err,contents){
							if(err) res.code = "401";
							else {
								if(contents)
								msg.user.contents = contents;
								else
								msg.user.contents = [];
								}
				         	   res.value=msg.user;   
				         	   callback(null,res);
						});
					}
				});
                   }
         	   });
             }
            else{
            	console.log("error is",err);
         	   res.code = "401";
         	   res.value="Error occured in deleting file";
               callback(null,res);
            }
    });
	}
	else{
		console.log("not here");
		rimraf(contentPath, function (err) {		
        if (!err) {
       	   res.code = "201";
      	   console.log("user id",msg.user.id);
      	   queryParam = {content_name:msg.content_name,user_folder:msg.user_folder};
      	   console.log("queryParameter in delete content:",queryParam);
      	   mongo.insertData('contents',queryParam,function(err,user){
                if (err) {
             	   res.code = "401";
             	   res.value = "Error occured while deleting content in database";
             	   callback(null,res);
                }
                else{
             	   listDir.walkUserDir(msg.user.id,function(err,results){
						if(!results){
							console.log("adding empty content to user");
							msg.user.contents = [];
							res.value = msg.user;
							callback(null,res);
						}
						else{
						console.log("searching for content");
						mongo.findDataWithIn('contents',results,function(err,contents){
							if(err) res.code = "401";
							else {
								if(contents)
								msg.user.contents = contents;
								else
								msg.user.contents = [];
								}
				         	   res.value=msg.user;   
				         	   callback(null,res);
						});
					}
				});
                }
      	   });
          }
         else{
      	   res.code = "401";
      	   res.value="Error occured in deleting folder";
            callback(null,res);
         }
 });		
	}
};
exports.login = function(msg, callback){
    var res = {}, queryParam;
    	queryParam = {'email':msg.email};
    	mongo.findData('users',queryParam,function(err,user){
            if (user) {
               if(bcrypt.compareSync(''+msg.password,''+user.password))
               {
          	   res.code = "201";
         	   console.log("user id",user.id);
				listDir.walkUserDir(user.id,function(err,results){
						if(!results){
							console.log("adding empty content to user");
							user.contents = [];
							res.value = user;
							callback(null,res);
						}
						else{
						console.log("searching for content");
						mongo.findDataWithIn('contents',results,function(err,contents){
							if(err) res.code = "401";
							else {
								if(contents)
								user.contents = contents;
								else
								user.contents = [];
								}
							console.log("user after content check from db",user);
				         	   res.value=user;   
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

             }
            else{
         	   res.code = "401";
         	   res.value="Invalid Credentials";
               callback(null,res);
            }
    });
};
exports.createGroup = function(msg, callback){
    var res = {}, queryParam;
    	mongo.insertData('contents',msg,function(err,user){
            if (user) {
          	   res.code = "201";
         	   console.log("user id",user.id);
				listDir.walkUserDir(user.id,function(err,results){
						if(!results){
							console.log("adding empty content to user");
							user.contents = [];
							res.value = user;
							callback(null,res);
						}
						else{
						console.log("searching for content");
						mongo.findDataWithIn('contents',results,function(err,contents){
							if(err) res.code = "401";
							else {
								if(contents)
								user.contents = contents;
								else
								user.contents = [];
								}
							console.log("user after content check from db",user);
				         	   res.value=user;   
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

exports.deleteGroup = function(msg, callback){
    var res = {}, queryParam;
    	mongo.removeData('contents',msg,function(err,user){
            if (user) {
          	   res.code = "201";
         	   console.log("user id",user.id);
				listDir.walkUserDir(user.id,function(err,results){
						if(!results){
							console.log("adding empty content to user");
							user.contents = [];
							res.value = user;
							callback(null,res);
						}
						else{
						console.log("searching for content");
						mongo.findDataWithIn('contents',results,function(err,contents){
							if(err) res.code = "401";
							else {
								if(contents)
								user.contents = contents;
								else
								user.contents = [];
								}
							console.log("user after content check from db",user);
				         	   res.value=user;   
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

exports.addMember = function(msg, callback){
    var res = {}, queryParam;
    	mongo.insertData('contents',msg,function(err,user){
            if (user) {
          	   res.code = "201";
         	   console.log("user id",user.id);
				listDir.walkUserDir(user.id,function(err,results){
						if(!results){
							console.log("adding empty content to user");
							user.contents = [];
							res.value = user;
							callback(null,res);
						}
						else{
						console.log("searching for content");
						mongo.findDataWithIn('contents',results,function(err,contents){
							if(err) res.code = "401";
							else {
								if(contents)
								user.contents = contents;
								else
								user.contents = [];
								}
							console.log("user after content check from db",user);
				         	   res.value=user;   
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

exports.removeMember = function(msg, callback){
    var res = {}, queryParam;
    	mongo.updateData('contents',msg,function(err,user){
            if (user) {
          	   res.code = "201";
         	   console.log("user id",user.id);
				listDir.walkUserDir(user.id,function(err,results){
						if(!results){
							console.log("adding empty content to user");
							user.contents = [];
							res.value = user;
							callback(null,res);
						}
						else{
						console.log("searching for content");
						mongo.findDataWithIn('contents',results,function(err,contents){
							if(err) res.code = "401";
							else {
								if(contents)
								user.contents = contents;
								else
								user.contents = [];
								}
							console.log("user after content check from db",user);
				         	   res.value=user;   
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
exports.shareContent = function(msg, callback){
    var res = {}, queryParam;
    	mongo.updateData('users',msg,function(err,user){
            if (user) {
          	   res.code = "201";
         	   console.log("user id",user.id);
				listDir.walkUserDir(user.id,function(err,results){
						if(!results){
							console.log("adding empty content to user");
							user.contents = [];
							res.value = user;
							callback(null,res);
						}
						else{
						console.log("searching for content");
						mongo.findDataWithIn('contents',results,function(err,contents){
							if(err) res.code = "401";
							else {
								if(contents)
								user.contents = contents;
								else
								user.contents = [];
								}
							console.log("user after content check from db",user);
				         	   res.value=user;   
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
            if (user) {
         	   res.code = "201";
//        	   res.value=user;
            }
           else{
        	   console.log("err is",err.name);
        	   res.code = "401";
        	   res.value="Select a different email id";
           } 
     	   callback(null,res)
    });
};