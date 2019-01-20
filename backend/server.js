var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var request = require('request');
var requirejs = require('requirejs');
//was going to implement our own but turns out somebody made one already
//no need to reinvent the wheel

//generate graph and kd-tree here
var rawData = fs.readFileSync('../data/bikelightcrimedata.json').toString().replace(/'/g,'"');
rawData = JSON.parse(rawData);
var graphList;
var pointTree;
var app = express();
app.use(bodyParser.json({extended: true}));
app.use('/app', express.static('../frontend/SafeStroll'));

//enable CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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
    console.log(JSON.stringify(req.body));
    var origin = {'lat': req.body.originLat, 'long': req.body.originLng}
    var destination = {'lat': req.body.destLat, 'long': req.body.destLng}

    //expect data to be formatted [lat,long,weight]
    //res.status(200).json({'points': [[32,-110,1],[,32.1,-110,0.1]]});
    res.status(200).json(safestRoute(origin, destination, graphList));
});

/*
endpoint to send subset of data set to frontend for heatmap
*/




requirejs(['node_modules/kd-tree-javascript/kdTree.js'], function (ubilabs) {

    graphList = generateGraphList(rawData.data);
    pointTree = generateTree(graphList, ubilabs);
    generateGraph(graphList);

    console.log("server starting");
});

/*
generate grid-shaped graph using raw data points
returns lists of nodes
*/
function generateGraphList(data){
    var nodeList = [];

    //parse list of points into nodes
    for(point of data){
        nodeList.push(new Node(point));
    }

    //connect nodes to their four closest neighbors
    //yes this is super inefficient but also I'm trying to get a new 
    return nodeList;
}

/*
connect nodes into grid
*/
function generateGraph(graphList){
    for(node of graphList){
        for(point of adjascentPoints(node)){
            node.edges.push(point[0]);
        }
    }
}

/*
generates kd tree that stores references to nodes in graph based off of
latitude/longitude
*/

function generateTree(nodeList, ubilabs){
    returnTree = new ubilabs.kdTree(nodeList, function(pointA, pointB){
        //don't care about sqrt since it's comparative anyway
        return Math.pow(pointA.lat - pointB.lat, 2) +  Math.pow(pointA.long - pointB.long, 2);
    }, ["lat", "long"]);

    console.log("tree generated. Balance factor: " + returnTree.balanceFactor());
    
    return returnTree;
}

/*
calculates route to take
*/

function safestRoute(origin, destination, layerList){
    console.log('safestRoute');
    var nearestOrigin = nearestNode(origin);
    console.log(nearestOrigin)
    var nearestDestination = nearestNode(destination)
    console.log(nearestDestination)
    return JSON.stringify({"points": dijkstraSearch(nearestOrigin, nearestDestination, layerList)});
}

/*
calculates nearest node to coordinate in form {lat: long:}
turns out kdTree package has this built in
*/

function nearestNode(point){
    console.log('nearestNode');
    return pointTree.nearest(point,1)[0][0];
}

/*
calculates nearest four points to coordinate
turns out kdTree package has this built in
*/

function adjascentPoints(point){
    return pointTree.nearest(point,4);
}

/*
Node for graph prototype
*/

function Node(data){
    this.lat = data.latitude;
    this.long = data.longitude;
    this.weights = {
        crimeweight: data.crimeweight, 
        lightweight: data.lightweight
    };
    this.distance = Infinity;
    this.edges = [];
}

/*
uses dijkstra's algorithm to search for shortest (safest) path
originRef and destinationRef are Node objects
layerList is list of keys that we care about for json
*/
function dijkstraSearch(originRef, destinationRef, layerList){
    //TODO Noah will do this
    console.log('dijkstraSearch');
    console.log(originRef);
    console.log(destinationRef);
    return lerp(originRef, destinationRef, {}, 1);
}

/*
placeholder while we work on searching
resolution is points per 0.0003 degree (one grid)
jk just gonna do two points
*/
function lerp(originRef, destinationRef, layerList, resolution){
    console.log('lerp');
    var returnList = [[originRef.lat, originRef.long],[destinationRef.lat, destinationRef.long]];
    /*var distance = Math.sqrt(Math.abs(Math.pow(originRef.lat - destinationRef.lat, 2) +  Math.pow(originRef.long - destinationRef.long, 2)))
    var i = 0;
    for(i = 0; i < distance*resolution/0.0003; ++i){
        let lerpPoint = [];
        let tempNode = nearestNode()
        returnList.push([,,]);
    }*/
    console.log(returnList);
    return returnList;
}

app.listen(9190);

module.exports = app;