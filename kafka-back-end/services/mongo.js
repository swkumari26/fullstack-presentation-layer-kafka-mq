var MongoClient = require('mongodb').MongoClient
 	,mongoURL = "mongodb://localhost:27017/cmpe273lab2";
 	//,db
 	//,connected = false;
/**
 * Connects to the MongoDB Database with the provided URL
 */
var connect = function(url,callback){
    MongoClient.connect(url, function(err, _db){
      if (err) { throw new Error('Could not connect: '+err); }
      //db = _db;
      //connected = true;
      callback(_db);
    });
};

// an array of connections 
var connectionsList=[];
var maxConnectionSize=30;

var createConnectionPool=function(callback){
	console.log("connection pool created function");
    var i = 0;
    (function next() {
    	if(i++<maxConnectionSize)
    		{
          connect(mongoURL, function(db) {
        	  connectionsList.push(db);
            next();
          });
          }
          else{	
        		console.log("connection pool is :",connectionsList.length);return;}
      })();
}

function connectFromPool(callback){
	var timer;
	console.log("here in pool");
	if(connectionsList.length>1){
		if(timer)
			clearInterval(timer);
		callback(connectionsList.shift());
	}else{
		timer=setInterval(function(){
			connectFromPool(callback);
		},50);
	}
}

var connectRelease=function(connection){
	connectionsList.push(connection);
}
/**
 * Returns the collection on the selected database
 */
var collection = function(name,db){
//    if (!connected) {
//      throw new Error('Must connect to Mongo before calling "collection"');
//    } 
	console.log("name",name);
    return db.collection(name);
};
/**
 * Returns the collection search results
 */
exports.findData=function(collName,queryParam,callback){
	console.log("\nQuery parameter in find:"+queryParam);
	  try{
		  connectFromPool(function(connection){
			  console.log("Connect from pool ");
              var coll = collection(collName,connection);
              console.log("collection from connection",coll);
              coll.findOne(queryParam, function (err, result) {
            	  connectRelease(connection);
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
		  connectFromPool(function(connection){
			  console.log("Connect from pool ");
              var coll = collection(collName,connection);
              coll.update({"email":queryParam.email},queryParam,{upsert:true}, function (err, result) {
            	  connectRelease(connection);
//              coll.insertOne(queryParam, {upsert:"true"},function (err, result) {
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
exports.updateData=function(collName,queryParam,callback){
	  try{
       	connect(mongoURL, function(){
           console.log('Connected to mongo in insert at: ' + mongoURL);
           var coll = collection(collName);
//            coll.update({"email":queryParam.email},queryParam,{upsert:"true"}, function (err, result) {
           coll.findOneAndUpdate(queryParam, {$set:{"star":1}},{upsert:"true"},function (err, result) {
               if (result) {
                   callback(null,result);
               } else {
             	  console.log("error in update",err);
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
         coll.remove(queryParam,{upsert:"true"}, function (err, result) {
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
exports.createConnectionPool = createConnectionPool;
exports.connectionList = connectionsList;