(function() {
  var memeGenerator;
  module.exports = function(robot) {
    robot.respond(/Y U NO (.+)/i, function(msg) {
      var caption;
      caption = msg.match[1] || "";
      return memeGenerator(msg, 2, 166088, "Y U NO", caption, function(url) {
        return msg.send(url);
      });
    });
    robot.respond(/(I DON'?T ALWAYS .*) (BUT WHEN I DO .*)/i, function(msg) {
      return memeGenerator(msg, 74, 2485, msg.match[1], msg.match[2], function(url) {
        return msg.send(url);
      });
    });
    robot.respond(/(.*)(O\s?RLY\??.*)/i, function(msg) {
      return memeGenerator(msg, 920, 117049, msg.match[1], msg.match[2], function(url) {
        return msg.send(url);
      });
    });
    robot.respond(/(.*)(SUCCESS|NAILED IT.*)/i, function(msg) {
      return memeGenerator(msg, 121, 1031, msg.match[1], msg.match[2], function(url) {
        return msg.send(url);
      });
    });
    return robot.respond(/(.*) (ALL the .*)/, function(msg) {
      return memeGenerator(msg, 6013, 1121885, msg.match[1], msg.match[2], function(url) {
        return msg.send(url);
      });
    });
  };
  memeGenerator = function(msg, generatorID, imageID, text0, text1, callback) {
    var password, username;
    username = process.env.HUBOT_MEMEGEN_USERNAME;
    password = process.env.HUBOT_MEMEGEN_PASSWORD;
    if (!username) {
      msg.send("MemeGenerator username isn't set. Sign up at http://memegenerator.net");
      msg.send("Then set the HUBOT_MEMEGEN_USERNAME environment variable");
      return;
    }
    if (!password) {
      msg.send("MemeGenerator password isn't set. Sign up at http://memegenerator.net");
      msg.send("Then set the HUBOT_MEMEGEN_PASSWORD environment variable");
      return;
    }
    return msg.http('http://version1.api.memegenerator.net/Instance_Create').query({
      username: username,
      password: password,
      languageCode: 'en',
      generatorID: generatorID,
      imageID: imageID,
      text0: text0,
      text1: text1
    }).get()(function(err, res, body) {
      var img, instanceURL, result;
      result = JSON.parse(body)['result'];
      instanceURL = result['instanceUrl'];
      img = "http://memegenerator.net" + result['instanceImageUrl'];
      return msg.http(instanceURL).get()(function(err, res, body) {
        return callback(img);
      });
    });
  };
}).call(this);
