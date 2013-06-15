module.exports = function(cb) {
	var gamepads = navigator.webkitGetGamepads();
	for (var i = 0; i < gamepads.length; i++) {
		if (gamepads[i] && gamepads[i].buttons[0]) {
			cb(gamepads[i]);
			break;
		}
	}
};