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
      initState = localStorage.getItem('goalmanager-state');
      this.state = JSON.parse(initState);
    } catch (e) {
      this.state = {}
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

    var self = this;

    this.goalCount++;
    self.state[name] = false;

    function complete () {
      if (self.state[name]) {
        return;
      }
      self.goalsCompleted++;
      self._notify(name);
      self.state[name] = true;
      if (opts.success) {
        opts.success();
      }
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
