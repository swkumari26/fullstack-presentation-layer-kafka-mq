var connection =  new require('./kafka/Connection')
	,controller = require('./services/controller')
	,mongo = require('./services/mongo')

var consumer_login = connection.getConsumer('login_topic')
	,consumer_signUp = connection.getConsumer('signUp_topic')
	,consumer_uploadFile = connection.getConsumer('upload_topic')
	,consumer_createFolder = connection.getConsumer('createFolder_topic')
	,consumer_deleteContent = connection.getConsumer('deleteContent_topic')
	,consumer_markStar = connection.getConsumer('markStar_topic')
	,consumer_createGroup = connection.getConsumer('createGroup_topic')
	,consumer_deleteGroup = connection.getConsumer('deleteGroup_topic')
	,consumer_addMember = connection.getConsumer('addMember_topic')
	,consumer_removeMember = connection.getConsumer('removeMember_topic')
	,consumer_shareContent = connection.getConsumer('shareContent_topic')
	,producer = connection.getProducer();
mongo.createConnectionPool();

console.log('server is running');
consumer_login.on('message', function (message) {
	console.log("login consumer called");
    var data = JSON.parse(message.value);
    console.log("data to controller",data);
    controller.login(data.data, function(err,res){
    	console.log("response value sent frm login",res.value);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log('here in kafka send',data);
        });
        return;
    });
});
consumer_signUp.on('message', function (message) {
	console.log("sign up consumer called");
    var data = JSON.parse(message.value);
    console.log("msg received",data);
    controller.signUp(data.data, function(err,res){
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log('here in kafka send',data);
        });
        return;
    });
});

consumer_createFolder.on('message', function (message) {
	console.log("create folder consumer called");
    var data = JSON.parse(message.value);
    console.log("msg received",data);
    controller.createFolder(data.data, function(err,res){
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log('here in kafka send',data);
        });
        return;
    });
});

consumer_uploadFile.on('message', function (message) {
	console.log("upload file consumer called");
    var data = JSON.parse(message.value);
    console.log("msg received",data);
    controller.uploadFile(data.data, function(err,res){
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log('here in kafka send',data);
        });
        return;
    });
});

consumer_deleteContent.on('message', function (message) {
	console.log("delete file consumer called");
    var data = JSON.parse(message.value);
    console.log("msg received",data);
    controller.deleteContent(data.data, function(err,res){
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log('here in kafka send',data);
        });
        return;
    });
});

consumer_markStar.on('message', function (message) {
	console.log("mark star consumer called");
    var data = JSON.parse(message.value);
    console.log("msg received",data);
    controller.markStar(data.data, function(err,res){
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log('here in kafka send',data);
        });
        return;
    });
});
consumer_createGroup.on('message', function (message) {
	console.log("create group consumer called");
    var data = JSON.parse(message.value);
    console.log("data to controller",data);
    controller.createGroup(data.data, function(err,res){
    	console.log("response value sent frm create group",res.value);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log('here in kafka send',data);
        });
        return;
    });
});
consumer_deleteGroup.on('message', function (message) {
	console.log("create group consumer called");
    var data = JSON.parse(message.value);
    console.log("data to controller",data);
    controller.deleteGroup(data.data, function(err,res){
    	console.log("response value sent frm create group",res.value);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log('here in kafka send',data);
        });
        return;
    });
});
consumer_addMember.on('message', function (message) {
	console.log("create group consumer called");
    var data = JSON.parse(message.value);
    console.log("data to controller",data);
    controller.addMember(data.data, function(err,res){
    	console.log("response value sent frm create group",res.value);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log('here in kafka send',data);
        });
        return;
    });
});
consumer_removeMember.on('message', function (message) {
	console.log("create group consumer called");
    var data = JSON.parse(message.value);
    console.log("data to controller",data);
    controller.removeMember(data.data, function(err,res){
    	console.log("response value sent frm create group",res.value);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log('here in kafka send',data);
        });
        return;
    });
});
consumer_shareContent.on('message', function (message) {
	console.log("share content consumer called");
    var data = JSON.parse(message.value);
    console.log("data to controller",data);
    controller.shareContent(data.data, function(err,res){
    	console.log("response value sent frm create group",res.value);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log('here in kafka send',data);
        });
        return;
    });
});