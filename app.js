var express = require('express');
var app = express();
var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://test.mosca.io');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var path = require('path');
var PORT = 8000;
var router = require('./router/index.js');

app.listen(8000, function(){
  console.log("listening PORT " + PORT);
});

app.use(urlencodedParser);
app.use('/static', express.static('./static'));
app.use('/', router);

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '/view', 'index.html'));
});

client.on('connect', function(){
  client.subscribe('3202');
  client.publish('3202', 'hello');
});

client.on('message', function(topic, message){
  if (topic === '3202')
    console.log(message.toString());
});
