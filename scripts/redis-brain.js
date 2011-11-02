(function() {
  var Redis, Url;
  Url = require("url");
  Redis = require("redis");
  module.exports = function(robot) {
    var client, info;
    info = Url.parse(process.env.REDISTOGO_URL || 'redis://localhost:6379');
    client = Redis.createClient(info.port, info.hostname);
    if (info.auth) {
      client.auth(info.auth.split(":")[1]);
    }
    client.on("error", function(err) {
      return console.log("Error " + err);
    });
    client.on("connect", function() {
      console.log("Successfully connected to Redis");
      return client.get("hubot:storage", function(err, reply) {
        if (err) {
          throw err;
        } else if (reply) {
          return robot.brain.mergeData(JSON.parse(reply.toString()));
        }
      });
    });
    robot.brain.on('save', function(data) {
      return client.set('hubot:storage', JSON.stringify(data));
    });
    return robot.brain.on('close', function() {
      return client.quit();
    });
  };
}).call(this);
