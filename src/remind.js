(function() {
  var Reminder, Reminders;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Reminders = (function() {
    function Reminders(robot) {
      this.robot = robot;
      this.cache = [];
      this.current_timeout = null;
      this.robot.brain.on('loaded', __bind(function() {
        if (this.robot.brain.data.reminders) {
          this.cache = this.robot.brain.data.reminders;
          return this.queue();
        }
      }, this));
    }
    Reminders.prototype.add = function(reminder) {
      this.cache.push(reminder);
      this.cache.sort(function(a, b) {
        return a.due - b.due;
      });
      this.robot.brain.data.reminders = this.cache;
      return this.queue();
    };
    Reminders.prototype.removeFirst = function() {
      var reminder;
      reminder = this.cache.shift();
      this.robot.brain.data.reminders = this.cache;
      return reminder;
    };
    Reminders.prototype.queue = function() {
      var now, trigger;
      if (this.current_timeout) {
        clearTimeout(this.current_timeout);
      }
      if (this.cache.length > 0) {
        now = new Date().getTime();
        while (!(this.cache.length === 0 || this.cache[0].due > now)) {
          this.removeFirst();
        }
        if (this.cache.length > 0) {
          trigger = __bind(function() {
            var reminder;
            reminder = this.removeFirst();
            this.robot.send(reminder["for"], reminder["for"].name + ', you asked me to remind you to ' + reminder.action);
            return this.queue();
          }, this);
          return this.current_timeout = setTimeout(trigger, this.cache[0].due - now);
        }
      }
    };
    return Reminders;
  })();
  Reminder = (function() {
    function Reminder(_for, time, action) {
      var matches, pattern, period, periods;
      this["for"] = _for;
      this.time = time;
      this.action = action;
      this.time.replace(/^\s+|\s+$/g, '');
      periods = {
        weeks: {
          value: 0,
          regex: "weeks?"
        },
        days: {
          value: 0,
          regex: "days?"
        },
        hours: {
          value: 0,
          regex: "hours?|hrs?"
        },
        minutes: {
          value: 0,
          regex: "minutes?|mins?"
        },
        seconds: {
          value: 0,
          regex: "seconds?|secs?"
        }
      };
      for (period in periods) {
        pattern = new RegExp('^.*?([\\d\\.]+)\\s*(?:(?:' + periods[period].regex + ')).*$', 'i');
        matches = pattern.exec(this.time);
        if (matches) {
          periods[period].value = parseInt(matches[1]);
        }
      }
      this.due = new Date().getTime();
      this.due += ((periods.weeks.value * 604800) + (periods.days.value * 86400) + (periods.hours.value * 3600) + (periods.minutes.value * 60) + periods.seconds.value) * 1000;
    }
    Reminder.prototype.dueDate = function() {
      var dueDate;
      dueDate = new Date(this.due);
      return dueDate.toLocaleString();
    };
    return Reminder;
  })();
  module.exports = function(robot) {
    var reminders;
    reminders = new Reminders(robot);
    return robot.respond(/remind me in ((?:(?:\d+) (?:weeks?|days?|hours?|hrs?|minutes?|mins?|seconds?|secs?)[ ,]*(?:and)? +)+)to (.*)/i, function(msg) {
      var action, reminder, time;
      time = msg.match[1];
      action = msg.match[2];
      reminder = new Reminder(msg.message.user, time, action);
      reminders.add(reminder);
      return msg.send('I\'ll remind you to ' + action + ' on ' + reminder.dueDate());
    });
  };
}).call(this);
