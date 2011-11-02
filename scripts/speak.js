(function() {
  module.exports = function(robot) {
    return robot.hear(/(speak)( me)? (.*)/i, function(msg) {
      var apiKey, detect, getLanguagesForSpeak, langs, speak, term;
      term = "\"" + msg.match[3] + "\"";
      apiKey = process.env.HUBOT_MSTRANSLATE_APIKEY;
      langs = ["en"];
      getLanguagesForSpeak = "http://api.microsofttranslator.com/V2/Ajax.svc/GetLanguagesForSpeak";
      detect = "http://api.microsofttranslator.com/V2/Ajax.svc/Detect";
      speak = "http://api.microsofttranslator.com/V2/Ajax.svc/Speak";
      if (!apiKey) {
        msg.send("MS Translate API key isn't set, get a key at http://www.bing.com/developers/appids.aspx");
        msg.send("Then, set the HUBOT_MSTRANSLATE_APIKEY environment variable");
        return;
      }
      return msg.http(getLanguagesForSpeak).query({
        appId: apiKey
      }).get()(function(err, res, body) {
        if (!err) {
          langs = eval(body);
        }
        return msg.http(detect).query({
          appId: apiKey,
          text: term
        }).get()(function(err, res, body) {
          var lang;
          if (err || (langs.indexOf(eval(body)) === -1)) {
            msg.send("Sorry, I can't speak " + (err || eval(body)));
            return;
          }
          lang = eval(body);
          return msg.http(speak).query({
            appId: apiKey,
            text: term,
            language: lang,
            format: "audio/wav"
          }).get()(function(err, res, body) {
            if (!err) {
              return msg.send(eval(body));
            }
          });
        });
      });
    });
  };
}).call(this);
