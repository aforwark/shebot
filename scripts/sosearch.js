(function() {
  var hubot_stackapps_apikey, soSearch, wwwdude;
  wwwdude = require("wwwdude");
  hubot_stackapps_apikey = 'BeOjD228tEOZP6gbYoChsg';
  module.exports = function(robot) {
    return robot.respond(/sosearch( me)? (.*)/i, function(msg) {
      var opts, re;
      re = RegExp("(.*) with tags (.*)", "i");
      opts = msg.match[2].match(re);
      if (opts != null) {
        return soSearch(msg, escape(opts[1]), opts[2].split(','));
      } else {
        return soSearch(msg, escape(msg.match[2]), null);
      }
    });
  };
  soSearch = function(msg, search, tags) {
    var client, tag, tagged, _i, _len;
    client = wwwdude.createClient({
      headers: {
        'User-Agent': 'hubot search'
      },
      gzip: true,
      timeout: 500
    });
    tagged = '';
    if (tags != null) {
      for (_i = 0, _len = tags.length; _i < _len; _i++) {
        tag = tags[_i];
        tagged += "" + (tag.replace(/^\s+|\s+$/g, '')) + ";";
      }
      tagged = "&tagged=" + (escape(tagged.slice(0, (tagged.length - 2 + 1) || 9e9)));
    }
    return client.get("http://api.stackoverflow.com/1.1/search?intitle=" + search + tagged + "&key=" + hubot_stackapps_apikey).addListener('error', function(err) {
      console.log("Error: " + err);
      return msg.reply("Error while executing search.");
    }).addListener('http-error', function(data, resp) {
      console.log("Error code: " + resp.statusCode);
      return msg.reply("Error while executing search.");
    }).addListener('success', function(data, resp) {
      var ans, qs, question, results, _j, _len2, _results;
      results = JSON.parse(data);
      if (results.total > 0) {
        qs = (function() {
          var _j, _len2, _ref, _results;
          _ref = results.questions.slice(0, 6);
          _results = [];
          for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
            question = _ref[_j];
            _results.push("http://www.stackoverflow.com/questions/" + question.question_id + " - " + question.title);
          }
          return _results;
        })();
        if (results.total - 5 > 0) {
          qs.push("" + (results.total - 5) + " more...");
        }
        _results = [];
        for (_j = 0, _len2 = qs.length; _j < _len2; _j++) {
          ans = qs[_j];
          _results.push(msg.send(ans));
        }
        return _results;
      } else {
        return msg.reply("No questions found matching that search.");
      }
    });
  };
}).call(this);
