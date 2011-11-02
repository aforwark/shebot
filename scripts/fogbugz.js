(function() {
  var Parser, env, util;
  Parser = require('xml2js').Parser;
  env = process.env;
  util = require('util');
  module.exports = function(robot) {
    if (env.HUBOT_FOGBUGZ_HOST && env.HUBOT_FOGBUGZ_TOKEN) {
      return robot.hear(/(?:(?:fog)?bugz?|case) (\d+)/, function(msg) {
        return msg.http("https://" + env.HUBOT_FOGBUGZ_HOST + "/api.asp").query({
          cmd: "search",
          token: env.HUBOT_FOGBUGZ_TOKEN,
          q: msg.match[1],
          cols: "ixBug,sTitle,sStatus,sProject,sArea,sPersonAssignedTo,ixPriority,sPriority,sLatestTextSummary"
        }).post()(function(err, res, body) {
          return (new Parser()).parseString(body, function(err, json) {
            var bug, details, truncate, _ref;
            truncate = function(text, length, suffix) {
              if (length == null) {
                length = 60;
              }
              if (suffix == null) {
                suffix = "...";
              }
              if (text.length > length) {
                return text.substr(0, length - suffix.length) + suffix;
              } else {
                return text;
              }
            };
            bug = (_ref = json.cases) != null ? _ref["case"] : void 0;
            if (bug) {
              msg.send("https://" + env.HUBOT_FOGBUGZ_HOST + "/?" + bug.ixBug);
              details = ["FogBugz " + bug.ixBug + ": " + bug.sTitle, "  Priority: " + bug.ixPriority + " - " + bug.sPriority, "  Project: " + bug.sProject + " (" + bug.sArea + ")", "  Status: " + bug.sStatus, "  Assigned To: " + bug.sPersonAssignedTo, "  Latest Comment: " + (truncate(bug.sLatestTextSummary))];
              return msg.send(details.join("\n"));
            }
          });
        });
      });
    }
  };
}).call(this);
