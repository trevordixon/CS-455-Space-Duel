module.exports = {
	gamepad: navigator.webkitGetGamepads()[0]
};

setInterval(function() {
	require('./checkForGamepad.js')(function(gamepad) {
		module.exports.gamepad = gamepad;
	});
}, 50);