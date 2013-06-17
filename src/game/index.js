var THREE = require('three');

var spaceship, partner;

module.exports = {
	play: function() {
		var THREE = require('three'),
			Spaceship = require('./Spaceship.js'),
			Bullet = require('./Bullet.js'),
			gpManager = require('./gamepadManager.js');

		var scene = new THREE.Scene();

		// renderer
		var renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);

		require('./addLight.js')(scene);

		// camera
		var camera,
			mainCamera = camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);

		spaceship = new Spaceship(0x555555, scene);
		partner = new Spaceship(0xFF1111, scene);

		var sun = new THREE.Mesh(new THREE.SphereGeometry(50, 50, 16), new THREE.MeshLambertMaterial({
			color: 'yellow' 
		}));
		sun.overdraw = true;
		sun.rotation.x = Math.PI * 0.1;
		scene.add(sun);

		require('./createStars.js')(scene);

		var cameraXAngle = 0, cameraYAngle = Math.PI/2, cameraDistance = 1200;

		var gravityObjects = [spaceship];

		var lastTime = 0;
		var prevButton11 = 0,
			prevButton7 = false;
		function animate(){
			// update
			var time = (new Date()).getTime();
			var timeDiff = time - lastTime;

			lastTime = time;

			gravityObjects.forEach(function(obj, i) {
				if (obj._remove) return gravityObjects.splice(i, 1);
				obj.tick(time);
			});

			if (gpManager.gamepad) {
				var gamepad = gpManager.gamepad,
					axes = gamepad.axes,
					buttons = gamepad.buttons;

				if (camera == mainCamera) {
					if (buttons[4]) {
						cameraDistance += axes[1] * 20;
					} else {
						cameraYAngle += axes[1]/100;
					}

					cameraXAngle += axes[0]/100;
				}

				if (buttons[11] && buttons[11] != prevButton11) {
					if (camera == mainCamera) {
						camera = spaceship.camera;
						spaceship.watchForJoystickRoll();
					} else {
						camera = mainCamera;
						spaceship.dontWatchForJoystickRoll();
					}
				}

				prevButton11 = buttons[11];

				if (buttons[7] > 0.3 && prevButton7 == false) {
					var bullet = new Bullet(spaceship, scene);
					gravityObjects.push(bullet);
				}

				prevButton7 = buttons[7] > 0.3;
			}

			mainCamera.position.set(
				cameraDistance * Math.sin(cameraXAngle),
				cameraDistance * Math.cos(cameraYAngle),
				cameraDistance * Math.cos(cameraXAngle)
			);

			mainCamera.lookAt(sun.position);

			renderer.render(scene, camera);
			requestAnimationFrame(animate);
		}

		animate();
	},

	getState: function() {
		var p = spaceship.mesh.position,
			v = spaceship.velocity,
			q = spaceship.mesh.quaternion,
			eulerOrder = spaceship.mesh.eulerOrder;

		return {
			position: {x: p.x, y: p.y, z: p.z},
			velocity: {x: v.x, y: v.y, z: v.z},
			quaternion: {x: q.x, y: q.y, z: q.z, w: q.w},
			eulerOrder: eulerOrder
		}
	},

	updatePartnerState: function(state) {
		with (state) {
			partner.mesh.position.set(position.x, position.y, position.z);
			partner.mesh.rotation.setEulerFromQuaternion(
				new THREE.Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w),
				eulerOrder
			);
			partner.velocity.set(velocity.x, velocity.y, velocity.z);
		}
	}
}