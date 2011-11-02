(function() {
  module.exports = function(robot) {
    return robot.respond(/xkcd\s?(\d+)?/i, function(msg) {
      var num;
      if (msg.match[1] === void 0) {
        num = '';
      } else {
        num = "" + msg.match[1] + "/";
      }
      return msg.http("http://xkcd.com/" + num + "info.0.json").get()(function(err, res, body) {
        var object;
        if (res.statusCode === 404) {
          return msg.send('Comic not found.');
        } else {
          object = JSON.parse(body);
          msg.send(object.alt);
          msg.send(object.title);
          return msg.send(object.img);
        }
      });
    });
  };
}).call(this);
