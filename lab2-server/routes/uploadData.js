var express = require('express')
,router = express.Router()
,user	= require('./user')
,fs = require('fs')
,path = require('path')
,multer = require('multer')
,kafka = require('./kafka/client');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    	var filePath = path.join(__dirname,'..','public');
    	console.log("filepath is", filePath);
        cb(null, filePath)
    },
    filename: function (req, file, cb) {
    	var originalname = file.originalname;  	
    	filename = file.originalname;
        cb(null, filename);
    }
});

var upload = multer({storage: storage, dest: "./public"});
router.post('/uploadFile',isLoggedIn,upload.single('myfile'), function(req, res){
	var content_name;
	var content_name = path.join('public',req.file.originalname);
	fs.readFile(content_name,"base64",function(err,data){
		fs.unlink(content_name,function(err){});
		kafka.make_request('upload_topic',{data:data,path:req.body.path,user_folder:req.body.user_folder,name:req.file.originalname,user:req.user}, function(err,result){
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
	                return res.status(201).json({user:result.value,"statusText":"File uploaded successfully!"});
	            }
	        }
	        });
	});
})

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
router.post('/createFolder', isLoggedIn, function(req, res){
	kafka.make_request('createFolder_topic',{content_name:req.body.folderPath,user_folder:req.body.userFolder,user:req.user}, function(err,result){
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
                return res.status(201).json({user:result.value,"statusText":"Folder created successfully!"});
            }
        }
        });	
});

router.post('/deleteContent', isLoggedIn, function(req, res){
	kafka.make_request('deleteContent_topic',{user:req.user,path:req.body.path,user_folder:req.body.user_folder}, function(err,result){
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
                return res.status(201).json({user:result.value,"statusText":"Folder created successfully!"});
            }
        }
        });	
});

router.post('/shareContent', isLoggedIn, function(req, res){
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

router.post('/markStar', isLoggedIn, function(req, res){
	kafka.make_request('markStar_topic',{user:req.user,path:req.body.path}, function(err,result){
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
                return res.status(201).json({user:result.value,"statusText":"Content marked/unmarked successfully!"});
            }
        }
        });	
});
router.post('/createGroup', isLoggedIn, function(req, res){
	kafka.make_request('createGroup_topic',{user:req.user,name:req.body.name}, function(err,result){
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
                return res.status(201).json({user:result.value,"statusText":"Content marked/unmarked successfully!"});
            }
        }
        });	
});
router.post('/addMember', isLoggedIn, function(req, res){
	kafka.make_request('addMember_topic',{user:req.user,name:req.body.name,id:req.body.id}, function(err,result){
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
                return res.status(201).json({user:result.value,"statusText":"Content marked/unmarked successfully!"});
            }
        }
        });	
});
router.post('/removeMember', isLoggedIn, function(req, res){
	kafka.make_request('removeMember_topic',{user:req.user,name:req.body.name,id:req.body.id}, function(err,result){
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
                return res.status(201).json({user:result.value,"statusText":"Content marked/unmarked successfully!"});
            }
        }
        });	
});
router.post('/deleteGroup', isLoggedIn, function(req, res){
	kafka.make_request('deleteGroup_topic',{user:req.user,name:req.body.name}, function(err,result){
        if(err){
            throw err;
        }
        else
        {		
            if (result.code === 401) {
            	return res.status(401).json({"statusText":result.value});
            } else {
                console.log("Star toggled successfully");
                return res.status(201).json({user:result.value,"statusText":"Content marked/unmarked successfully!"});
            }
        }
        });	
});
router.post('/shareContent', isLoggedIn, function(req, res){
	kafka.make_request('markStar_topic',{user:req.user,path:req.body.path}, function(err,result){
        if(err){
            throw err;
        }
        else
        {		
            if (result.code === 401) {
            	return res.status(401).json({"statusText":result.value});
            } else {
                console.log("Star toggled successfully");
                return res.status(201).json({user:result.value,"statusText":"Content marked/unmarked successfully!"});
            }
        }
        });	
});
function isLoggedIn(req,res,next){
	console.log("req session", req.session);
	console.log("req authenticated",req.isAuthenticated());
	if(req.isAuthenticated()){
		return next();
	}
	else{
		return res.status(401).json({statusText:"Please login"});
	}
};
module.exports = router;