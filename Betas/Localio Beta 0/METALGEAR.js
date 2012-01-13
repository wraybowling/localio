/**
* METAL GEAR GEO 2
* http://rgbk.org/mg2
* 2010 Wray Bowling
*/
var METALGEAR = {};

(function(){
	METALGEAR.player = {};
	var	X = null,
		Y = null,
		pX = null,
		pY = null,
		POSITION_FOUND = false;
		
	METALGEAR.calculateBounds = function(latLng){
		var bounds = new google.maps.LatLngBounds();
		var paths = this.getPaths();
		var path;
		
		for (var p = 0; p < paths.getLength(); p++) {
		  path = paths.getAt(p);
		  for (var i = 0; i < path.getLength(); i++) {
			bounds.extend(path.getAt(i));
		  }
		}

		return bounds;
	}
	
	METALGEAR.raycast = function(polygon,point){
		if(this.bounds != null && !this.bounds.contains(POSITION)){
			return false;
		}
		
		// Raycast point in polygon method
		var inPoly = false;
		
		var numPaths = polygon.getPaths().getLength();
		for(var p = 0; p < numPaths; p++) {
			var path = polygon.getPaths().getAt(p);
			var numPoints = path.getLength();
			var j = numPoints-1;

			for(var i=0; i < numPoints; i++) { 
				var vertex1 = path.getAt(i);
				var vertex2 = path.getAt(j);
				
				if (vertex1.lng() < point.position.lng() && vertex2.lng() >= point.position.lng() || vertex2.lng() < point.position.lng() && vertex1.lng() >= point.position.lng())  {
					if (vertex1.lat() + (point.position.lng() - vertex1.lng()) / (vertex2.lng() - vertex1.lng()) * (vertex2.lat() - vertex1.lat()) < point.position.lat()) {
						inPoly = !inPoly;
					}
				}

				j = i;
			}

		}
		
		console.log("in the zone?: " + inPoly);

		return inPoly;
		
	}

	METALGEAR.updatePosition = function(position){
		console.log('position updated with accuracy ' + position.coords.accuracy);
		pX = X;
		pY = Y;
		X = position.coords.longitude;
		Y = position.coords.latitude;
		yourLatlng = new google.maps.LatLng(Y,X);
		
		yourMarker.setPosition(yourLatlng);
		yourAccuracy.setCenter(yourLatlng);
		yourAccuracy.setRadius(position.coords.accuracy);
		myMap.setCenter(yourLatlng);
		myMap.setZoom(16);
		
		METALGEAR.raycast(myPolygon,yourMarker);
	}
	
	METALGEAR.handleError = function(error) {
		alert("Error " + error.code + ": " + error.message);
	};
	
	//BROWSER CHECKS AND STARTS
	
	//if map is loaded
	if(!!navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(METALGEAR.updatePosition, METALGEAR.handleError, { enableHighAccuracy:true });
		navigator.geolocation.watchPosition(METALGEAR.updatePosition, METALGEAR.handleError, { enableHighAccuracy:true });
	} else {
		window.location.href = 'unsupported_browser.html';
	}
})();