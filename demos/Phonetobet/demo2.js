// Web Audio Polyfill
try{
	window.AudioContext = (function(){
		return window.AudioContext ||
		window.webkitAudioContext ||
		window.mozAudioContext ||
		window.oAudioContext;
	})();
	var waapi = new AudioContext();
}catch(error){
	console.error('Web Audio not supported!', error);
}

// Request Animation Frame Polyfill
window.requestAnimFrame = (function(){
return  window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function( callback ){
		window.setTimeout(callback, 1000 / 60);
	};
})();

// GUI
var delay;
var shift;

function setDelay(new_value){
	delay = new_value;
	clearInterval(timer);
	timer = setInterval(setPlayhead, delay);
	console.log('delay:', delay, ' shift:',shift);
}

function setShift(new_value){
	shift = new_value;
	console.log('delay:', delay, ' shift:',shift);
}


// Fallback functions
if (!waapi.createGain)
	waapi.createGain = waapi.createGainNode;
if (!waapi.createDelay)
	waapi.createDelay = waapi.createDelayNode;
if (!waapi.createScriptProcessor)
	waapi.createScriptProcessor = waapi.createJavaScriptNode;

var master = waapi.createGain();
master.gain.value = 0.5;
master.connect(waapi.destination);

function voice(name){
	this.name = name;
	this.buffers = {};
	this.loadVoice();
}

voice.prototype.loadPhoneme = function(phoneme,target){
	// AJAX the sounds into sound buffers
	var request = new XMLHttpRequest();
	var url = ['samples_v2',target.name,phoneme+'.mp3'].join('/');
	request.open('GET',url,true);
	request.responseType = 'arraybuffer';

	request.onload = function(){
		waapi.decodeAudioData(request.response,function(buffer){
				if (!buffer) {
					console.error('Nope. Cant decode: ', url);
					return;
				}
				//createBufferSource
				target.buffers[phoneme] = buffer;
			}
			,function(error){
				console.error('file not found',url,error);
			}
		);
	};

	request.onerror = function() {
		console.error('loadVoice: XHR failed. Are you running a server?');
	};

	request.send();
};

voice.prototype.loadVoice = function(){
	// look for these files
	var phonomesList = 'ah,au,ay,b,k,s,d,ee,eh,f,g,h,ih,j,l,m,n,oh,oo,oy,ow,p,qu,r,t,uh,v,w,y,z,th,sh,ch'.split(',');
	var target = this;

	for(var i = 0; i<phonomesList.length; i++){
		this.loadPhoneme(phonomesList[i],target);
	}
};

