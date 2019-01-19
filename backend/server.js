var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var request = require('request');
var rawData = fs.readFileSync('./test.csv').toString();
rawData = JSON.parse(rawData);
var app = express();
app.use(bodyParser.json({extended: true}));

console.log("server starting");

app.get('/test',function(req,res){
	console.log("got here");
	return res.status(200).json({"message": "connected"});
});

app.post('/get_route',function(req,res){
    console.log('get route called')
    res.set('Access-Control-Allow-Origin', '*');
    res.status(200).json({'points': rawData['data'][0].slice(0,5)});
});

app.listen(9190);

module.exports = app;