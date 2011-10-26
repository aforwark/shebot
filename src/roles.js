var __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
};
module.exports = function(robot) {
  robot.respond(/who is ([\w .-]+)\?*$/i, function(msg) {
    var name, user;
    name = msg.match[1];
    if (name === "you") {
      return msg.send("Who ain't I?");
    } else if (name === robot.name) {
      return msg.send("The best.");
    } else if (user = robot.userForName(name)) {
      user.roles = user.roles || [];
      if (user.roles.length > 0) {
        return msg.send("" + name + " is " + (user.roles.join(", ")) + ".");
      } else {
        return msg.send("" + name + " is nothing to me.");
      }
    } else {
      return msg.send("" + name + "? Never heard of 'em");
    }
  });
  robot.respond(/([\w .-]+) is (["'\w: ]+)[.!]*$/i, function(msg) {
    var name, newRole, user;
    name = msg.match[1];
    newRole = msg.match[2].trim();
    if (name !== 'who' && name !== 'what' && name !== 'where' && name !== 'when' && name !== 'why') {
      if (!newRole.match(/^not\s+/i)) {
        if (user = robot.userForName(name)) {
          user.roles = user.roles || [];
          if (__indexOf.call(user.roles, newRole) >= 0) {
            return msg.send("I know");
          } else {
            user.roles.push(newRole);
            if (name.toLowerCase() === robot.name) {
              return msg.send("Ok, I am " + newRole + ".");
            } else {
              return msg.send("Ok, " + name + " is " + newRole + ".");
            }
          }
        } else {
          return msg.send("I don't know anything about " + name + ".");
        }
      }
    }
  });
  return robot.respond(/([\w .-]+) is not (["'\w: ]+)[.!]*$/i, function(msg) {
    var name, newRole, role, user;
    name = msg.match[1];
    newRole = msg.match[2].trim();
    if (name !== 'who' && name !== 'what' && name !== 'where' && name !== 'when' && name !== 'why') {
      if (user = robot.userForName(name)) {
        user.roles = user.roles || [];
        if (__indexOf.call(user.roles, newRole) < 0) {
          return msg.send("I know.");
        } else {
          user.roles = (function() {
            var _i, _len, _ref, _results;
            _ref = user.roles;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              role = _ref[_i];
              if (role !== newRole) {
                _results.push(role);
              }
            }
            return _results;
          })();
          return msg.send("Ok, " + name + " is no longer " + newRole + ".");
        }
      } else {
        return msg.send("I don't know anything about " + name + ".");
      }
    }
  });
};