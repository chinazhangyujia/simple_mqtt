var express = require('express');
var app = express();
var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://test.mosca.io');
//var client = mqtt.connect('tcp://broker.hivemq.com:1883');
//var client = mqtt.connect('localhost:1883');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var path = require('path');
var PORT = 8000;
var router = require('./router/index.js');
var server = app.listen(8000, function(){
  console.log("listening PORT " + PORT);
});

var io = require('socket.io')(server);

var mongoose = require('mongoose');
mongoose.connect('localhost:27017/mqtt_chat');
var Schema = mongoose.Schema;
var userDataSchema = new Schema({
  topic: String,
  content: String
});

var UserData = mongoose.model('mqtt_chat_room', userDataSchema);

app.use(urlencodedParser);
app.use('/static', express.static('./static'));
app.use('/', router);

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '/view', 'index.html'));
});

io.on('connection', function(socket){
  socket.on('create_room', function(data){
    client.subscribe(data);
    console.log('subscribe to ' + data);
    io.emit('room_information', data);
  });
});

client.on('message', function(topic, message){
  var new_message = {};
  new_message.topic = topic;
  new_message.content = message;

  var new_data = new UserData(new_message);
  new_data.save();
  console.log(new_data + ' is saved');
});
