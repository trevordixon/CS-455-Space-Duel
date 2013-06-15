var THREE = require('three');

module.exports = function(scene) {
	for(var i = 0; i < 500; i++){
		var star = new THREE.Mesh(new THREE.SphereGeometry(5, 5, 5), new THREE.MeshLambertMaterial({
			color: 'white'
		}));
		
		star.position.set(
			(Math.random() -.5 )*((Math.random()*9000)+8050),
			(Math.random() -.5 )*((Math.random()*9000)+8050),
			(Math.random() -.5 )*((Math.random()*9000)+8050)
		);

		scene.add(star);
	}
}