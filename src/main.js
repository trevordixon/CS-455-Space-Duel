var id = monster.get('id'),
	partner = monster.get('partner'),
	conn,
	peer = new Peer(window.id, {host: 'localhost', port: 9000});

peer.on('connection', function(conn) {
	conn.on('data', function(data){
		console.log(data);
	});
});

if (partner) {
	conn = peer.connect(partner);
	conn.on('open', function() {
		conn.send('Howdy partner.');
	});
}

require('./game');