/**
* METAL GEAR GEO 2
* http://rgbk.org/mg2
* 2010 Wray Bowling
*/
var METALGEAR = METALGEAR || {};

(function(){
	var turntable = document.getElementById('turntable');
	var heading = document.getElementById('heading');

	METALGEAR.getNewPosition = function(_position){
		console.log('new',_position);
		METALGEAR.updateCanvas(_position);
		coordinatesListener = navigator.geolocation.watchPosition(METALGEAR.updateCanvas, METALGEAR.handleError, { enableHighAccuracy:true });
	};

	METALGEAR.updateCanvas = function(_position){
		console.log('updated',_position);
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
		heading.innerHTML = _orientation.webkitCompassHeading;
		turntable.style.webkitTransform = 'rotateY('+_orientation.webkitCompassHeading+'deg)';
	}

	if(!!window.DeviceOrientationEvent) {
 		console.log('%cDevice Orientation works', 'color:green');
 		window.addEventListener('deviceorientation', METALGEAR.handleOrientation, false);
	}
})();