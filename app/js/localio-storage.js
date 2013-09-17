/*
* LOCALIO Storage Class
* http://rgbk.org
* 2013 Wray Bowling
*/

// Extend Local Storage to support JSON Objects
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key) {
    return JSON.parse(this.getItem(key));
};

// Variables
var LOCALIO = LOCALIO || {};

LOCALIO.Storage = LOCALIO.Storage || localStorage.getObject('LOCALIO_storage') || {
	player: {
		name: "Roy"
	}
	,locales: {}
};

LOCALIO.Session = LOCALIO.Session || sessionStorage.getObject('LOCALIO_session') || {
	location : {
		accuracy: null
		,altitude: null
		,altitudeAccuracy: null
		,heading: null
		,latitude: null
		,longitude: null
		,speed: null
	}
	,gpsAccessed: false
};

// Functions
LOCALIO.save = function(){
	localStorage.setObject('LOCALIO_storage',LOCALIO.Storage);
	console.log('Saved Player',LOCALIO.Storage);
};
LOCALIO.save();

LOCALIO.cache = function(){
	sessionStorage.setObject('LOCALIO_session',LOCALIO.Session);
	console.log('Cached Session',LOCALIO.Session);
};
LOCALIO.cache();

LOCALIO.claimLocale = function(_localeName){
	with(LOCALIO){
		if(!!Story.locales[_localeName]){
			if(!!Storage.locales[_localeName]){
				console.message('Sorry, this locale has already been claimed.');
			}else{
				Storage.locales[_localeName] = {
					name: _localeName
					,location: LOCALIO.Session.location
				};
				LOCALIO.save();
				console.message('Locale stored forever!');
			}
		}else{
			console.error('locale was not found in the Story:',_localeName);
		}
	}
};
