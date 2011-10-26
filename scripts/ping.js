module.exports = function(robot) {
  robot.respond(/PING$/i, function(msg) {
    return msg.send("PONG");
  });
  robot.respond(/ECHO (.*)$/i, function(msg) {
    return msg.send(msg.match[1]);
  });
  robot.respond(/TIME$/i, function(msg) {
    return msg.send("Server time is: " + (new Date()));
  });
  return robot.respond(/DIE$/i, function(msg) {
    msg.send("Goodbye, cruel world.");
    return process.exit(0);
  });
};