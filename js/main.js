(function(){
    "use strict";

    notify = function(note) {
      console.log(note);
    }
    /*
    var waypoint = new Waypoint({
      element: document.getElementById('mesopelagic'),
      handler: function() {
        console.log('Basic waypoint triggered')
      }
    })*/

    var segments = document.getElementsByClassName('segment');

    Array.prototype.forEach.call(segments, function(child) {
      new Waypoint.Inview({
        element: child,
        enter: function(direction) {
          this.element.classList.add("in-view");
          notify(child + ': Enter triggered with direction ' + direction)
        },
        entered: function(direction) {
          notify(child + ': Entered triggered with direction ' + direction)
        },
        exit: function(direction) {
          notify(child + ': Exit triggered with direction ' + direction)
        },
        exited: function(direction) {
          notify(child + ': Exited triggered with direction ' + direction)
          this.element.classList.remove("in-view");
        }
      })
    });
})();
