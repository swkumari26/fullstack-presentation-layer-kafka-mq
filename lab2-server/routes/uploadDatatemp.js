var mkdirp = require('mkdirp')
	, path = require('path')
	,express = require('express')
	,router = express.Router()
	,session = require('./session')
	,passport = require("passport")
	,getUserData = require('./getUserData')
	,multer = require('multer')
	,fs		= require('fs')
	,rimraf		= require('rimraf')
	,databaseOperation = require('./databaseOperation')
	,jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
passport.use(session.strategy);

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    	var filePath = path.join(__dirname,'..','public','dropbox',''+req.body.path);
    	console.log("filepath is", filePath);
        cb(null, filePath)
    },
    filename: function (req, file, cb) {
    	var originalname = file.originalname;  	
    	filename = file.originalname;
        cb(null, filename);
    }
});

var upload = multer({storage: storage, dest: "./public/dropbox/"});

router.post('/uploadFile', upload.single('myfile'), passport.authenticate('jwt', { session: false }), function(req, res){
	var directoryName = path.join(__dirname,'..','public','dropbox');
	console.log(req.body.path);
    console.log("checking user id",req.user.id);
    console.log(req.file);
    var contentPath = req.body.path+req.file.originalname;
    console.log("absolutepath received in file upload",req.body.absolutepath);
    if(req.body.absolutepath){
    var absolutePath = req.body.absolutepath+req.file.originalname+'/';
    }
    else{
    	absolutePath="";
    }
    var filePath = path.join(__dirname,'..','public','dropbox',''+req.body.path);	 
	var insertContent = "insert into content (created_by,content_path,user_absolute_path,content_name) values ( '"+req.user.id+"','"+contentPath+"','"+absolutePath+"','"+req.file.originalname+"')";
		  console.log("insert query for create file",insertContent);
		  databaseOperation.executeQuery(insertContent,processResult);
			function processResult(err,data){
				if(err){
					console.log("error in creating file");
				}	
		    else 
		    {   
		    	var logQuery = "update users set no_content_created = no_content_created + 1 where id='"+req.user.id+"'";
				  databaseOperation.executeQuery(logQuery,processResult);
					function processResult(err,data){
						if(err){
							console.log("error in creating file");
						}	
				    else 
				    {   		    	
		    	console.log('Folder created Successfully');
				getUserData.walkUserDir(req.user.id,function(err,results,contentMetaData){
					if(err) throw err;
					else
						{
						res.json({result:results,contentMetaData:contentMetaData});
						}
					});	    	
		    }	
			}
		    }
			}
	});

router.get('/downloadFile', function (req, res, next) {
console.log("got to endpoint");
var filePath = path.join('dropbox',''+req.body.user,''+req.body.path);
glob("public/uploads/*.pdf", function (er, files) {

    console.log("inside glob");

    console.log("inside glob file", files);
    var resArr = files.map(function (file) {
        var fileJSON = {};
        fileJSON.file = 'dropbox/'+file.split('/')[2];
        fileJSON.cols = 2  ;
        return fileJSON;
    });
    console.log("response array",resArr);
    res.status(200).send(resArr);
});
});

router.post('/createFolder', passport.authenticate('jwt', { session: false }), function(req, res){
	var directoryName = path.join(__dirname,'..','public','dropbox');
	console.log("req received",req.body);
	console.log("req",req.user);
	folderPath = path.join(__dirname,'..','public','dropbox',''+req.body.folderPath);	
	console.log("path received",folderPath);
	mkdirp(folderPath, function (err) {
	    if (err) {console.error(err);}
	    else 
	    {   
	    	var insertContent = "insert into content (created_by,content_path,user_absolute_path,content_name) values ( '"+req.user.id+"','"+req.body.folderPath+"','"+req.body.absolutePath+"','"+req.body.content_name+"')";
			  console.log("insert query for create file",insertContent);
			  databaseOperation.executeQuery(insertContent,processResult);
				function processResult(err,data){
					if(err){
						console.log("error in creating folder");
					}	
			    else 
			    {   
			    	var logQuery = "update users set no_content_created = no_content_created + 1 where id='"+req.user.id+"'";
					  databaseOperation.executeQuery(logQuery,processResult);
						function processResult(err,data){
							if(err){
								console.log("error in creating file");
							}	
					    else 
					    {   		    	
			    	console.log('Folder created Successfully');
					getUserData.walkUserDir(req.user.id,function(err,results,contentMetaData){
						if(err) throw err;
						else
							{
							res.json({result:results,contentMetaData:contentMetaData});
							}
						});	    	
			    }	
				}
			    }
				}
	    }
		});
});
router.post('/deleteFile', passport.authenticate('jwt', { session: false }), function(req, res){
	var directoryName = path.join(__dirname,'..','public','dropbox');
	console.log("req received",req.body);
	console.log("req",req.user);
	filePath = path.join(__dirname,'..','public','dropbox',''+req.body.filePath);	
	console.log("path received",filePath);
	fs.unlink(filePath, function (err) {
	    if (err) {console.error(err);}
	    else 
	    	{
	    	var deleteContent = "delete from content where content_path ='"+req.body.filePath+"'";
		  console.log("delete query for content star",deleteContent);
		  databaseOperation.executeQuery(deleteContent,processResult);
			function processResult(err,data){
				if(err){
					console.log("error in deleting content");
				}	
		    else 
		    {   	    	
		    	var logQuery = "update users set no_content_deleted = no_content_deleted + 1 where id='"+req.user.id+"'";
				  databaseOperation.executeQuery(logQuery,processResult);
					function processResult(err,data){
						if(err){
							console.log("error in creating file");
						}	
				    else 
				    {   		    	
		    	console.log('Folder created Successfully');
				getUserData.walkUserDir(req.user.id,function(err,results,contentMetaData){
					if(err) throw err;
					else
						{
						res.json({result:results,contentMetaData:contentMetaData});
						}
					});	    	
				    }	
					}
		    	}
			}
	    	}
	});
});

