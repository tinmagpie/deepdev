var GoalManager = (function() {
  var GoalManager = function () {
    this.state = {};
    this.listeners = [];
    this.evaluators = [];
    this.goalCount = 0;
    this.goalsCompleted = 0;
  };

  GoalManager.prototype.init = function () {
    var initState;
    try {
      // initState = localStorage.getItem('goalmanager-state');
      // this.state = JSON.parse(initState);
    } catch (e) {
      this.state = {};
    }
    if (!this.state) {
      this.state = {};
    }

    this.evaluators.forEach(function (ev) {
      ev();
    });
  };

  GoalManager.prototype._notify = function (goalName) {
    this.listeners.forEach(function (listener) {
      listener(goalName);
    });
  };

  GoalManager.prototype.onGoalComplete = function (fn) {
    this.listeners.push(fn);
  };

  GoalManager.prototype.addGoal = function (opts) {
    var name = opts.name;
    var evaluated = false;
    var success = opts.success;

    var self = this;

    this.goalCount++;
    self.state[name] = false;

    console.log('registering goal', name);

    function complete () {
      if (self.state[name]) {
        return;
      }
      // GA completed challenge
      ga('send', {
        hitType: 'event',
        eventCategory: 'Completed Challenge',
        eventAction: 'click',
        eventLabel: name
      });
      self.state[name] = true;
      self.goalsCompleted++;
      success();
      self._notify(name);
    }

    if (!self.state[name]) {
      self.evaluators.push(function () {
        if (!evaluated) {
          opts.evaluate(complete);
        }
        evaluated = true;
      });
    }
  };

  return new GoalManager();
})();
