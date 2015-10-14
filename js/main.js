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

  var zones = document.getElementsByClassName('zone');

  Array.prototype.forEach.call(zones, function(child) {
    new Waypoint.Inview({
      element: child,
      enter: function(direction) {
        this.element.classList.add('in-zone');
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

  var puzzles = document.getElementsByClassName('puzzle');

  Array.prototype.forEach.call(puzzles, function(child) {
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

  var indicators = document.getElementsByClassName('indicator');

  Array.prototype.forEach.call(indicators, function(indicator) {
    indicator.addEventListener('click', function(){
      var parent = findParentBySelector(indicator, '.segment');
      parent.classList.toggle('show-challenge');
      // var challenge = parent.getElementsByClassName('challenge')[0];
      var puzzle = findParentBySelector(indicator, '.puzzle');
      $wrapper.animate({
        scrollTop: $(puzzle).offset().top
      }, 300);
    });
  });

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

  GoalManager.addGoal({
    name: 'shrimp',
    evaluate: function (complete) {
      var vomitingShrimp = document.querySelector('#creature_vomiting-shrimp1');
      function onAnimationStart(e) {
        complete();
        vomitingShrimp.removeEventListener('animationstart', onAnimationStart, true);
      }
      vomitingShrimp.addEventListener('animationstart', onAnimationStart, true);
    },
    success: function () {
      audio.playCue(4);
      document.querySelector('#challenge_vomiting-shrimp').classList.add('completed');
    }
  });

  window.addEventListener('load', function () {
    GoalManager.init();
    setupAudio();
  });

  function setupAudio() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!window.AudioContext) return;
    window.context = new AudioContext();

    var bufferLoader = new BufferLoader(
      context,
      [
        'audio/quad1.ogg',
        'audio/quad2.ogg',
        'audio/quad3.ogg',
        'audio/quad4.ogg',
        'audio/discover.ogg'
      ],
      finishedLoading
    );

    bufferLoader.load();
  }

  function finishedLoading(buffers) {
    var sounds = buffers.map(function (b) {
      return new Sound(b);
    });

    window.audio = new AudioManager(sounds);
    // audio.setBg(0);
  }


})();
