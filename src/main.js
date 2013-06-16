var cookie = require('./lib/cookie-monster');

var id = cookie.get('id'),
	partner = cookie.get('partner'),
	conn,
	peer = new Peer(window.id, {host: 'localhost', port: 9000}),
	game = require('./game');

peer.on('connection', function(_conn) {
	startGame();
	conn = _conn;
	conn.on('data', game.updatePartnerState);
});

if (partner) {
	conn = peer.connect(partner);

	conn.on('open', function() {
		startGame();
	});

	conn.on('data', game.updatePartnerState);
}

function startGame() {
	$(document.body)
		.removeClass('disconnected')
		.addClass('connected');

	setInterval(function() {
		if (conn) conn.send(game.getState());
	}, 10);

	game.play();
}