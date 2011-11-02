(function() {
  module.exports = function(robot) {
    return robot.respond(/show\s+(me\s+)?stories\s+(for\s+)?(.*)/i, function(msg) {
      var Parser, project_name, token;
      Parser = require("xml2js").Parser;
      token = process.env.HUBOT_PIVOTAL_TOKEN;
      project_name = msg.match[3];
      if (project_name === "") {
        project_name = RegExp(process.env.HUBOT_PIVOTAL_PROJECT, "i");
      } else {
        project_name = RegExp(project_name + ".*", "i");
      }
      return msg.http("http://www.pivotaltracker.com/services/v3/projects").headers({
        "X-TrackerToken": token
      }).get()(function(err, res, body) {
        if (err) {
          msg.send("Pivotal says: " + err);
          return;
        }
        return (new Parser).parseString(body, function(err, json) {
          var project, _i, _len, _ref;
          _ref = json.project;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            project = _ref[_i];
            if (project_name.test(project.name)) {
              msg.http("https://www.pivotaltracker.com/services/v3/projects/" + project.id + "/stories").headers({
                "X-TrackerToken": token
              }).query({
                filter: "state:unstarted,started,finished,delivered"
              }).get()(function(err, res, body) {
                if (err) {
                  msg.send("Pivotal says: " + err);
                  return;
                }
                return (new Parser).parseString(body, function(err, json) {
                  var message, story, _j, _len2, _ref2, _results;
                  _ref2 = json.story;
                  _results = [];
                  for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
                    story = _ref2[_j];
                    message = "#" + story.id['#'] + " " + story.name;
                    if (story.owned_by) {
                      message += " (" + story.owned_by + ")";
                    }
                    if (story.current_state && story.current_state !== "unstarted") {
                      message += " is " + story.current_state;
                    }
                    _results.push(msg.send(message));
                  }
                  return _results;
                });
              });
              return;
            }
          }
          return msg.send("No project " + project_name);
        });
      });
    });
  };
}).call(this);
