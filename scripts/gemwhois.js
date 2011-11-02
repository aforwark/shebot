(function() {
  module.exports = function(robot) {
    return robot.respond(/gem whois (.*)/i, function(msg) {
      var gemname;
      gemname = escape(msg.match[1]);
      return msg.http("http://rubygems.org/api/v1/gems/" + gemname + ".json").get()(function(err, res, body) {
        var json;
        try {
          json = JSON.parse(body);
          return msg.send("   gem name: " + json.name + "\n     owners: " + json.authors + "\n       info: " + json.info + "\n    version: " + json.version + "\n  downloads: " + json.downloads + "\n");
        } catch (err) {
          return msg.send("Gem not found. It will be mine. Oh yes. It will be mine. *sinister laugh*");
        }
      });
    });
  };
}).call(this);
