(function() {
  module.exports = function(robot) {
    return robot.respond(/define( me)? (.*)/i, function(msg) {
      var word;
      if (process.env.WORDNIK_API_KEY === void 0) {
        msg.send("Missing WORDNIK_API_KEY env variable.");
        return;
      }
      word = msg.match[2];
      return msg.http("http://api.wordnik.com/v4/word.json/" + (escape(word)) + "/definitions").header('api_key', process.env.WORDNIK_API_KEY).get()(function(err, res, body) {
        var definitions, lastSpeechType, reply;
        definitions = JSON.parse(body);
        if (definitions.length === 0) {
          return msg.send("No definitions for \"" + word + "\" found.");
        } else {
          reply = "Definitions for \"" + word + "\":\n";
          lastSpeechType = null;
          definitions = definitions.forEach(function(def) {
            if (def.partOfSpeech !== lastSpeechType) {
              if (def.partOfSpeech !== void 0) {
                reply += " (" + def.partOfSpeech + ")\n";
              }
            }
            lastSpeechType = def.partOfSpeech;
            return reply += "  - " + def.text + "\n";
          });
          return msg.send(reply);
        }
      });
    });
  };
}).call(this);
