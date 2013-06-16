var id = monster.get('id'),
	partner = monster.get('partner'),
	conn,
	peer = new Peer(window.id, {host: 'localhost', port: 9000}),
	game = require('./game');

peer.on('connection', function(conn) {
	startGame();
});

if (partner) {
	conn = peer.connect(partner);
	conn.on('open', function() {
		startGame();
	});
}

function startGame() {
	$(document.body)
		.removeClass('disconnected')
		.addClass('connected');
	game.play();
}