(function() {
  module.exports = function(robot) {
    return robot.respond(/ascii( me)? (.+)/i, function(msg) {
      return msg.http("http://asciime.heroku.com/generate_ascii").query({
        s: msg.match[2]
      }).get()(function(err, res, body) {
        return msg.send(body);
      });
    });
  };
}).call(this);
