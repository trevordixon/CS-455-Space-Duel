var THREE = require('three');

// revolutions per second
var angularSpeed = 0.2; 
var lastTime = 0;

// this function is executed on each animation frame
var velo = new THREE.Vector3(2, -5, -2);
var cameraXAngle = 0, cameraYAngle = Math.PI/2, cameraDistance = 800;

var gamepad = navigator.webkitGetGamepads()[0];
function animate(){
	// update
	var time = (new Date()).getTime();
	var timeDiff = time - lastTime;
	// var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
	// sun.rotation.y += angleChange;
	// sun.rotation.x += angleChange /4;
	lastTime = time;

	if (jet) {
		var r = jet.position.distanceTo(sun.position);
		var a = new THREE.Vector3().subVectors(sun.position, jet.position).normalize().multiplyScalar(.1/r*r);
		velo.add(a);
		jet.position.add(velo);
		//console.log(velo);
	}

	// render
	renderer.render(scene, camera);


	var gamepads = navigator.webkitGetGamepads();
	for (var i = 0; i < gamepads.length; i++) {
		                               // A button
		if (gamepads[i] && gamepads[i].buttons[0]) {
			gamepad = gamepads[i];
			break;
		}
	}

	if (gamepad) {
		var axes = gamepad.axes;
		//console.log(gamepad.axes);
		if (jet)
			jet.rotation.set(jet.rotation.x + axes[3]/10, jet.rotation.y - axes[2]/10, jet.rotation.z);

		cameraXAngle += axes[0]/100;
		cameraYAngle += axes[1]/100;

		camera.position.set(
			cameraDistance * Math.sin(cameraXAngle),
			cameraDistance * Math.cos(cameraYAngle),
//            0,
			cameraDistance * Math.cos(cameraXAngle));
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

// scene
var scene = new THREE.Scene();
					
// sun
var sun = new THREE.Mesh(new THREE.SphereGeometry(50, 50, 16), new THREE.MeshLambertMaterial({
	color: 'yellow' 
}));
sun.overdraw = true;
sun.rotation.x = Math.PI * 0.1;
scene.add(sun);

for(var i = 0; i < 500; i++){

	var star = new THREE.Mesh(new THREE.SphereGeometry(5, 5, 5), new THREE.MeshLambertMaterial({
		color: 'white' 
	}));
	star.position.x = (Math.random() -.5 )*((Math.random()*9000)+8050);
	star.position.y = (Math.random() -.5 )*((Math.random()*9000)+8050);
	star.position.z = (Math.random() -.5 )*((Math.random()*9000)+8050);

	scene.add(star);

}

// light
var directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(10, 0, 10).normalize();
scene.add(directionalLight);

var ambientLight = new THREE.AmbientLight(0x111111);
scene.add(ambientLight);

// loader
var loader = new THREE.JSONLoader(), jet;
loader.load('js/models/jet.json', function(geometry) {
jet = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 0x555555 }));
scene.add(jet);
jet.scale.set(.4,.4,.4);
jet.position.set(70,70,70);
});

// start animation
animate();

var laser_wav = new Audio("../sounds/laser.wav");
var thrust_wav = new Audio("../sounds/thrust.wav")


// $(document).keypress(function(e) {

// 	console.log(e.keyCode);

// 	 if(e.keyCode == 97){
// 		cameraDistance += 20;
// 		laser_wav.play();
// 		laser_wav= new Audio("laser.wav");

// 	 }else if (e.keyCode == 115){
// 		cameraDistance -= 20;
// 		thrust_wav.play();
// 		thrust_wav = new Audio("thrust.wav")
// 	 }
// 	 else if(e.keyCode == 113){
// 		camera.rotation.x += .01;
// 	 }else if(e.keyCode == 119){
// 		camera.rotation.x -= .01;
// 	 }
	

// });