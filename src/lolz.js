(function() {
  var HtmlParser, Select;
  Select = require("soupselect").select;
  HtmlParser = require("htmlparser");
  module.exports = function(robot) {
    return robot.respond(/.*l[ou]lz/i, function(msg) {
      return msg.http("http://bukk.it").get()(function(err, res, body) {
        var handler, link, parser, results;
        handler = new HtmlParser.DefaultHandler();
        parser = new HtmlParser.Parser(handler);
        parser.parseComplete(body);
        results = (function() {
          var _i, _len, _ref, _results;
          _ref = Select(handler.dom, "td a");
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            link = _ref[_i];
            _results.push("http://bukk.it/" + link.attribs.href);
          }
          return _results;
        })();
        return msg.send(msg.random(results));
      });
    });
  };
}).call(this);
