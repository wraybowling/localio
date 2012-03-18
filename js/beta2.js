console.log('starting game');

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}
 
Storage.prototype.getObject = function(key) {
    return JSON.parse(this.getItem(key));
}

var localio = localio || {};

localio.storage = localio.storage || localStorage.getObject('localio_storage') || {
	player : {
		 name: "Roy"
		,favoriteFood: "peanuts"
		,homeTown: "Raleigh"
	}
};

localio.session = localio.session || sessionStorage.getObject('localio_session') || {
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
		,nearHome: null
		,alone: null
	}
};

localio.save = function(){
	localStorage.setObject('localio_storage',localio.storage);
};
localio.save();

localio.cache = function(){
	sessionStorage.setObject('localio_session',localio.session);
};
localio.cache();

localio.getLocale = function(coords){
	console.log('getting locale for coords' + coords);
};

console.log('made it to eof');