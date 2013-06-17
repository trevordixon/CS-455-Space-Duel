var THREE = require('three'),
	_ = require('underscore'),
	geometry = require('./models/jetGeometry.js').geometry,
	gamepad = require('./gamepad.js'),
	GravityObject = require('./GravityObject.js');

require('./FlyControls.js');

geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

function Spaceship() {
	this._initialize.apply(this, arguments);
}

var sunPosition = new THREE.Vector3(0, 0, 0);

_.extend(Spaceship.prototype, GravityObject.prototype, {
	mass: 0.05,
	yaw: 0,
	pitch: 0,

	_initialize: function(color, scene, nocontrol) {
		this.color = color;
		this.velocity = new THREE.Vector3(5, -5, 0);

		this.mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: color }));

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

		if (nocontrol) return;
		this.controls = new THREE.FlyControls(this.mesh);
		this.controls.movementSpeed = 1000;
		this.controls.rollSpeed = Math.PI / 24;
		this.controls.autoForward = false;
		this.controls.dragToLook = false;
	},

	getDirection: function() {
		return new THREE.Vector4(0, 0, 1, 0).applyMatrix4(this.mesh.matrixWorld).normalize();
	},

	tick: function(time) {
		var gp = gamepad.get();
		if (gp) {
			var axes = gp.axes;

			this.yaw -= axes[3]/10;
			this.pitch -= axes[2]/10;

			this.mesh.rotation.set(this.yaw, this.pitch, 0);

			var dir = this.getDirection();
			var thrust = gp.buttons[6] * .15;
			if (thrust > 0){
				var thrustAudio  = new Audio();
				var thrustSrc  = document.createElement("source");
				thrustSrc.type = "audio/mpeg";
				thrustSrc.src  = "../../sounds/thrust.mp3";
				console.log(thrustSrc.src);
				thrustAudio.appendChild(thrustSrc);
				thrustAudio.volume = .05;
				thrustAudio.play();
			}
			this.velocity.add(dir.multiplyScalar(gp.buttons[6] * .15));
		}

		this.controls.update(0.2);
		GravityObject.prototype.tick.apply(this, arguments);
	},

	watchForJoystickRoll: function() {
		this.controls._watchForJoystickRoll = true;
	},

	dontWatchForJoystickRoll: function() {
		this.controls._watchForJoystickRoll = false;
	}
});

module.exports = Spaceship;