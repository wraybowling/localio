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
		METALGEAR.orientation = _orientation;

		document.getElementById('heading').value = _orientation.webkitCompassHeading;
		document.getElementById('alpha').value = _orientation.alpha;
		document.getElementById('beta').value = _orientation.beta;
		document.getElementById('gamma').value = _orientation.gamma;

		//turntable.style.webkitTransform = 'rotateX('+_orientation.beta+'deg) rotateY('+_orientation.webkitCompassHeading+'deg)';
		if(window.orientation === -90){
			turntable.style.webkitTransform = 'translateZ(200px) rotateX('+(_orientation.gamma-90)+'deg) rotateY('+_orientation.webkitCompassHeading+'deg)';
		}else if(window.orientation === 0){
			turntable.style.webkitTransform = 'translateZ(200px) rotateX('+(_orientation.beta)+'deg)';
		}else if(window.orientation === 90){
			turntable.style.webkitTransform = 'translateZ(200px) rotateX('+(180-_orientation.gamma+90)+'deg)';
		}
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
		document.getElementById('Vx').value = _motion.acceleration.x * 100;
		document.getElementById('Vy').value = _motion.acceleration.y * 100;
		document.getElementById('Vz').value = _motion.acceleration.z * 100;
	};

	if(!!window.DeviceMotionEvent){
		console.log('%cDevice Motion works', 'color:green');
		window.addEventListener("devicemotion", METALGEAR.handleMotion);
	}

})();