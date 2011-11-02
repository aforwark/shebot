(function() {
  module.exports = function(robot) {
    return robot.respond(/(bitly|shorten) me (.+)$/, function(msg) {
      return msg.http("http://api.bitly.com/v3/shorten").query({
        login: process.env.HUBOT_BITLY_USERNAME,
        apiKey: process.env.HUBOT_BITLY_API_KEY,
        longUrl: msg.match[2],
        format: "json"
      }).get()(function(err, res, body) {
        var response;
        response = JSON.parse(body);
        return msg.send(response.status_code === 200 ? response.data.url : response.status_txt);
      });
    });
  };
}).call(this);
