(function() {
  module.exports = function(robot) {
    return robot.respond(/show\s+(me\s+)?issues\s+(for\s+)?(.*)/i, function(msg) {
      var oauth_token, repo;
      oauth_token = process.env.HUBOT_GITHUB_TOKEN;
      repo = msg.match[3].toLowerCase();
      if (!~repo.indexOf("/")) {
        repo = "" + process.env.HUBOT_GITHUB_USER + "/" + repo;
      }
      return msg.http("https://api.github.com/repos/" + repo + "/issues").headers({
        Authorization: "token " + oauth_token,
        Accept: "application/json"
      }).query({
        state: "open",
        sort: "created"
      }).get()(function(err, res, body) {
        var assignee, issue, issues, label, labels, _i, _len, _results;
        if (err) {
          msg.send("GitHub says: " + err);
          return;
        }
        issues = JSON.parse(body);
        if (issues.length === 0) {
          return msg.send("Achievement unlocked: issues zero!");
        } else {
          _results = [];
          for (_i = 0, _len = issues.length; _i < _len; _i++) {
            issue = issues[_i];
            labels = ((function() {
              var _j, _len2, _ref, _results2;
              _ref = issue.labels;
              _results2 = [];
              for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
                label = _ref[_j];
                _results2.push("#" + label.name);
              }
              return _results2;
            })()).join(" ");
            assignee = issue.assignee ? " (" + issue.assignee.login + ")" : "";
            _results.push(msg.send("[" + issue.number + "] " + issue.title + " " + labels + assignee + " = " + issue.html_url));
          }
          return _results;
        }
      });
    });
  };
}).call(this);
