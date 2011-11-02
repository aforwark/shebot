(function() {
  module.exports = function(robot) {
    return robot.hear(/hide ya kids/i, function(msg) {
      return msg.send("http://www.youtube.com/watch?v=hMtZfW2z9dw");
    });
  };
}).call(this);
