(function() {
  module.exports = function(robot) {
    return robot.respond(/travis me (.*)/i, function(msg) {
      var project;
      project = escape(msg.match[1]);
      return msg.http("http://travis-ci.org/" + project + ".json").get()(function(err, res, body) {
        var response;
        response = JSON.parse(body);
        if (response.last_build_status === 0) {
          return msg.send("Build status for " + project + ": Passing");
        } else if (response.last_build_status === 1) {
          return msg.send("Build status for " + project + ": Failing");
        } else {
          return msg.send("Build status for " + project + ": Unknown");
        }
      });
    });
  };
}).call(this);