function textToPhonemes(string){
	// split string into usable syllables
	var regex_syllables = /((ch|ph|sh|th|qu|es|[a-z])[aeiouy]+|[ –—,!~\-\.\?\n])/ig;
	var syllables = string.match(regex_syllables);
	console.log(syllables);

	// split the consonant+vowel pairs
	var regex_consonants = /(ch|ph|sh|th|qu|es|[wrtpsdfghjklzxcvbmn])/i;
	var regex_vowels = /q?[aeiouy][aeiouy]?/i;
	var regex_pauses = /[ –—,!~\-\.\?\n]/g;
	var phonemes = [];
	var times = [];
	var time_stepper = 0;
	for (var i = 0; i < syllables.length; i++) {
		var consonant = syllables[i].match(regex_consonants);
		var random = Math.round(Math.random());
		if(consonant !== null){
			if(consonant === 'c'){ consonant = random ? 'k' : 's'; }
			else if(consonant === 'g'){ consonant = random ? 'g' : 'j'; }
			else if(consonant === 'ph'){ consonant = 'f'; }
			else if(consonant === 's'){ consonant = random ? 's' : 'z'; }
			else if(consonant === 'x'){ consonant = random ? ['k','s'] : 'z'; }
			else if(consonant === 'es'){ consonant = 'z'; }
			else if(consonant.length){ consonant = consonant[0]; }
			phonemes = phonemes.concat(consonant.toLowerCase());
			times.push(time_stepper);
			time_stepper+=0.5;
		}

		var vowel = syllables[i].match(regex_vowels);
		if(vowel !== null){
			var v;
			vowel[0] = vowel[0].toLowerCase();
			if(vowel[0] === 'a'){ v = random ? 'ah' : 'ay'; }
			else if(vowel[0] === 'e'){ v = random ? 'eh' : 'ee'; }
			else if(vowel[0] === 'i'){ v = random ? 'ih' : ['ah','ee']; }
			else if(vowel[0] === 'o'){ v = random ? 'oh' : 'ah'; }
			else if(vowel[0] === 'u'){ v = random ? 'uh' : 'oo'; }
			else if(vowel[0] === 'y'){ v = random ? ['ah','ee'] : 'ee'; }
			else if(vowel[0] === 'aa'){ v = 'ah'; }
			else if(vowel[0] === 'ae'){ v = 'ay'; }
			else if(vowel[0] === 'ai'){ v = ['ah','ee']; }
			else if(vowel[0] === 'ao'){ v = 'au'; }
			else if(vowel[0] === 'au'){ v = 'au'; }
			else if(vowel[0] === 'ea'){ v = 'ee'; }
			else if(vowel[0] === 'ei'){ v = 'ay'; }
			else if(vowel[0] === 'eo'){ v = 'oh'; }
			else if(vowel[0] === 'eu'){ v = 'oo'; }
			else if(vowel[0] === 'ey'){ v = 'ay'; }
			else if(vowel[0] === 'ia'){ v = ['ee','uh']; }
			else if(vowel[0] === 'ie'){ v = ['ah','ee']; }
			else if(vowel[0] === 'ii'){ v = ['ee','ah','ee']; }
			else if(vowel[0] === 'io'){ v = ['ee','oh']; }
			else if(vowel[0] === 'iu'){ v = ['ee','uh']; }
			else if(vowel[0] === 'iy'){ v = 'ee'; }
			else if(vowel[0] === 'oa'){ v = ['oh','uh']; }
			else if(vowel[0] === 'oe'){ v = 'oh'; }
			else if(vowel[0] === 'oi'){ v = 'oy'; }
			else if(vowel[0] === 'ou'){ v = random ? 'ow' : 'uh'; }
			else if(vowel[0] === 'oy'){ v = 'oy'; }
			else if(vowel[0] === 'ua'){ v = ['oo','uh']; }
			else if(vowel[0] === 'ue'){ v = 'oo'; }
			else if(vowel[0] === 'ui'){ v = ['oo','ee']; }
			else if(vowel[0] === 'uo'){ v = ['oo','ah']; }
			else if(vowel[0] === 'uu'){ v = 'oo'; }
			else if(vowel[0] === 'uy'){ v = ['ah','ee']; }
			else if(vowel[0] === 'ya'){ phonemes.push('y'); v = random ? 'ah' : ['ah','ee']; }
			else if(vowel[0] === 'ye'){ phonemes.push('y'); v = 'eh'; }
			else if(vowel[0] === 'yi'){ phonemes.push('y'); v = 'ih'; }
			else if(vowel[0] === 'yo'){ phonemes.push('y'); v = 'oh'; }
			else if(vowel[0] === 'yu'){ phonemes.push('y'); v = 'uh'; }
			else if(vowel[0] === 'yy'){ v = 'ee'; }
			phonemes = phonemes.concat(v);
			times.push(time_stepper++);
		}

		var pause = syllables[i].match(regex_pauses);
		if(pause !== null){
			phonemes.push('');
			time_stepper+=2;
			times.push(time_stepper);
		}
	}

	return [phonemes,times];
}

voice.prototype.queuePhoneme = function(phoneme,time){
	if(wray.buffers[phoneme] !== undefined){
		var buffa = waapi.createBufferSource();
		buffa.buffer = wray.buffers[phoneme];
		buffa.connect(master);
		buffa.playbackRate.value = Math.random()*0.1-0.05+1.25;
		buffa.start(time);
		buffa.stop(time+0.15);
	}
};

voice.prototype.queueString = function(){

	var phones = textToPhonemes(source_text.value);

	for(var i = 0; i<phones[0].length; i++){
		wray.queuePhoneme(phones[0][i],waapi.currentTime+(phones[1][i]*0.03));
	}
}

var source_text = document.getElementById('source_text');

wray = new voice('wray');
