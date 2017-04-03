var express = require('express');
var router = express.Router();

router.get('/readme', function(req, res){
  res.send('this is chat room using mqtt');
});

module.exports = router;
