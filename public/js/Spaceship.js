var THREE = require('three'),
	geometry = require('./models/jetGeometry.js').geometry;

function Spaceship(color, gamepad, scene) {
	this.color = color;
	this.gamepad = gamepad;
	this.velocity = new THREE.Vector3(2, -5, -2);

	this.mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 0x555555 }));

	scene.add(this.mesh);

	this.mesh.scale.set(.4,.4,.4);
	this.mesh.position.set(70,70,70);
}

Spaceship.prototype.setGamepad = function(gamepad) {
	this.gamepad = gamepad;
	return this;
}

Spaceship.prototype.setVelocity = function(velocity) {
	this.velocity = velocity;
	return this;
};

var sunPosition = new THREE.Vector3(0, 0, 0);
Spaceship.prototype.tick = function(time, camera) {
	var r = this.mesh.position.distanceTo(sunPosition);
	var a = new THREE.Vector3().subVectors(sunPosition, this.mesh.position).normalize().multiplyScalar(.1/r*r);
	this.velocity.add(a);
	this.mesh.position.add(this.velocity);

	var axes = this.gamepad.axes;
	this.mesh.rotation.set(
		this.mesh.rotation.x + axes[3]/10,
		this.mesh.rotation.y - axes[2]/10,
		this.mesh.rotation.z
	);

};

module.exports = Spaceship;