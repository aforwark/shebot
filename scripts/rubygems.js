(function() {
  module.exports = function(robot) {
    return robot.respond(/there's a gem for (.*)/i, function(msg) {
      var search;
      search = escape(msg.match[1]);
      return msg.http('https://rubygems.org/api/v1/search.json').query({
        query: search
      }).get()(function(err, res, body) {
        var result, results;
        results = JSON.parse(body);
        result = results[0];
        return msg.send("https://rubygems.org/gems/" + result.name);
      });
    });
  };
}).call(this);
