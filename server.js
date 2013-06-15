var express = require('express'),
	browserify = require('browserify-middleware');

var app = express();

var bundleModules = ['three', 'underscore', 'events'];

app.get('/js/main.js', browserify('./public/js/main.js', {
	external: bundleModules,
	detectGlobals: false
}));

app.get('/js/bundle.js', browserify(bundleModules, {
	noParse: bundleModules,
	cache: true,
	debug: false
}));

app.get('/getPeerCode', function(req, res){

	var code = req["_parsedUrl"]["query"].split('&');
	// console.log(code)
	var params = {}
	for (key in code){
		var param = code[key].split('=');
		// console.log(param);
		params[param[0]] = param[1];
	}
	//console.log(req["_parsedUrl"]["query"]);
	var pc = peerCode(params);
	//console.log(pc);
	var resp = JSON.stringify(pc);
	//console.log(resp);
	res.write(resp);
	res.end();
})

app.use(express.static(__dirname + '/public'));

app.listen(8030);
console.log('Listening on port 8030');

var PeerServer = require('peer').PeerServer;
var pserver = new PeerServer({ port: 9000 });
console.log(pserver);

var playerOne = true;

function peerCode(code){
	// console.log(code);
	var response = {};
	if (playerOne){
		response["player"] = 1;
		playerOne = false;
	}else{
		response["player"] = 2;
		playerOne = true;
	}
	for(k in code){
		response[k] = code[k];
	}
	// console.log(response);
	return response;
}