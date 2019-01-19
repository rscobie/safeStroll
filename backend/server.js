var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var request = require('request');
var data = fs.readFileSync('./test.csv').toString();
var app = express();
app.use(bodyParser.json({extended: true}));

console.log("server starting");

app.get('/test',function(req,res){
	console.log("got here");
	return res.status(200).json({"message": "connected"});
});

app.post('/get_route',function(req,res){
    console.log(data)
    res.status(200).json({'points': data});
});

app.listen(9190);

module.exports = app;