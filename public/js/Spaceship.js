var THREE = require('three'),
	geometry = require('./models/jetGeometry.js').geometry;

geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

function Spaceship(color, gamepad, scene) {
	this.color = color;
	this.gamepad = gamepad;
	this.velocity = new THREE.Vector3(5, -5, 0);

	this.mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: color }));
	this.mesh.eulerOrder = 'YXZ';

	this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
	this.camera.position.set(0, 0, -800);
	this.camera.rotation.set(0, Math.PI, 0);
	this.mesh.add(this.camera);

	scene.add(this.mesh);

	this.arrowHelper = new THREE.ArrowHelper(
		this.getDirection(),
		this.mesh.position,
		100,
		0xFFFFFF
	);

	this.mesh.scale.set(.4, .4, .4);
	this.mesh.position.set(500, 500, 0);
}

var sunPosition = new THREE.Vector3(0, 0, 0);

Spaceship.prototype = {
	yaw: 0,
	pitch: 0,

	setGamepad: function(gamepad) {
		this.gamepad = gamepad;
		return this;
	},

	getDirection: function() {
		return new THREE.Vector4(0, 0, 1, 0).applyMatrix4(this.mesh.matrixWorld).normalize();
	},

	tick: function(time) {
		var r = this.mesh.position.distanceTo(sunPosition);
		var a = new THREE.Vector3().subVectors(sunPosition, this.mesh.position).normalize().multiplyScalar(.3 / r*r);
		this.velocity.add(a);

		if (this.gamepad) {
			var axes = this.gamepad.axes;

			this.yaw -= axes[3]/10;
			this.pitch -= axes[2]/10;

			this.mesh.rotation.set(this.yaw, this.pitch, 0);

			var dir = this.getDirection();
			this.velocity.add(dir.multiplyScalar(this.gamepad.buttons[6] * .15));
		}

		this.mesh.position.add(this.velocity);
	}
};

module.exports = Spaceship;