(function() {
  module.exports = function(robot) {
    return robot.respond(/(sudo)(.*)/i, function(msg) {
      var _ref;
      return msg.send("Alright. I'll " + (((_ref = msg.match) != null ? _ref[2] : void 0) || "do whatever it is you wanted."));
    });
  };
}).call(this);
