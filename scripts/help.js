module.exports = function(robot) {
  return robot.respond(/help$/i, function(msg) {
    return msg.send(robot.helpCommands().join("\n"));
  });
};