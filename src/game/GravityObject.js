var THREE = require('three'),
	_ = require('underscore')
	EventEmitter = require('events').EventEmitter;

var sunPosition = new THREE.Vector3(0, 0, 0);

function GravityObject() {
	this._initialize.apply(this, arguments);
}

_.extend(GravityObject.prototype, EventEmitter.prototype, {
	_initialize: function() {
		this.createTime = Date.now();
	},

	velocity: new THREE.Vector3,
	mass: 0,

	tick: function() {
		var timeAlive = Date.now() - this.createTime;
		if (timeAlive > this.ttl) {
			this.remove();
			return false;
		}

		var r = this.distanceToSun(),
			a = new THREE.Vector3().subVectors(sunPosition, this.mesh.position).normalize().multiplyScalar(this.mass / r*r);
		
		this.velocity.add(a);
		this.mesh.position.add(this.velocity);
		return true;
	},

	remove: function() {
		this.scene.remove(this.mesh);
		this.emit('remove');
	},

	distanceToSun: function() {
		return this.mesh.position.distanceTo(sunPosition);
	}
});

module.exports = GravityObject;