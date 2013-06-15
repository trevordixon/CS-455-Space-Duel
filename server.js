var _ = require('underscore'),
	express = require('express'),
	browserify = require('browserify-middleware'),
	pserver = new require('peer').PeerServer({port: 9000});

var app = express();
app.engine('html', require('ejs').renderFile);

var bundleModules = ['three', 'underscore', 'events'];

app.get('/js/main.js', browserify('./src/main.js', {
	external: bundleModules,
	detectGlobals: false
}));

app.get('/js/bundle.js', browserify(bundleModules, {
	noParse: bundleModules,
	cache: true,
	debug: false
}));

app.get('/', function(req, res) {
	var id = Math.random().toString(36).substring(10),
		partner;

	var clients = pserver._clients.peerjs;

	for (var _id in clients) {
		if (clients[_id].partner === undefined) {
			clients[_id].partner = id;
			partner = _id;
			break;
		}
	}

	res.render(__dirname + '/views/index.html', {
		id: id,
		partner: partner
	});
});

app.use(express.static(__dirname + '/public'));

app.listen(8030);
console.log('Listening on port 8030');