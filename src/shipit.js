(function() {
  var squirrels;
  squirrels = ["http://img.skitch.com/20100714-d6q52xajfh4cimxr3888yb77ru.jpg", "https://img.skitch.com/20111026-r2wsngtu4jftwxmsytdke6arwd.png"];
  module.exports = function(robot) {
    return robot.hear(/ship it/i, function(msg) {
      return msg.send(msg.random(squirrels));
    });
  };
}).call(this);
