var disabled = false;
module.exports = {
	get: function() {
		if (disabled) return;
		return navigator.webkitGetGamepads()[0];
	}
};

window.addEventListener('focus', function() {
	disabled = false;
});

window.addEventListener('blur', function() {
	disabled = true;
});