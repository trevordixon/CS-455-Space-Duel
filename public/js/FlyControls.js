var THREE = require('three'),
	gpManager = require('./gamepadManager.js');

/**
 * @author James Baicoianu / http://www.baicoianu.com/
 * Originally from http://threejs.org/examples/js/controls/FlyControls.js
 * Simplified to only obey gamepad
 */

THREE.FlyControls = function ( object, domElement ) {

	this.object = object;

	// API

	this.movementSpeed = 1.0;
	this.rollSpeed = 0.005;

	// disable default target object behavior

	this.object.useQuaternion = true;

	// internals

	this.tmpQuaternion = new THREE.Quaternion();

	this.moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0 };
	this.moveVector = new THREE.Vector3( 0, 0, 0 );
	this.rotationVector = new THREE.Vector3( 0, 0, 0 );

	this.handleEvent = function ( event ) {

		if ( typeof this[ event.type ] == 'function' ) {

			this[ event.type ]( event );

		}

	};

	this.update = function( delta ) {
		if (gpManager.gamepad) {
			this.moveState.yawLeft   = -gpManager.gamepad.axes[2];
			this.moveState.pitchDown =   gpManager.gamepad.axes[3];
			this.moveState.rollLeft = gpManager.gamepad.buttons[15] == 1;
			this.moveState.rollRight = gpManager.gamepad.buttons[14] == 1;

			this.updateRotationVector();
		}

		var moveMult = delta * this.movementSpeed;
		var rotMult = delta * this.rollSpeed;

		this.object.translateX( this.moveVector.x * moveMult );
		this.object.translateY( this.moveVector.y * moveMult );
		this.object.translateZ( this.moveVector.z * moveMult );

		this.tmpQuaternion.set( this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1 ).normalize();
		this.object.quaternion.multiply( this.tmpQuaternion );

		// expose the rotation vector for convenience
		this.object.rotation.setEulerFromQuaternion( this.object.quaternion, this.object.eulerOrder );


	};

	this.updateRotationVector = function() {

		this.rotationVector.x = ( -this.moveState.pitchDown + this.moveState.pitchUp );
		this.rotationVector.y = ( -this.moveState.yawRight  + this.moveState.yawLeft );
		this.rotationVector.z = ( -this.moveState.rollRight + this.moveState.rollLeft );

	};

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	};

	this.updateRotationVector();

};