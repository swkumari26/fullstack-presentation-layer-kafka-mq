var connection =  new require('./kafka/Connection')
	,controller = require('./services/controller');

var consumer_login = connection.getConsumer('login_topic');
var consumer_signUp = connection.getConsumer('signUp_topic');
var producer = connection.getProducer();

console.log('server is running');
consumer_login.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    controller.login(data.data, function(err,res){
        console.log('after handle'+res);
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
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    controller.signUp(data.data, function(err,res){
        console.log('after handle'+res);
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

