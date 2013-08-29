/**
* METAL GEAR GEO 2
* http://rgbk.org/mg2
* 2010 Wray Bowling
*/
var METALGEAR = METALGEAR || {};

(function(){
	var turntable = document.getElementById('turntable');

	METALGEAR.getNewPosition = function(_position){
		console.log('new',_position);
		METALGEAR.updateCanvas(_position);
		coordinatesListener = navigator.geolocation.watchPosition(METALGEAR.updateCanvas, METALGEAR.handleError, { enableHighAccuracy:true });
	};

	METALGEAR.updateCanvas = function(_position){
		console.log('updated',_position);
		METALGEAR.position = _position;
		//heading.innerHTML = position.coords.heading;
	};

	METALGEAR.handleError = function(_error) {
		console.error('Geolocation error: ', _error);
	};

	if(!!window.navigator.geolocation) {
		console.log('%cGeolocation works','color:green');
		navigator.geolocation.getCurrentPosition(METALGEAR.getNewPosition, METALGEAR.handleError, { enableHighAccuracy:true });
	} else {
		alert("This browser sucks.");
	}

	var initialOrientation = null;

	METALGEAR.handleOrientation = function(_orientation){
	//	console.log('orientation:', _orientation);
		METALGEAR.orientation = _orientation;

		if (initialOrientation === null) {
			initialOrientation = _orientation;
		}

		var deviceRoll = _orientation.alpha - initialOrientation.alpha;
		var devicePitch = _orientation.beta - initialOrientation.beta;
		var deviceYaw = _orientation.gamma - initialOrientation.gamma;
		var deviceHeading = _orientation.heading - initialOrientation.heading;

		document.getElementById('heading').value = deviceHeading;
		document.getElementById('alpha').value = deviceRoll;
		document.getElementById('beta').value = devicePitch;
		document.getElementById('gamma').value = deviceYaw;

		//turntable.style.webkitTransform = 'rotateX('+beta+'deg) rotateY('+webkitCompassHeading+'deg)';
		var orientation_style = '';
		if(window.orientation === -90){ // home button on right
			orientation_style += 'translateZ(200px) rotateZ('+(deviceRoll)+'deg) rotateX('+(deviceYaw)+'deg) rotateY('+(devicePitch)+'deg)';
		}else if(window.orientation === 90){ // home button on left
			orientation_style += 'translateZ(200px) rotateZ('+(-devicePitch)+'deg) ';//rotateX('+(deviceYaw)+'deg) rotateY('+(deviceRoll)+'deg);
		}else{
			orientation_style += 'translateZ(200px) rotateZ('+(deviceRoll)+'deg) rotateY('+(-deviceYaw)+'deg) rotateX('+(devicePitch)+'deg)';
		}

		turntable.style.webkitTransform = orientation_style;
	};

	if(!!window.DeviceOrientationEvent) {
		console.log('%cDevice Orientation works', 'color:green');
		window.addEventListener('deviceorientation', METALGEAR.handleOrientation);
	}

	METALGEAR.handleOrientationChange = function(_orientation){
	//	console.log('orientation:', _orientation);
	//	METALGEAR.orientation = _orientation;
		console.log(_orientation);
	};

	//if(!!window.DeviceOrientationEvent) {
	//	console.log('%cDevice Orientation Changing works', 'color:green');
		window.addEventListener('orientationchange', METALGEAR.handleOrientationChange);
	//}

	METALGEAR.handleMotion = function(_motion){
		METALGEAR.motion = _motion;
		document.getElementById('Fx').value = _motion.acceleration.x * 100;
		document.getElementById('Fy').value = _motion.acceleration.y * 100;
		document.getElementById('Fz').value = _motion.acceleration.z * 100;
	};

	if(!!window.DeviceMotionEvent){
		console.log('%cDevice Motion works', 'color:green');
		window.addEventListener("devicemotion", METALGEAR.handleMotion);
	}

})();