var _ = require('underscore'),
	cookie = require('./lib/cookie-monster');

var id = cookie.get('id'),
	partner = cookie.get('partner'),
	conn,
	peer = new Peer(id, {host: 'localhost', port: 9000}),
	game = require('./game');

// Somebody else connected to me
peer.on('connection', function(_conn) {
	startGame();
	conn = _conn;
	conn.on('data', handlePeerData);
});

// Connect to somebody else
if (partner) {
	conn = peer.connect(partner);

	conn.on('open', function() {
		startGame();
		sendState();
	});

	conn.on('data', handlePeerData);
}

function startGame() {
	$(document.body)
		.removeClass('disconnected')
		.addClass('connected');

	game.play();
}

function handlePeerData(data) {
	game.updatePartnerState(data);
	sendState();
}

var sendState = _.throttle(function() {
	conn.send(game.getState());
}, 30);