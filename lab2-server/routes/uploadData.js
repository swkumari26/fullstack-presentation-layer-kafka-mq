var express = require('express')
,router = express.Router()
,user	= require('./user')
,kafka = require('./kafka/client');

router.post('/uploadFile', user.isLoggedIn, function(req, res){
	kafka.make_request('upload_topic',{email:req.user.email,file:req.body.file}, function(err,result){
        if(err){
        	console.log("error in upload file",err);
            throw err;
        }
        else
        {		
            if (result.code === 401) {
            	return res.status(401).json({"statusText":result.value});
            } else {
                console.log("File uploaded successfully");
                return res.status(201).json({result:result.value,"statusText":"File uploaded successfully!"});
            }
        }
        });	
});

//router.get('/downloadFile', function (req, res, next) {
//console.log("got to endpoint");
//var filePath = path.join('dropbox',''+req.body.user,''+req.body.path);
//glob("public/uploads/*.pdf", function (er, files) {
//
//    console.log("inside glob");
//
//    console.log("inside glob file", files);
//    var resArr = files.map(function (file) {
//        var fileJSON = {};
//        fileJSON.file = 'dropbox/'+file.split('/')[2];
//        fileJSON.cols = 2  ;
//        return fileJSON;
//    });
//    console.log("response array",resArr);
//    res.status(200).send(resArr);
//});
//});
router.post('/createFolder', user.isLoggedIn, function(req, res){
	kafka.make_request('createFolder_topic',{email:req.user.email,path:req.body.folderPath}, function(err,result){
        if(err){
        	console.log("error in create folder",err);
            throw err;
        }
        else
        {		
            if (result.code === 401) {
            	return res.status(401).json({"statusText":result.value});
            } else {
                console.log("Folder created successfully");
                return res.status(201).json({result:result.value,"statusText":"Folder created successfully!"});
            }
        }
        });	
});

router.post('/deleteContent', user.isLoggedIn, function(req, res){
	kafka.make_request('deleteContent_topic',{email:req.user.email,path:req.body.path}, function(err,result){
        if(err){
        	console.log("error in create folder",err);
            throw err;
        }
        else
        {		
            if (result.code === 401) {
            	return res.status(401).json({"statusText":result.value});
            } else {
                console.log("Folder created successfully");
                return res.status(201).json({result:result.value,"statusText":"Folder created successfully!"});
            }
        }
        });	
});

router.post('/shareContent', user.isLoggedIn, function(req, res){
	kafka.make_request('shareContent_topic',{email:req.user.email,path:req.body.path,name:req.body.name,sharedto:req.body.sharedto}, function(err,result){
        if(err){
        	console.log("error in share content",err);
            throw err;
        }
        else
        {		
            if (result.code === 401) {
            	return res.status(401).json({"statusText":result.value});
            } else {
                console.log("Content shared successfully");
                return res.status(201).json({result:result.value,"statusText":"Content shared successfully!"});
            }
        }
        });	
});

router.post('/markStar', user.isLoggedIn, function(req, res){
	kafka.make_request('shareContent_topic',{email:req.user.email,path:req.body.path}, function(err,result){
        if(err){
        	console.log("error in Star toggle",err);
            throw err;
        }
        else
        {		
            if (result.code === 401) {
            	return res.status(401).json({"statusText":result.value});
            } else {
                console.log("Star toggled successfully");
                return res.status(201).json({result:result.value,"statusText":"Content marked/unmarked successfully!"});
            }
        }
        });	
});

module.exports = router;