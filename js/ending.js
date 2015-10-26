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

  function loadCongratsPanel() {
    var request = new XMLHttpRequest();
    request.open('GET', 'snippets/congrats.html');
    request.onload = function() {
      var target = document.getElementById('certificate');
      target.innerHTML = request.response;
    };
    request.onerror = function() {
      console.error('Congrats Panel: XHR error');
    };
    request.send();
  }


  function shouldShowBloop() {
    return navigator.userAgent.search(/refo/i) !== -1;
  }

  var bloopNeedsLoaded = true;

  GoalManager.onGoalComplete(function() {
    if (GoalManager.goalsCompleted >= GoalManager.goalCount) {
      if (shouldShowBloop()){
        // For the bonus round...
        $("#bonus-challenge-tab, #bonus-challenge, #the-bloop").removeClass("shh");
        $("#bonus-challenge-tab").addClass("active");
        $("#bonus-challenge").addClass("in-focus");
        $("#challenge_bloop").addClass("visited");
        var dashboardOpen = true;
        moveDashboard($("#dashboard").find(".in-focus"));
      } else {
        // For future browsers and CSS animation rock stars
        $("html").addClass("won");
        $("#congrats-tab, #congrats-panel").removeClass("shh");
        $("#congrats-tab").addClass("active");
        $("#congrats-panel").addClass("in-focus");
        var dashboardOpen = true;
        moveDashboard($("#dashboard").find(".in-focus"));
      }
    } else if (GoalManager.goalsCompleted >= GoalManager.goalCount / 2) {
      if (shouldShowBloop() && bloopNeedsLoaded) {
        loadBloop();
        loadSonarTab();
        loadSonarPanel();
        loadCongratsPanel();
        bloopNeedsLoaded = false;
      }
    }
  });
})();