router.post('/deleteFolder', passport.authenticate('jwt', { session: false }), function(req, res){
	var directoryName = path.join(__dirname,'..','public','dropbox');
	console.log("req received",req.body);
	console.log("req",req.user);
	folderPath = path.join(__dirname,'..','public','dropbox',''+req.body.folderPath);	
	console.log("path received",folderPath);
	rimraf(folderPath, function (err) {
	    if (err) {console.error(err);}
	    else 
	    {   
	    	var deleteContent = "delete from content where content_path ='"+req.body.folderPath+"'";
			  console.log("delete query for content star",deleteContent);
			  databaseOperation.executeQuery(deleteContent,processResult);
				function processResult(err,data){
					if(err){
						console.log("error in deleting content");
					}	
			    else 
			    {   	    	
			    	var logQuery = "update users set no_content_deleted = no_content_deleted + 1 where id='"+req.user.id+"'";
					  databaseOperation.executeQuery(logQuery,processResult);
						function processResult(err,data){
							if(err){
								console.log("error in creating file");
							}	
					    else 
					    {   		    	
			    	console.log('Folder created Successfully');
					getUserData.walkUserDir(req.user.id,function(err,results,contentMetaData){
						if(err) throw err;
						else
							{
							res.json({result:results,contentMetaData:contentMetaData});
							}
						});	    	
			    }	
				}
			    }
				}
	    }
		});
});

router.post('/shareContent', passport.authenticate('jwt', { session: false }), function(req, res){
	var directoryName = path.join(__dirname,'..','public','dropbox');
	console.log("req received",req.body);	
	  var insertSharedContentQuery = "insert into shared_content (shared_to_id,content_path,content_name) values ( '"+req.body.sharedto+"','"+req.body.path+"','"+req.body.name+"')";
	  console.log("insert query for shared content",insertSharedContentQuery);
	  databaseOperation.executeQuery(insertSharedContentQuery,processResult);
		function processResult(err,data){
			if(err){
				console.log("error in fetching shared content");
			}	
	    else 
	    {   
	    	var logQuery = "update users set no_content_shared = no_content_shared + 1 where id='"+req.user.id+"'";
			  databaseOperation.executeQuery(logQuery,processResult);
				function processResult(err,data){
					if(err){
						console.log("error in creating file");
					}	
			    else 
			    {   		    	
	    	console.log('Folder created Successfully');
			getUserData.walkUserDir(req.user.id,function(err,results,contentMetaData){
				if(err) throw err;
				else
					{
					res.json({result:results,contentMetaData:contentMetaData});
					}
				});	    	
	    }	
		}
	    }
		}
});

router.post('/markStar', passport.authenticate('jwt', { session: false }), function(req, res){
	var directoryName = path.join(__dirname,'..','public','dropbox');
	console.log("content path received",req.body.content_path);  
	    	var updateContent = "update content set star = 1 where content_path ='"+req.body.content_path+"'";
			  console.log("update query for content star",updateContent);
			  databaseOperation.executeQuery(updateContent,processResult);
				function processResult(err,data){
					if(err){
						console.log("error in marking star");
					}	
			    else 
			    {   
			    	console.log('Star marked Successfully');
					getUserData.walkUserDir(req.user.id,function(err,results,contentMetaData){
						if(err) throw err;
						else
							{
							res.json({result:results,contentMetaData:contentMetaData});
							}
						});	    	
			    }	
			}	    		
});

module.exports = router;