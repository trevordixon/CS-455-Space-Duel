var THREE = require('three'),
	Spaceship = require('./Spaceship.js'),
	Bullet = require('./Bullet.js');

var gamepad = navigator.webkitGetGamepads()[0];

var scene = new THREE.Scene();

// renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

require('./addLight.js')(scene);

// camera
var camera,
	mainCamera = camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);

var p1 = new Spaceship(0x555555, gamepad, scene);

var sun = new THREE.Mesh(new THREE.SphereGeometry(50, 50, 16), new THREE.MeshLambertMaterial({
	color: 'yellow' 
}));
sun.overdraw = true;
sun.rotation.x = Math.PI * 0.1;
scene.add(sun);

require('./createStars.js')(scene);

var cameraXAngle = 0, cameraYAngle = Math.PI/2, cameraDistance = 1200;

var gravityObjects = [p1];

var lastTime = 0;
var prevButton11 = 0,
	prevButton7 = false;
function animate(){
	// update
	var time = (new Date()).getTime();
	var timeDiff = time - lastTime;

	lastTime = time;

	gravityObjects.forEach(function(obj) {
		obj.tick(time);
	});

	require('./checkForGamepad.js')(function(_gamepad) {
		gamepad = _gamepad;
		p1.setGamepad(_gamepad);
	});

	if (gamepad) {
		var axes = gamepad.axes,
			buttons = gamepad.buttons;

		if (buttons[4]) {
			cameraDistance += axes[1] * 20;
		} else {
			cameraYAngle += axes[1]/100;
		}

		cameraXAngle += axes[0]/100;

		if (buttons[11] && buttons[11] != prevButton11) {
			camera = camera == p1.camera ? mainCamera : p1.camera;
		}

		prevButton11 = buttons[11];

		if (buttons[7] > 0.3 && prevButton7 == false) {
			var bullet = new Bullet(p1, scene);
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