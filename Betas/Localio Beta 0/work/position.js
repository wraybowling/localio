/**
* METAL GEAR GEO 2
* http://rgbk.org/mg2
* 2010 Wray Bowling
*/
var METALGEAR = METALGEAR || {};

(function(){
	var canvas = document.getElementById("canvas"),
		c = canvas.getContext("2d");
	c.lineWidth = 4;			
	c.strokeStyle = "rgb(0,80,0)";
	c.fillStyle = "rgb(0,0,0)";
	
	METALGEAR.getNewPosition = function(position){
		console.log("position OK");
		METALGEAR.updateCanvas(position);
		coordinatesListener = navigator.geolocation.watchPosition(METALGEAR.updateCanvas, METALGEAR.handleError, { enableHighAccuracy:true });
	};
	
	METALGEAR.updateCanvas = function(position){
		savedPosition = position;
		var x = position.coords.longitude;
		var y = position.coords.latitude;
		//console.log("x:y | " + x +":" y);
		document.getElementById("long").firstChild.nodeValue = "Long(x): " + x;
		document.getElementById("lat").firstChild.nodeValue = "Lat(y): " + y;
		c.beginPath();
		c.arc(getScaledCoordinateX(x), getScaledCoordinateY(y), 10,0,Math.PI*2,false);
		c.closePath();
		c.fill();
	};
	
	METALGEAR.handleError = function(error) {
		alert("Debug this: " + error);
	};
	
	if(navigator.geolocation) {
		console.log("geolocation OK");
		navigator.geolocation.getCurrentPosition(METALGEAR.getNewPosition, METALGEAR.handleError, { enableHighAccuracy:true });
	} else {
		alert("This browser sucks.");
	}
})();