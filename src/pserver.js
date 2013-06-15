var pserver = new require('peer').PeerServer({ port: 9000 });

var playerOne = true;
function peerCode(code) {
	var player = playerOne ? 1 : 2;
	playerOne = !playerOne;
	
	return {
		player: player,
		code: code
	}
}

module.exports = function(app) {
	app.get('/getPeerCode', function(req, res) {
		req.query = require('querystring').parse(req.query());
		var code = req.query.code;
		res.send(peerCode(code));
	});
};