/**
* Localio ~ Geo things
* http://rgbk.org/localio
* © Wray Bowling
*/

var localio = localio || {};

localio.geo = {};
		
/*	localio.calculateBounds = function(latLng){
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
	*/
	
	localio.geo.raycast = function(polygon,point){
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

	localio.geo.updatePosition = function(position){
		console.log('position updated with accuracy ' + position.coords.accuracy);
		
		localio.session.gpsAccessed = true;
		localio.session.location = position.coords;
		localio.cache();
		
//		yourLatlng = new google.maps.LatLng(Y,X);
		
//		yourMarker.setPosition(yourLatlng);
//		yourAccuracy.setCenter(yourLatlng);
//		yourAccuracy.setRadius(position.coords.accuracy);
//		myMap.setCenter(yourLatlng);
//		myMap.setZoom(16);
		
//		localio.raycast(myPolygon,yourMarker);
	}
	
	localio.geo.handleError = function(error) {
		console.log("Error " + error.code + ": " + error.message);
	};
	
	//BROWSER CHECKS AND HANDLER STARTS
	
	//if map is loaded
	if(!!navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(localio.geo.updatePosition, localio.geo.handleError, { enableHighAccuracy:true });
		navigator.geolocation.watchPosition(localio.geo.updatePosition, localio.geo.handleError, { enableHighAccuracy:true });
	} else {
		window.location.href = 'unsupported_browser.html';
	}
//})();