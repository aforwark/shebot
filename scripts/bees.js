(function() {
  module.exports = function(robot) {
    return robot.respond(/bees/i, function(message) {
      return message.send("http://thechive.files.wordpress.com/2010/11/oprah-bees.gif");
    });
  };
}).call(this);
