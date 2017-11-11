/**
 * Module dependencies.
 */
var express = require('express')
  , http = require('http')
  , logger = require('morgan')
  , bodyParser = require('body-parser')
  , path = require('path')
  , index = require('./routes/index')
  , users = require('./routes/user')
  , uploadData = require('./routes/uploadData')
  , passport = require('passport')
  ,	cors = require('cors')
  , mongoSessionURL = "mongodb://localhost:27017/sessions"
  , expressSessions = require("express-session")
  , cookieParser = require('cookie-parser')
  , mongoStore = require("connect-mongo")(expressSessions);
require('./routes/passport')(passport);
var app = express();
var corsOptions = {
	    origin: 'http://localhost:3000',
	    credentials: true,
	    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
	}
	app.use(cors(corsOptions))
// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
//passport session
//app.use(cookieParser());
app.use(expressSessions({
    secret: "CMPE273_passport",
    resave: false,
    //Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, //force to save uninitialized session to db.
    //A session is uninitialized when it is new but not modified.
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 6 * 1000,
    store: new mongoStore({
        url: mongoSessionURL
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/user', users);
app.use('/uploadData', uploadData);
// development only
//catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
//error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(err);
    // render the error page
    res.status(err.status || 500);
    res.json('error');
});
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
