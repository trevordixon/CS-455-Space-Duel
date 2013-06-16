var gamepad;
module.exports = {
	gamepad: navigator.webkitGetGamepads()[0]
};

setInterval(function() {
	require('./checkForGamepad.js')(function(_gamepad) {
		gamepad = _gamepad;
		module.exports.gamepad = _gamepad;
	});
}, 50);

window.addEventListener('focus', function() {
	module.exports.gamepad = gamepad;
});

window.addEventListener('blur', function() {
	module.exports.gamepad = undefined;
});