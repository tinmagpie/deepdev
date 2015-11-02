(function() {

  var havePlayedReveal = false;
  var shouldPlayReveal = false;
  var revealLoaded = false;
  var revealBuffer;
  var fadeInCurve;

  var bloopEl = document.querySelector('#the-bloop');

  bloopEl.addEventListener('animationstart', function (e) {
    if (havePlayedReveal) {
      return;
    }
    shouldPlayReveal = true;
    if (revealLoaded) {
      playReveal();
    }
  });

  var haveShownEnding = false;
  bloopEl.addEventListener('animationstart', function (e) {
    if (e.animationName === 'swimOut' && !haveShownEnding) {
      haveShownEnding = true;
      $('#challenge_bloop').addClass('completed');
      $("#congrats-tab, #congrats-panel").removeClass("shh");
      $("#congrats-tab").addClass("active");
      $("#congrats-panel").addClass("in-focus");
      $("#bonus-challenge-tab").addClass("shh");
      var dashboardOpen = true;
      moveDashboard($("#dashboard").find(".in-focus"));
    }
  });

  var sounds = [
    {name: 'reveal', url: 'audio/reveal.ogg'}
  ];
  window.audio.addSounds(sounds, finishedLoading);

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

})();
