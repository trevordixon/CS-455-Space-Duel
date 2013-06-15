var THREE = require('three');

module.exports = function(scene) {
	var directionalLight1 = new THREE.DirectionalLight(0xffffff);
	directionalLight1.position.set(0, 0, 10).normalize();
	scene.add(directionalLight1);

	var directionalLight2 = new THREE.DirectionalLight(0xffffff);
	directionalLight2.position.set(0, 0, -10).normalize();
	scene.add(directionalLight2);

	var pointLight = new THREE.PointLight(0xffffff, 1, 1);
	pointLight.position.set(0, 0, 0);
	scene.add(pointLight);

	var ambientLight = new THREE.AmbientLight(0x333333);
	scene.add(ambientLight);
};