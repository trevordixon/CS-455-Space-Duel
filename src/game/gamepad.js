var checkForGamepad = require('./checkForGamepad.js');

var i = 0, disabled = false;
module.exports = {
	get: function() {
		if (disabled) return;
		return navigator.webkitGetGamepads()[i];
	}
};

setInterval(function() {
	var _i = checkForGamepad();
	if (_i !== undefined) i = _i;
}, 100);

window.addEventListener('focus', function() {
	disabled = false;
});

window.addEventListener('blur', function() {
	disabled = true;
});