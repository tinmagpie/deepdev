(function() {
  function loadBloop() {
    var request = new XMLHttpRequest();
    request.open('GET', 'snippets/bloop.html');
    request.onload = function() {
      var target = document.getElementById('d2200');
      target.innerHTML = request.response;
    };
    request.onerror = function() {
      console.error('Bloop: XHR error');
    };
    request.send();
  }

  function loadSonar() {
    var request = new XMLHttpRequest();
    request.open('GET', 'snippets/sonar.html');
    request.onload = function() {
      var dashboard = document.getElementById('dashboard');
      dashboard.innerHTML = $($.parseHTML(request.response)).filter("#bonus-challenge");

      var tabs = document.getElementById('tabs');
      dashboard.innerHTML = $($.parseHTML(request.response)).filter("#bonus-challenge-tab");
    };
    request.onerror = function() {
      console.error('Sonar: XHR error');
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
