(function() {
  module.exports = function(robot) {
    return robot.respond(/what's playing (.*)/i, function(msg) {
      var apiKey, user;
      user = escape(msg.match[1]);
      apiKey = process.env.HUBOT_LASTFM_APIKEY;
      return msg.http('http://ws.audioscrobbler.com/2.0/?').query({
        method: 'user.getrecenttracks',
        user: user,
        api_key: apiKey,
        format: 'json'
      }).get()(function(err, res, body) {
        var results, song;
        results = JSON.parse(body);
        if (results.error) {
          msg.send(results.message);
          return;
        }
        song = results.recenttracks.track[0];
        return msg.send("" + song.name + " by " + song.artist['#text']);
      });
    });
  };
}).call(this);
