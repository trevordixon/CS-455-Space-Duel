module.exports = function() {
	var gamepads = navigator.webkitGetGamepads();
	for (var i = 0; i < gamepads.length; i++) {
		if (gamepads[i] && gamepads[i].buttons[0]) {
			return i;
		}
	}
};