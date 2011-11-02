(function() {
  var Wolfram;
  Wolfram = require('wolfram').createClient(process.env.HUBOT_WOLFRAM_APPID);
  module.exports = function(robot) {
    return robot.respond(/question (.*)$/i, function(msg) {
      return Wolfram.query(msg.match[1], function(e, result) {
        if (result && result.length > 0) {
          return msg.reply(result[1]['subpods'][0]['value']);
        } else {
          return msg.reply('Hmm...not sure.  Maybe I don\'t understand the question.');
        }
      });
    });
  };
}).call(this);
