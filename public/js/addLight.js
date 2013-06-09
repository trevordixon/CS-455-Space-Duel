var THREE = require('three');

module.exports = function(scene) {
	var directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(10, 0, 10).normalize();
	scene.add(directionalLight);

	var ambientLight = new THREE.AmbientLight(0x111111);
	scene.add(ambientLight);
};