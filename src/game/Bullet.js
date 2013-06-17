var THREE = require('three'),
	_ = require('underscore'),
	GravityObject = require('./GravityObject.js');

function Bullet(spaceship, scene) {
	GravityObject.prototype._initialize.apply(this, arguments);
	this._initialize.apply(this, arguments);
}

_.extend(Bullet.prototype, GravityObject.prototype, {
	ttl: 20000,
	mass: 0.2,

	_initialize: function(spaceship, scene) {
		this.spaceship = spaceship;
		this.scene = scene;

		this.mesh = new THREE.Mesh(new THREE.SphereGeometry(5, 5, 5), new THREE.MeshLambertMaterial({
			color: 0x0000FF
		}));

		this.mesh.overdraw = true;
		this.scene.add(this.mesh);

		var dir = spaceship.getDirection();
		this.velocity = spaceship.velocity.clone().add(dir.multiplyScalar(10));
		this.mesh.position = spaceship.mesh.position.clone().add(dir.multiplyScalar(10));
	},

	tick: function(time) {
		GravityObject.prototype.tick.apply(this, arguments);

		if (this.distanceToSun() < 50 /* hard coded sun radius */) this.remove();
	},

	checkCollision: function(objs) {
		for (var i = 0; i < objs.length; i++) {
			var dist = this.mesh.position.distanceTo(objs[i].mesh.position);
			if (dist < 10){
				return objs[i];
			}
		}
		return false;
	}
});

module.exports = Bullet; 