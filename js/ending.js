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

  function loadSonarTab() {
    var request = new XMLHttpRequest();
    request.open('GET', 'snippets/sonar_tab.html');
    request.onload = function() {
      $('#tabs').prepend(request.response);
    };
    request.onerror = function() {
      console.error('Sonar Tab: XHR error');
    };
    request.send();
  }

  function loadSonarPanel() {
    var request = new XMLHttpRequest();
    request.open('GET', 'snippets/sonar_panel.html');
    request.onload = function() {
      $('#dashboard').prepend(request.response);
    };
    request.onerror = function() {
      console.error('Sonar Panel: XHR error');
    };
    request.send();
  }


  function shouldShowBloop() {
    return navigator.userAgent.search(/refo/i) !== -1;
  }

  var bloopNeedsLoaded = true;

  GoalManager.onGoalComplete(function() {
    if (GoalManager.goalsCompleted >= GoalManager.goalCount) {
      $("#bonus-challenge-tab, #bonus-challenge, #the-bloop").removeClass("shh");
      $("#bonus-challenge-tab").addClass("active");
      $("#bonus-challenge").addClass("in-focus");
      var dashboardOpen = true;
      moveDashboard($("#dashboard").find(".in-focus"));
    } else if (GoalManager.goalsCompleted >= GoalManager.goalCount / 2) {
      if (shouldShowBloop() && bloopNeedsLoaded) {
        loadBloop();
        loadSonarTab();
        loadSonarPanel();
        bloopNeedsLoaded = false;
      }
    }
  });
})();
