(function () {

var fadeInCurve = new Float32Array(11);
var fadeOutCurve = new Float32Array(11);
for (var i = 0; i <= 10; i++) {
  fadeInCurve[i] = eqlerp(i/10);
  fadeOutCurve[i] = eqlerp(1-i/10);
}

function eqlerp(i) {
  i = Math.min(1, Math.max(0, i));
  return Math.cos((1.0 - i) * 0.5 * Math.PI);
}

function Sound(buffer) {
  this.gain = context.createGain();
  this.buffer = buffer;
  this.output = this.gain;
}

Sound.prototype.loop = function () {
  this._play(true);
};

Sound.prototype.play = function () {
  this._play(false);
};

Sound.prototype.fadeOut = function (duration) {
  this.gain.gain.linearRampToValueAtTime(0, context.currentTime + duration);
};

Sound.prototype.fadeIn = function (duration) {
  this.gain.gain.linearRampToValueAtTime(1, context.currentTime + duration);
};

Sound.prototype.getDuration = function () {
  return this.buffer.duration;
};

Sound.prototype._play = function (loop) {
  if (this.source) {
    this.source.stop(context.currentTime);
    this.source.disconnect();
  }
  this.source = context.createBufferSource();
  this.source.buffer = this.buffer;
  console.log(loop);
  if (loop) {
    this.source.loop = true;
  } else {
    this.source.loop = false;
  }
  this.source.connect(this.gain);
  this.gain.gain = 0;
  this.source.start(context.currentTime);
  this.fadeIn(2);
};


function AudioManager() {
  this.sounds = {};
  this.active = null;
  this.bg = context.createGain();
  this.cue = context.createGain();
  this.output = context.createGain();
  this.cue.connect(this.output);
  this.bg.connect(this.output);
  this.output.connect(context.destination);
}

AudioManager.prototype.addSounds = function(soundDescs, cb) {
  var self = this;
  var remaining = soundDescs.length;
  var soundUrls = soundDescs.map(function(soundDesc) { return soundDesc.url; });
  self.isLoading = true;

  self.loadingListeners = [];

  var loader = new BufferLoader(window.context, soundUrls, function(buffers) {
    for (var i = 0; i < buffers.length; i++) {
      var buffer = buffers[i];
      var soundDesc = soundDescs[i];
      self.sounds[soundDesc.name] = new Sound(buffer);
    }
    self.isLoading = false;
    self.loadingListeners.forEach(function (fn) {
      fn();
    });
    self.loadingListeners = [];
    setTimeout(cb, 0);
  });
  loader.load();
};

AudioManager.prototype.doneLoading = function (fn) {
  if (self.isLoading) {
    self.loadingListeners.push(fn);
  } else {
    fn();
  }
};

AudioManager.prototype.setBg = function (name) {
  console.log('new zone', name);
  var sound = this.sounds[name];
  if (!sound) {
    console.log('bg sound not found: "' + name + '". bailing');
    if (this.active) {
      this.active.fadeOut(2);
    }
    this.active = null;
    return;
  }
  if (this.active === sound) {
    return;
  }
  if (this.active) {
    this.active.fadeOut(2);
  }
  this.active = sound;
  this.active.output.connect(this.bg);
  this.active.loop();
};

AudioManager.prototype.stopBg = function () {
  if (!this.active) {
    return;
  }
  this.active.fadeOut(2);
  this.active = null;
};

AudioManager.prototype.playCue = function (name) {
  var sound = this.sounds[name];
  if (!sound) {
    console.log('Unknown cue "' + name + '". bailing.');
    return;
  }
  sound.output.connect(this.cue);
  this.bg.gain.exponentialRampToValueAtTime(0.3, context.currentTime + 0.3);
  this.bg.gain.exponentialRampToValueAtTime(1, context.currentTime + sound.getDuration() + 0.5);
  sound.play();
};

AudioManager.prototype.mute = function () {
  this.output.gain.linearRampToValueAtTime(0, context.currentTime + 0.5);
};

AudioManager.prototype.unmute = function () {
  this.output.gain.linearRampToValueAtTime(1, context.currentTime + 0.5);
};

function setBg(n) {
  return function () {
    window.audio.setBg(n);
  };
}


function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = [];
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url);
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
  };

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  };

  request.send();
};

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
};


window.BufferLoader = BufferLoader;
window.Sound = Sound;
window.AudioManager = AudioManager;

})();
