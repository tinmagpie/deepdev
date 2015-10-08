(function(){
  'use strict';

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
    })
  });

  var segments = document.getElementsByClassName('segment');

  Array.prototype.forEach.call(segments, function(child) {
    new Waypoint.Inview({
      element: child,
      enter: function(direction) {
        this.element.classList.add('in-view');
      },
      // entered: function(direction) {
      // },
      // exit: function(direction) {
      // },
      exited: function(direction) {
        this.element.classList.remove('in-view');
      }
    })
  });

  var indicators = document.getElementsByClassName('indicator');

  Array.prototype.forEach.call(indicators, function(indicator) {
    indicator.addEventListener('click', function(){
      var parent = findParentBySelector(indicator, '.segment');
      parent.classList.toggle('show-challenge');
      // var challenge = parent.getElementsByClassName('challenge')[0];
      var puzzle = findParentBySelector(indicator, '.puzzle');
      $('.wrapper').animate({
        scrollTop: $(puzzle).offset().top
      }, 300);
    })
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
  };


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

})();
