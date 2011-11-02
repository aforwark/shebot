(function() {
  var bingMe;
  module.exports = function(robot) {
    return robot.respond(/(bing)( me)? (.*)/i, function(msg) {
      return bingMe(msg, msg.match[3], function(url) {
        return msg.send(url);
      });
    });
  };
  bingMe = function(msg, query, cb) {
    return msg.http('http://www.bing.com/search').query({
      q: query
    }).get()(function(err, res, body) {
      var _ref;
      return cb(((_ref = body.match(/<div class="sb_tlst"><h3><a href="([^"]*)"/)) != null ? _ref[1] : void 0) || ("Sorry, Bing had zero results for '" + query + "'"));
    });
  };
}).call(this);
