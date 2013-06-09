var THREE = require('three');

function Bullet(player, scene){

	this.team = player;
	this.scene = scene;

	this.bulletShape = new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshLambertMaterial({
		color: this.team == 'red' ? "ff0000" : "#0000ff"
	}));

	this.bulletShape.overdraw = true;
	this.scene.add(this.bulletShape);

	console.log("Hey");

}

Bullet.prototype = {
	addToScene : function(){
		this.scene.add(this.bulletShape);
	},
	setPosition : function(vector){
		this.position = vector;
	},
	setVelocity : function(vel){
		this.velocity = vel;
	},
	setLife : function(alive){
		this.alive = alive;
	}
}

module.exports = Bullet; 