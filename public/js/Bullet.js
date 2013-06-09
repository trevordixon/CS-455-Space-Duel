var THREE = require('three');

function Bullet(spaceship, scene){
	this.spaceship = spaceship;
	this.scene = scene;

	this.mesh = new THREE.Mesh(new THREE.SphereGeometry(5, 5, 5), new THREE.MeshLambertMaterial({
		color: 0x0000FF
	}));

	this.mesh.overdraw = true;
	this.scene.add(this.mesh);

	var dir = new THREE.Vector3(0, 0, 1).applyMatrix4(spaceship.camera.matrixWorld).normalize();

	this.velocity = spaceship.velocity.clone().add(dir.multiplyScalar(10));
	this.mesh.position = spaceship.mesh.position.clone();
}

var sunPosition = new THREE.Vector3(0, 0, 0);

Bullet.prototype = {
	tick: function(time) {
		var r = this.mesh.position.distanceTo(sunPosition);
		var a = new THREE.Vector3().subVectors(sunPosition, this.mesh.position).normalize().multiplyScalar(.1 / r*r);
		this.velocity.add(a);
		this.mesh.position.add(this.velocity);

		if (r < 50) {
			// TODO: also need to remove bullet from array in main.js
			this.scene.remove(this.mesh);
		}
	}
}

module.exports = Bullet; 