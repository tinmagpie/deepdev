(function(){
  "use strict";

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
        this.element.classList.add("in-zone");
      },
      // entered: function(direction) {
      // },
      // exit: function(direction) {
      // },
      exited: function(direction) {
        this.element.classList.remove("in-zone");
      }
    })
  });

  var segments = document.getElementsByClassName('segment');

  Array.prototype.forEach.call(segments, function(child) {
    new Waypoint.Inview({
      element: child,
      enter: function(direction) {
        this.element.classList.add("in-view");
      },
      // entered: function(direction) {
      // },
      // exit: function(direction) {
      // },
      exited: function(direction) {
        this.element.classList.remove("in-view");
      }
    })
  });
})();
