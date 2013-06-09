var THREE = require('three'),
	geometry = require('./models/jetGeometry.js').geometry;

function Spaceship(color, gamepad, scene) {
	this.color = color;
	this.gamepad = gamepad;
	this.velocity = new THREE.Vector3(2, -5, -2);

	this.mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: color }));

	this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
	this.camera.position.y = 800;
	this.camera.position.z = 200;
	this.camera.rotation.y = Math.PI;
	this.camera.rotation.x = Math.PI/2;
	this.mesh.add(this.camera);

	scene.add(this.mesh);

	this.mesh.scale.set(.4,.4,.4);
	this.mesh.position.set(200, 200, 200);
}

var sunPosition = new THREE.Vector3(0, 0, 0);

Spaceship.prototype = {
	setGamepad: function(gamepad) {
		this.gamepad = gamepad;
		return this;
	},

	tick: function(time) {
		var r = this.mesh.position.distanceTo(sunPosition);
		var a = new THREE.Vector3().subVectors(sunPosition, this.mesh.position).normalize().multiplyScalar(.1 / r*r);
		this.velocity.add(a);
		this.mesh.position.add(this.velocity);

		var axes = this.gamepad.axes;
		this.mesh.rotation.set(
			this.mesh.rotation.x + axes[3]/10,
			this.mesh.rotation.y - axes[2]/10,
			this.mesh.rotation.z
		);
	}
};

module.exports = Spaceship;