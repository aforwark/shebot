var Sys;
var __hasProp = Object.prototype.hasOwnProperty;
Sys = require("sys");
module.exports = function(robot) {
  robot.respond(/show storage$/i, function(msg) {
    var output;
    output = Sys.inspect(robot.brain.data, false, 4);
    return msg.send(output);
  });
  return robot.respond(/show users$/i, function(msg) {
    var key, response, user, _ref;
    response = "";
    _ref = robot.brain.data.users;
    for (key in _ref) {
      if (!__hasProp.call(_ref, key)) continue;
      user = _ref[key];
      response += "" + user.id + " " + user.name;
      if (user.email_address) {
        response += " <" + user.email_address + ">";
      }
      response += "\n";
    }
    return msg.send(response);
  });
};