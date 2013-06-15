var conn,
	peer = new Peer(window.id, {host: 'localhost', port: 9000});

peer.on('connection', function(conn) {
	conn.on('data', function(data){
		console.log(data);
	});
});

if (window.partner) {
	conn = peer.connect(window.partner);
	conn.on('open', function() {
		conn.send('Howdy partner.');
	});
}

require('./game');