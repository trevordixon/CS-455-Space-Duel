var express = require('express'),
	browserify = require('browserify-middleware');

var app = express();

app.get('/js/main.js', browserify('./public/js/main.js', {
	external: ['three'],
	detectGlobals: false
}));

app.get('/js/three.js', browserify(['three'], {
	noParse: ['three'],
	cache: true,
	debug: false
}));

app.use(express.static(__dirname + '/public'));

app.listen(8030);
console.log('Listening on port 8030');
