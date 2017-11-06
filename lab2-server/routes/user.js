var  express = require('express')
	,router = express.Router()
	,passport = require('passport')
	,kafka = require('./kafka/client');
	require('./passport')(passport);

router.post('/signUp',function (req, res, next) {
	var id = req.body.email.split('@')[0];
    try {
    	kafka.make_request('signUp_topic',{id:id,password:req.body.password,firstname:req.body.firstname,lastname:req.body.lastname,email:req.body.email,no_content_create:0,no_content_delete:0,no_content_star:0,no_content_share:0}, function(err,user){
            if(err){
            	console.log("error in signup responsee",err);
                done(err,{});
            }
            else
            {	console.log("result is:",user);	
                if (user.code === 401) {
                	return res.status(401).json({"statusText":user.value});
                } else {
                    console.log("User created successfully");
                    return res.status(201).json({"statusText":("User "+ req.body.email +" created successfully!Please login to continue.")});
                }
            }
            });
    }
    catch (e){
        throw e;
    }	
});
router.post('/doLogin', passport.authenticate('login'), function(req, res,next) {
        return res.status(201).json({user:req.user,status:'201',statusText:("User "+ req.user.email +" logged in successfully!")});
    });
router.get('/loginRefresh', isLoggedIn, function(req, res) {
	return res.status(201).json({user:req.user,status:201,statusText:"Refreshed and received the user data again"});
});

router.get('/logout', isLoggedIn, function(req, res) {
	req.session.destroy();
	return res.status(201).json({status:201,statusText:"Logged out successfully, please login back to continue.."});
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
//module.exports = isLoggedIn;
