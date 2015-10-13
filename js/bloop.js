(function() {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  var context;
  var havePlayedReveal = false;
  var shouldPlayReveal = false;
  var revealLoaded = false;
  var revealBuffer;
  var fadeInCurve;

  function init() {
    document.querySelector('#the-bloop').addEventListener('animationstart', function (e) {
      if (havePlayedReveal) {
        return;
      }
      shouldPlayReveal = true;
      if (revealLoaded) {
        playReveal();
      }
    });

    context = new AudioContext();

    var bufferLoader = new BufferLoader(context, ['audio/reveal.ogg'], finishedLoading);
    fadeInCurve = new Float32Array(11);
    for (var i = 0; i <= 10; i++) {
      fadeInCurve[i] = eqlerp(i/10);
    }
    bufferLoader.load();
  }

  function finishedLoading(buffers) {
    revealBuffer = buffers[0];
    revealLoaded = true;
    if (shouldPlayReveal && !havePlayedReveal) {
      playReveal();
    }
  }

  function playReveal() {
    if (havePlayedReveal) {
      return;
    }
    havePlayedReveal = true;

    var source = context.createBufferSource();
    source.buffer = revealBuffer;

    var gain = context.createGain();
    source.connect(gain);
    gain.connect(context.destination);

    gain.gain = 0;
    gain.gain.setValueCurveAtTime(fadeInCurve, context.currentTime, 4);
    source.start(context.currentTime);
  }

  // TODO: This belongs elsewhere.
  function eqlerp(i) {
    i = Math.min(1, Math.max(0, i));
    return Math.cos((1.0 - i) * 0.5 * Math.PI);
  }

  // TODO: This belongs elsewhere.
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
  }

  BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
    this.loadBuffer(this.urlList[i], i);
  }

  init();
})()
