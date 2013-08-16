/**
* METAL GEAR GEO 2
* http://rgbk.org/mg2
* 2010 Wray Bowling
*/
var METALGEAR = METALGEAR || {};

(function(){
	var turntable = document.getElementById("turntable");

	METALGEAR.getNewPosition = function(position){
		console.log('new',position);
		METALGEAR.updateCanvas(position);
		coordinatesListener = navigator.geolocation.watchPosition(METALGEAR.updateCanvas, METALGEAR.handleError, { enableHighAccuracy:true });
	};

	METALGEAR.updateCanvas = function(position){
		console.log('updated',position);
	};

	METALGEAR.handleError = function(error) {
		console.error("Geolocation error: ", error);
	};

	if(navigator.geolocation) {
		console.log("%cGeolocation works","color:green");
		navigator.geolocation.getCurrentPosition(METALGEAR.getNewPosition, METALGEAR.handleError, { enableHighAccuracy:true });
	} else {
		alert("This browser sucks.");
	}
})();