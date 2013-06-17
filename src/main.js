var _ = require('underscore'),
	cookie = require('./lib/cookie-monster');

var id = cookie.get('id'),
	partner = cookie.get('partner'),
	conn,
	peer = new Peer(id, {host: document.location.hostname, port: 9000}),
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
	});

	conn.on('data', handlePeerData);
}

function startGame() {
	$(document.body)
		.removeClass('disconnected')
		.addClass('connected');

	game.play();

	setInterval(function() {
		if (conn) conn.send(game.getState());
	}, 16);
}

function otherPerson(who) { return (who === 'you') ? 'them' : 'you'; }

function handlePeerData(data) {
	switch(data.event) {
		case 'state':
			game.updatePartnerState(data);
			break;
		case 'hit':
			incScore(otherPerson(data.who));
			break;
		case 'bullet':
			game.enemyBullet(data);
			break;
	}
}

function incScore(who) {
	var $el = (who === 'you') ? $('.my-score') : $('.their-score');
	$el.text(1*$el.text()+1);
}

game.on('hit', function(who) {
	incScore(otherPerson(who));
	conn.send({
		event: 'hit',
		who: otherPerson(who)
	});
});

game.on('bullet', function(bullet) {
	var p = bullet.mesh.position,
		v = bullet.velocity;
	
	conn.send({
		event: 'bullet',
		position: {x: p.x, y: p.y, z: p.z},
		velocity: {x: v.x, y: v.y, z: v.z}
	});
});