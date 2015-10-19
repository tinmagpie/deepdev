(function(){
  'use strict';

  var currentDepth;
  /*
  var waypoint = new Waypoint({
    element: document.getElementById('mesopelagic'),
    handler: function() {
      console.log('Basic waypoint triggered')
    }
  })*/

  var zoneListeners = [];
  var currentZone;
  function zoneChanged(zoneEl) {
    currentZone = zoneEl;
    zoneListeners.forEach(function (listener) {
      listener(zoneEl);
    });
  }
  function onZoneChanged(fn) {
    zoneListeners.push(fn);
    if (currentZone) {
      fn(currentZone);
    }
  }

  var zones = document.getElementsByClassName('zone');

  Array.prototype.forEach.call(zones, function(child) {
    new Waypoint.Inview({
      element: child,
      enter: function(direction) {
        this.element.classList.add('in-zone');
        zoneChanged(this.element);
        $("body").removeClass().addClass(this.element.id);
      },
      // entered: function(direction) {
      // },
      // exit: function(direction) {
      // },
      exited: function(direction) {
        this.element.classList.remove('in-zone');
      }
    });
  });

  var segments = document.getElementsByClassName('segment');

  Array.prototype.forEach.call(segments, function(child) {
    new Waypoint.Inview({
      element: child,
      enter: function(direction) {
        this.element.classList.add('in-view');
        currentDepth = this.element.id.slice(1);
      },
      entered: function(direction) {
        // this.element.classList.add('viz-focus');
      },
      exit: function(direction) {
        // this.element.classList.remove('viz-focus');
      },
      exited: function(direction) {
        this.element.classList.remove('in-view');
      }
    });
  });

  var $wrapper = $('.wrapper');

  var challenges = document.getElementsByClassName('challenge');

  Array.prototype.forEach.call(challenges, function(child) {
    new Waypoint.Inview({
      element: child,
      enter: function(direction) {
        var creature = this.element.getAttribute('data-creature');
        var indicator = document.querySelector('.progress [data-creature="' + creature + '"]');
        if (indicator) {
          indicator.classList.add('visited');
        }
      },
      entered: function(direction) {
        // this.element.classList.add('viz-focus');
      },
      exit: function(direction) {
        // this.element.classList.remove('viz-focus');
      },
      exited: function(direction) {
      }
    });
  });

  // Toggle on the challenger tasks
  $(".segment").on("click", ".rediscover", function(){
    $(this).parents(".segment").toggleClass("completed");
  });

  // Things to do after the challenge is completed.
  var missionAccomplished = function(challenge) {
    $(challenge).find(".challenge").append('<p class="rediscover">Close</p>');
    challenge.removeEventListener('transitionend', missionAccomplished);
  };


  // Progress bar icons scroll to appropriate depth
  $("#progress_bar").find("a").each(function(a){
    $(this).on("click", function(){
      var section = $(this).attr('href');
      var newDepth = section.slice(2);
      var time = Math.round(Math.abs((newDepth - currentDepth)));
      $('html, body').animate({
        scrollTop: $(section).offset().top
      }, time);
    });
  });

  // Scroll to nearest in-view puzzle when devtools are opened.
  // window.addEventListener('devtoolschange', function (e) {
  // });


  // Debouncing on rezize
  // http://davidwalsh.name/javascript-debounce-function
  // If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.

  // call like so: window.addEventListener('resize', myEfficientFn);

  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }


  // For accessing parents by selector:
  // http://stackoverflow.com/questions/14234560/javascript-how-to-get-parent-element-by-selector
  function collectionHas(a, b) { //helper function (see below)
    for(var i = 0, len = a.length; i < len; i ++) {
        if(a[i] == b) return true;
    }
    return false;
  }
  function findParentBySelector(elm, selector) {
    var all = document.querySelectorAll(selector);
    var cur = elm.parentNode;
    while(cur && !collectionHas(all, cur)) { //keep going up until you find a match
        cur = cur.parentNode; //go up
    }
    return cur; //will return null if not found
  }

  window.addEventListener('load', function () {
    GoalManager.init();
    setupAudio();
  });

  function setupAudio() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!window.AudioContext) return;
    window.context = new AudioContext();
    window.audio = new AudioManager();
    audio.mute();

    var activeZone = document.querySelector('.zone.in-view');
    var currentQuad = activeZone ? activeZone.getAttribute('data-audio') : null;
    onZoneChanged(function (zone) {
      currentQuad = zone.getAttribute('data-audio');
      audio.doneLoading(function () {
        audio.setBg(currentQuad);
      });
    });

    var sounds = [
      {name: 'quad1', url: 'audio/quad1.ogg'},
      {name: 'quad2', url: 'audio/quad2.ogg'},
      {name: 'quad3', url: 'audio/quad3.ogg'},
      {name: 'quad4', url: 'audio/quad4.ogg'},
      {name: 'discover', url: 'audio/discover.ogg'}
    ];

    audio.addSounds(sounds, function () {
      var isMuted = true;
      var audioButton = document.querySelector('#audio');
      audio.setBg(currentQuad);
      audioButton.addEventListener('click', function () {
        isMuted = !isMuted;
        if (isMuted) {
          audio.mute();
          audioButton.textContent = 'Mute the Deep';
        } else {
          audio.unmute();
          audioButton.textContent = 'Listen to the Deep';
        }
      });
    });
  }

  // use only one timeout for style polling, when polling is necessary.
  var pollPolitely = (function () {
    var polls = [];

    function stop(fn) {
      for (var i=0; i<polls.length; i++) {
        if (polls[i] === fn) {
          polls.splice(i, 1);
          break;
        }
      }
    }

    function poll() {
      polls.forEach(function (fn) {
        fn(stop.bind(this, fn));
      });
      setTimeout(poll, 500);
    }

    setTimeout(poll, 500);

    return function (fn) {
      polls.push(fn);
    };
  })();



  GoalManager.addGoal({
    name: 'flashlight-fish',
    evaluate: function (complete) {
      var creature = document.querySelector('#creature_flashlight-fish1');
      function handler(e) {
        complete();
        creature.removeEventListener('animationiteration', handler);
      }
      creature.addEventListener('animationiteration', handler);
    },
    success: function () {
      var challenge = document.getElementById('d400');
      challenge.addEventListener('transitionend', missionAccomplished(challenge));
      challenge.classList.add('completed');
      audio.playCue('discover');
      document.getElementById('challenge_flashlight-fish').classList.add('completed');
    }
  });


  GoalManager.addGoal({
    name: 'nautilus',
    evaluate: function (complete) {
      var creature = document.querySelector('#creature_nautilus1');
      pollPolitely(function (stop) {
        var val = window.getComputedStyle(creature).getPropertyValue('animation-timing-function');
        // checking for negative values in a cubic bezier
        var hasNegative = val.search(/-\d/) >= 0;
        if (hasNegative) {
          stop();
          complete();
        }
      });
    },
    success: function () {
      var challenge = document.getElementById('d600');
      challenge.addEventListener('transitionend', missionAccomplished(challenge));
      challenge.classList.add('completed');
      audio.playCue('discover');
      document.querySelector('#challenge_nautilus').classList.add('completed');
    }
  });


  GoalManager.addGoal({
    name: 'orange-roughy',
    evaluate: function (complete) {
      var creature = document.querySelector('#creature_orange-roughy1');
      pollPolitely(function (stop) {
        var val = window.getComputedStyle(creature).getPropertyValue('filter');
        // checking for negative values in a cubic bezier
        if (val.indexOf('/img/blue-filter.svg#seafish') < 0) {
          stop();
          complete();
        }
      });
    },
    success: function () {
      var challenge = document.getElementById('d1600');
      challenge.addEventListener('transitionend', missionAccomplished(challenge));
      challenge.classList.add('completed');
      document.querySelector('.orange-roughy-revelation').classList.remove('orange-roughy-revelation');
      document.querySelector('#challenge_orange-roughy').classList.add('completed');
      audio.playCue('discover');
    }
  });


  GoalManager.addGoal({
    name: 'shrimp',
    evaluate: function (complete) {
      var vomitingShrimp = document.querySelector('#creature_vomiting-shrimp1');
      function onAnimationStart(e) {
        complete();
        vomitingShrimp.removeEventListener('animationstart', onAnimationStart);
      }
      vomitingShrimp.addEventListener('animationstart', onAnimationStart);
    },
    success: function () {
      audio.playCue('discover');
      document.querySelector('#challenge_vomiting-shrimp').classList.add('completed');
    }
  });

  (function () {
    var docEl = document.documentElement;
    var docHeight = docEl.scrollHeight;
    var currentPosition = docEl.scrollTop;
    var pos;

    window.addEventListener('scroll', function (e) {
      currentPosition = docEl.scrollTop;
    });

    window.addEventListener('load', function (e) {
      currentPosition = docEl.scrollTop;
      docHeight = docEl.scrollHeight;

      window.addEventListener('resize', function (e) {
        pos = currentPosition / docHeight;
        docHeight = docEl.scrollHeight;
        currentPosition = Math.round(pos * docHeight);
        docEl.scrollTop = currentPosition;
      });
    });
  })();

})();
