module.exports = function(robot) {
  return robot.respond(/(translate)( me)? (.*)/i, function(msg) {
    var term;
    term = "\"" + msg.match[3] + "\"";
    return msg.http("http://translate.google.com/translate_a/t").query({
      client: 't',
      hl: 'en',
      multires: 1,
      sc: 1,
      sl: 'auto',
      ssel: 0,
      tl: 'en',
      tsel: 0,
      uptl: "en",
      text: term
    }).get()(function(err, res, body) {
      var data, parsed;
      data = body;
      if (data.length > 4 && data[0] === '[') {
        parsed = eval(data);
        parsed = parsed[0] && parsed[0][0] && parsed[0][0][0];
        if (parsed) {
          return msg.send("" + term + " means " + parsed);
        }
      }
    });
  });
};