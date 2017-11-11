var fs = require('fs')
	,path = require('path')
	,rootPath = path.join(__dirname+'../dropbox/');

var walkDir = function(dir, callback) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) {return callback(err,null);}
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) {return callback(null, results);}
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
        	results.push(file);
          walkDir(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

exports.walkUserDir = function(dir,callback){
	var resultsSharedFinal = [];
	var directoryName = path.join(__dirname,'..','dropbox');
		walkDir(path.join(directoryName,''+dir),function(err,results){
						if(err) {console.log("error is:",err);callback(err,null);}
						else
						{	
						var NewdirectoryName = path.join(directoryName,''+dir);
						NewdirectoryName = NewdirectoryName.replace(/\\\\/g, '\\');
						for (var i=0;i<results.length;i++)
						{	
							results[i] = results[i].replace(/\\\\/g, '\\');
							results[i] = results[i].replace(NewdirectoryName+'/','');
						}						
							callback(null,results)
						}
				});
};