// Start off by initializing a new context.
context = new (window.AudioContext || window.webkitAudioContext)();

if (!context.createGain)
  context.createGain = context.createGainNode;
if (!context.createDelay)
  context.createDelay = context.createDelayNode;
if (!context.createScriptProcessor)
  context.createScriptProcessor = context.createJavaScriptNode;

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
return  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame    ||
  window.oRequestAnimationFrame      ||
  window.msRequestAnimationFrame     ||
  function( callback ){
    window.setTimeout(callback, 1000 / 60);
  };
})();

function playSound(buffer, time) {
  var source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source[source.start ? 'start' : 'noteOn'](time);
}

function loadSounds(obj, soundMap, callback) {
  // Array-ify
  var names = [];
  var paths = [];
  for (var name in soundMap) {
    var path = soundMap[name];
    names.push(name);
    paths.push(path);
  }
  bufferLoader = new BufferLoader(context, paths, function(bufferList) {
    for (var i = 0; i < bufferList.length; i++) {
      var buffer = bufferList[i];
      var name = names[i];
      obj[name] = buffer;
    }
    if (callback) {
      callback();
    }
  });
  bufferLoader.load();
}




function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
};

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
};

////////

function RapidSoundsSample(context) {
  var ctx = this;

  function onLoaded(buffers) {
    ctx.buffers = buffers;
  }

  var loader = new BufferLoader(context, ['../samples_v2/ah.mp3',
                                '../samples_v2/d.mp3'], onLoaded);

  loader.load();

  this.isCompressed = true;
}

RapidSoundsSample.prototype.shootRound = function(type, rounds, interval, random, random2) {
  if (typeof random == 'undefined') {
    random = 0;
  }
  var time = context.currentTime;
  // Make multiple sources using the same buffer and play in quick succession.
  for (var i = 0; i < rounds; i++) {
    var source = this.makeSource(this.buffers[type]);
    if (random2)
      source.playbackRate.value = 1 + Math.random() * random2;
    source[source.start ? 'start' : 'noteOn'](time + i * interval + Math.random() * random);
  }
};

RapidSoundsSample.prototype.makeSource = function(buffer) {
  var source = context.createBufferSource();
  var gain = context.createGain();
  gain.gain.value = 0.2;
  source.buffer = buffer;
  source.connect(gain);
  if (this.isCompressed) {
    var compressor = context.createDynamicsCompressor();
    compressor.threshold.value = 10;
    compressor.ratio.value = 20;
    compressor.reduction.value = -20;
    gain.connect(compressor);
    compressor.connect(context.destination);
  } else {
    gain.connect(context.destination);
  }
  return source;
};

RapidSoundsSample.prototype.toggleCompressor = function() {
  this.isCompressed = !this.isCompressed;
};
