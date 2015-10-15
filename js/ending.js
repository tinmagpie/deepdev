(function() {
  function loadBloop() {
    var request = new XMLHttpRequest();
    request.open('GET', 'snippets/bloop.html');
    request.onload = function() {
      var target = document.querySelector('#d2200');
      target.innerHTML = request.response;

      var bloopDepth = document.querySelector('#bloop-depth');
      var depth = $(target).find('#the-bloop').offset().top;
      bloopDepth.textContent = '' + depth + '-';
    };
    request.onerror = function() {
      console.error('Bloop: XHR error');
    };
    request.send();
  }

  function shouldShowBloop() {
    return navigator.userAgent.search(/refo/i) !== -1;
  }

  GoalManager.onGoalComplete(function() {
    if (GoalManager.goalsCompleted >= GoalManager.goalCount / 2) {
      if (shouldShowBloop()) {
        loadBloop();
      }
    }
  });
})();
