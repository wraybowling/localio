/*
* LOCALIO Storage Class
* http://rgbk.org
* 2013 Wray Bowling
*/

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key) {
    return JSON.parse(this.getItem(key));
};

var LOCALIO = LOCALIO || {};

LOCALIO.Storage = LOCALIO.storage || localStorage.getObject('LOCALIO_storage') || {
	player : {
		name: "Roy"
		,favoriteFood: "peanuts"
		,homeTown: "Raleigh"
	}
};

LOCALIO.Session = LOCALIO.session || sessionStorage.getObject('LOCALIO_session') || {
	location : {
		accuracy: null
		,altitude: null
		,altitudeAccuracy: null
		,heading: null
		,latitude: null
		,longitude: null
		,speed: null
	}
	,status : {
		gpsAccessed: false
	}
};

LOCALIO.save = function(){
	localStorage.setObject('LOCALIO_storage',LOCALIO.storage);
	console.log('Saved Player',LOCALIO.storage);
};
LOCALIO.save();

LOCALIO.cache = function(){
	sessionStorage.setObject('LOCALIO_session',LOCALIO.session);
	console.log('Cached Session',LOCALIO.session);
};
LOCALIO.cache();
/*
LOCALIO.getLocale = function(coords){
	console.log('get Locale', coords);
};
*/