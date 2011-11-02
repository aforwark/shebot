(function() {
  var responses;
  responses = ["You're welcome", "No problem", "Anytime", "That's what I'm here for!", "You are more than welcome", "You don't have to thank me, I'm your loyal servant", "Don't mention it."];
  module.exports = function(robot) {
    return robot.respond(/(thanks|thank you|cheers|nice one)/i, function(msg) {
      return msg.send(msg.random(responses));
    });
  };
}).call(this);
