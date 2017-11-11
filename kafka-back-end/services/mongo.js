var MongoClient = require('mongodb').MongoClient
 	,mongoURL = "mongodb://localhost:27017/cmpe273lab2"
 	,db
 	,connected = false;
/**
 * Connects to the MongoDB Database with the provided URL
 */
var connect = function(url, callback){
    MongoClient.connect(url, function(err, _db){
      if (err) { throw new Error('Could not connect: '+err); }
      db = _db;
      connected = true;
      console.log(connected +" is connected?");
      callback(db);
    });
};

/**
 * Returns the collection on the selected database
 */
var collection = function(name){
    if (!connected) {
      throw new Error('Must connect to Mongo before calling "collection"');
    } 
    return db.collection(name);
};
/**
 * Returns the collection search results
 */
exports.findData=function(collName,queryParam,callback){
	console.log("\nQuery parameter in find:"+queryParam);
	  try{
          	connect(mongoURL, function(){
              console.log('Connected to mongo in find at: ' + mongoURL);
              var coll = collection(collName);
              coll.findOne(queryParam, function (err, result) {
                  if (result) {
                      callback(null,result);
                  } else {
                      callback(err, result);
                  }            	
              })
          	});
		  }
          catch (e){
              callback(e,{});
          }
};	

exports.findDataWithIn=function(collName,queryParam,callback){
		console.log("QueryParam in find data with",queryParam);
	  try{
          	connect(mongoURL, function(){
              console.log('Connected to mongo in find at: ' + mongoURL);
              var coll = collection(collName);
              coll.find({content_name: { $in: queryParam }}).toArray( function (err, result) {
            	  if (result) {
            		  
                      callback(null,result);
                  } else {
                      callback(err, result);
                  }            	
              })
          	});
		  }
          catch (e){
              callback(e,{});
          }
};	
/**
 *	Insert data into collection results
 */
exports.insertData=function(collName,queryParam,callback){
	  try{
          	connect(mongoURL, function(){
              console.log('Connected to mongo in insert at: ' + mongoURL);
              var coll = collection(collName);
//              coll.update({"email":queryParam.email},queryParam,{upsert:"true"}, function (err, result) {
              coll.insertOne(queryParam, function (err, result) {
                  if (result) {
                      callback(null,result);
                  } else {
                	  console.log("error in insert",err);
                      callback(err, result);
                  }            	
              })
          	});
		  }
          catch (e){
              callback(e,{});
          }
};	
exports.removeData=function(collName,queryParam,callback){
	console.log("QueryParam in remove data :",queryParam);
  try{
      	connect(mongoURL, function(){
          console.log('Connected to mongo in find at: ' + mongoURL);
          var coll = collection(collName);
          coll.remove(queryParam, function (err, result) {
        	  if (result) {
        		  
                  callback(null,result);
              } else {
                  callback(err, result);
              }            	
          })
      	});
	  }
      catch (e){
          callback(e,{});
      }
};
exports.connect = connect;
exports.collection = collection;