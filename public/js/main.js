var THREE = require('three'),
	Spaceship = require('./Spaceship.js');

var gamepad = navigator.webkitGetGamepads()[0];
var scene = new THREE.Scene();
var p1 = new Spaceship('red', gamepad, scene);

var directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(10, 0, 10).normalize();
scene.add(directionalLight);

var ambientLight = new THREE.AmbientLight(0x111111);
scene.add(ambientLight);

var sun = new THREE.Mesh(new THREE.SphereGeometry(50, 50, 16), new THREE.MeshLambertMaterial({
	color: 'yellow' 
}));
sun.overdraw = true;
sun.rotation.x = Math.PI * 0.1;
scene.add(sun);

require('./createStars.js')(scene);

// this function is executed on each animation frame
var cameraXAngle = 0, cameraYAngle = Math.PI/2, cameraDistance = 800;


var lastTime = 0;
function animate(){
	// update
	var time = (new Date()).getTime();
	var timeDiff = time - lastTime;

	lastTime = time;

	p1.tick(time, camera);

	// render
	renderer.render(scene, camera);

	require('./checkForGamepad.js')(function(_gamepad) {
		gamepad = _gamepad;
		p1.setGamepad(_gamepad);
	});

	if (gamepad) {
		var axes = gamepad.axes;

		cameraXAngle += axes[0]/100;
		cameraYAngle += axes[1]/100;

		camera.position.set(
			cameraDistance * Math.sin(cameraXAngle),
			cameraDistance * Math.cos(cameraYAngle),
			cameraDistance * Math.cos(cameraXAngle)
		);

		camera.rotation.y = cameraXAngle;
		camera.rotation.x = Math.PI/2 + cameraYAngle;

		//console.log(500 * Math.sin(cameraXAngle), 0, 500 * Math.cos(cameraXAngle));
	}

	// request new frame
	requestAnimationFrame(animate);

}

// renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// camera
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);

animate();