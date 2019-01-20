var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var request = require('request');
var rawData = fs.readFileSync('../data/crimedataua.json').toString().replace(/'/g,'"');
rawData = JSON.parse(rawData);
var app = express();
app.use(bodyParser.json({extended: true}));
app.set('views', '../frontend/SafeStroll');
app.set('view engine', 'pug');
console.log("server starting");

/*
endpoint to verify server actually up
*/

app.get('/test',function(req,res){
	console.log("got here");
	return res.status(200).json({"message": "connected"});
});

/*
endpoint to send data to client
*/

app.post('/get_route',function(req,res){
    console.log('get route called');
    console.log(req.body);
    //so we can test frontend locally
    res.set('Access-Control-Allow-Origin', '*');
    //expect data to be formatted [lat,long,weight]
    res.status(200).json({'points': rawData['data'].slice(0,5)});
});

/*
endpoint to serve frontent
*/
app.get('/app',function(req,res){
    res.render('index', {'title': 'strollSafe'});
});

app.listen(9190);

module.exports = app;