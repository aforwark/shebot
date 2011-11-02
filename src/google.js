(function() {
  var googleMe;
  module.exports = function(robot) {
    return robot.respond(/(google)( me)? (.*)/i, function(msg) {
      return googleMe(msg, msg.match[3], function(url) {
        return msg.send(url);
      });
    });
  };
  googleMe = function(msg, query, cb) {
    return msg.http('http://www.google.com/search').query({
      q: query
    }).get()(function(err, res, body) {
      var _ref;
      return cb(((_ref = body.match(/<a href="([^"]*)" class=l>/)) != null ? _ref[1] : void 0) || ("Sorry, Google had zero results for '" + query + "'"));
    });
  };
}).call(this);
