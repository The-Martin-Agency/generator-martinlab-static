/*************************************
//
// <%= projectName %> app
// <%= projectDescription %>
// by: <%= author %>
//
**************************************/

// express magic
var express = require('express');
var app = express();
var server = require('http').createServer(app);

var runningPortNumber = process.env.PORT || <%= runningPortNumber %>;


app.configure(function(){
	// I need to access everything in '/build' directly
	app.use(express.static(__dirname + '/build'));
});


// logs every request
app.use(function(req, res, next){
	// output every request in the array
	console.log({method:req.method, url: req.url});

	// goes onto the next function in line
	next();
});

server.listen(runningPortNumber);
console.log("Server running at localhost:" + runningPortNumber);
