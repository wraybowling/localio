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

	METALGEAR.handleOrientation = function(_orientation){
	//	console.log('orientation:', _orientation);
		if (METALGEAR.calibration === undefined) {
			METALGEAR.calibration = (360 - _orientation.alpha) - _orientation.webkitCompassHeading;
		}else{
			var q = (360 - _orientation.alpha) - _orientation.webkitCompassHeading;
			q = (q + 360) % 360;
			METALGEAR.calibration = METALGEAR.calibration*0.8 + q*0.2;
		}

		document.getElementById('heading').value = _orientation.webkitCompassHeading;
		document.getElementById('alpha').value = _orientation.alpha;
		document.getElementById('beta').value = _orientation.beta;
		document.getElementById('gamma').value = _orientation.gamma;

		//turntable.style.webkitTransform = 'rotateX('+beta+'deg) rotateY('+webkitCompassHeading+'deg)';
		var orientation_style = ['translateZ(200px)'];
		if(window.orientation === -90){ // home button on left
			orientation_style.push('rotateZ('+(_orientation.beta)+'deg)');
			orientation_style.push('rotateX('+(_orientation.gamma-90)+'deg)');
			orientation_style.push('rotateY('+(0 - (_orientation.alpha-90 + METALGEAR.calibration))+'deg)');
		}else if(window.orientation === 90){ // home button on right
			orientation_style.push('rotateZ('+(-_orientation.beta)+'deg)');//rotateX('+(deviceYaw)+'deg) rotateY('+(deviceRoll)+'deg);
		}else{
			orientation_style.push('rotateZ('+(_orientation.alpha)+'deg) rotateY('+(-_orientation.gamma)+'deg) rotateX('+(_orientation.beta)+'deg)');
		}

		turntable.style.webkitTransform = orientation_style.join(' ');
	};

	if(window.DeviceOrientationEvent !== undefined) {
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