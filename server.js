var express = require('express'),
	browserify = require('browserify-middleware');

var app = express();

app.get('/js/main.js', browserify('./public/js/main.js', {
	external: ['three'],
	detectGlobals: false
}));

var bundleModules = ['three', 'underscore', 'events'];
app.get('/js/bundle.js', browserify(bundleModules, {
	noParse: bundleModules,
	cache: true,
	debug: false
}));

app.use(express.static(__dirname + '/public'));

app.listen(8030);
console.log('Listening on port 8030');

var PeerServer = require('peer').PeerServer;
var pserver = new PeerServer({ port: 9000 });