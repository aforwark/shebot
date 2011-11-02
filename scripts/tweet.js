(function() {
  module.exports = function(robot) {
    return robot.respond(/(.*) tweet/i, function(msg) {
      var search;
      search = escape(msg.match[1]);
      return msg.http('http://search.twitter.com/search.json').query({
        q: search
      }).get()(function(err, res, body) {
        var tweet, tweets;
        tweets = JSON.parse(body);
        if ((tweets.results != null) && tweets.results.length > 0) {
          tweet = msg.random(tweets.results);
          return msg.send("http://twitter.com/#!/" + tweet.from_user + "/status/" + tweet.id_str);
        } else {
          return msg.reply("No one is tweeting about that.");
        }
      });
    });
  };
}).call(this);
