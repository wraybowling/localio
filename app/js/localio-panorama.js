/*
* LOCALIO Panorama Class
* http://rgbk.org
* 2013 Wray Bowling
*/
var LOCALIO = LOCALIO || {};

(function(){
	var turntable = document.getElementById('turntable');

	LOCALIO.getNewPosition = function(_position){
		console.log('new',_position);
		LOCALIO.updateCanvas(_position);
		coordinatesListener = navigator.geolocation.watchPosition(LOCALIO.updateCanvas, LOCALIO.handleError, { enableHighAccuracy:true });
	};

	LOCALIO.updateCanvas = function(_position){
		console.log('updated',_position);
		LOCALIO.position = _position;
		//heading.innerHTML = position.coords.heading;
	};

	LOCALIO.handleError = function(_error) {
		console.error('Geolocation error: ', _error);
	};

	if(!!window.navigator.geolocation) {
		console.log('%cGeolocation works','color:green');
		navigator.geolocation.getCurrentPosition(LOCALIO.getNewPosition, LOCALIO.handleError, { enableHighAccuracy:true });
	} else {
		alert("This browser sucks.");
	}

	var initialOrientation = null;

	LOCALIO.handleOrientation = function(_orientation){
	//	console.log('orientation:', _orientation);
		LOCALIO.orientation = _orientation;

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
		window.addEventListener('deviceorientation', LOCALIO.handleOrientation);
	}

	LOCALIO.handleOrientationChange = function(_orientation){
	//	console.log('orientation:', _orientation);
	//	LOCALIO.orientation = _orientation;
		console.log(_orientation);
	};

	//if(!!window.DeviceOrientationEvent) {
	//	console.log('%cDevice Orientation Changing works', 'color:green');
		window.addEventListener('orientationchange', LOCALIO.handleOrientationChange);
	//}

	LOCALIO.handleMotion = function(_motion){
		LOCALIO.motion = _motion;
		document.getElementById('Fx').value = _motion.acceleration.x * 100;
		document.getElementById('Fy').value = _motion.acceleration.y * 100;
		document.getElementById('Fz').value = _motion.acceleration.z * 100;
	};

	if(!!window.DeviceMotionEvent){
		console.log('%cDevice Motion works', 'color:green');
		window.addEventListener("devicemotion", LOCALIO.handleMotion);
	}

})();