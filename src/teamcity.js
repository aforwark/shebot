(function() {
  module.exports = function(robot) {
    return robot.respond(/show (me )?builds/i, function(msg) {
      var hostname, password, username;
      username = process.env.HUBOT_TEAMCITY_USERNAME;
      password = process.env.HUBOT_TEAMCITY_PASSWORD;
      hostname = process.env.HUBOT_TEAMCITY_HOSTNAME;
      return msg.http("http://" + hostname + "/app/rest/builds").query({
        locator: ["running:any", "count:3"].join(",")
      }).headers({
        Authorization: "Basic " + (new Buffer("" + username + ":" + password).toString("base64")),
        Accept: "application/json"
      }).get()(function(err, res, body) {
        var build, builds, displayBuild, _i, _len, _results;
        if (err) {
          msg.send("Team city says: " + err);
          return;
        }
        builds = JSON.parse(body).build.sort(function(a, b) {
          return parseInt(b.number) - parseInt(a.number);
        });
        displayBuild = function(msg, build) {
          return msg.http("http://" + hostname + build.href).headers({
            Authorization: "Basic " + (new Buffer("" + username + ":" + password).toString("base64")),
            Accept: "application/json"
          }).get()(function(err, res, body) {
            var elapsed, project, seconds, started;
            if (err) {
              msg.send("Team city says: " + err);
              return;
            }
            project = JSON.parse(body);
            if (build.running) {
              started = Date.parse(build.startDate.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})([+\-]\d{4})/, "$1-$2-$3T$4:$5:$6$7"));
              elapsed = (Date.now() - started) / 1000;
              seconds = "" + Math.floor(elapsed % 60);
              if (seconds.length < 2) {
                seconds = "0" + seconds;
              }
              return msg.send("" + project.buildType.projectName + " - " + build.number + ", " + build.percentageComplete + "% complete, " + (Math.floor(elapsed / 60)) + ":" + seconds + " minutes");
            } else if (build.status === "SUCCESS") {
              return msg.send("" + project.buildType.projectName + " - " + build.number + " is full of win");
            } else if (build.status === "FAILUED") {
              return msg.send("" + project.buildType.projectName + " - " + build.number + " is #fail");
            }
          });
        };
        _results = [];
        for (_i = 0, _len = builds.length; _i < _len; _i++) {
          build = builds[_i];
          _results.push(displayBuild(msg, build));
        }
        return _results;
      });
    });
  };
}).call(this);
