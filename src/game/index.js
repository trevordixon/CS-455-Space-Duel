var THREE = require('three'),
	EventEmitter = require('events').EventEmitter;

var spaceship, partner;

var game = new EventEmitter();

game.play = function() {
	var THREE = require('three'),
		Spaceship = require('./Spaceship.js'),
		Bullet = require('./Bullet.js'),
		gamepad = require('./gamepad.js');

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
	partner = new Spaceship(0xFF1111, scene, true);

	var sun = new THREE.Mesh(new THREE.SphereGeometry(80, 80, 16), new THREE.MeshLambertMaterial({
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
		var time = (new Date()).getTime(),
			timeDiff = time - lastTime;

		lastTime = time;

		gravityObjects.forEach(function(obj, i) {
			if (obj._remove) return gravityObjects.splice(i, 1);
			obj.tick(time);
			if (obj.checkCollision) {
				var collision = obj.checkCollision([spaceship, partner]);
				if (collision) game.emit('hit', collision === spaceship ? 'you' : 'them');
			}
		});

		// Main camera control
		var gp = gamepad.get();
		if (gp) {
			var axes = gp.axes,
				buttons = gp.buttons;

			if (camera === mainCamera) {
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
};

game.getState = function() {
	var p = spaceship.mesh.position,
		v = spaceship.velocity,
		r = spaceship.mesh.quaternion;

	return {
		event: 'state',
		position: {x: p.x, y: p.y, z: p.z},
		velocity: {x: v.x, y: v.y, z: v.z},
		rotation: {x: r.x, y: r.y, z: r.z}
	}
};

game.updatePartnerState = function(state) {
	with (state) {
		partner.mesh.position.set(position.x, position.y, position.z);
		partner.mesh.rotation.set(rotation.x, rotation.y, rotation.z);
		partner.velocity.set(velocity.x, velocity.y, velocity.z);
	}
};

module.exports = game;