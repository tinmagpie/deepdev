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

    var sounds = [
      {name: 'reveal', url: 'audio/reveal.ogg'}
    ];
    window.audio.addSounds(sounds, finishedLoading);
  }

  function finishedLoading() {
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
    window.audio.playCue('reveal');
  }

  init();
})();
