(function() {
  module.exports = function(robot) {
    return robot.respond(/giftv( me)?$/i, function(msg) {
      return msg.http('http://www.gif.tv/gifs/get.php').get()(function(err, res, body) {
        return msg.send('http://www.gif.tv/gifs/' + body + '.gif' || 'Could not compute.');
      });
    });
  };
}).call(this);
