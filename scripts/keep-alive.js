(function() {
  var HTTP, URL, frequency, ping;
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  HTTP = require("http");
  URL = require("url");
  frequency = 60000;
  ping = function(url) {
    var options, parsedUrl, req;
    parsedUrl = URL.parse(url);
    options = {
      host: parsedUrl.host,
      port: 80,
      path: '/',
      method: 'GET'
    };
    req = HTTP.request(options, function(res) {
      var body;
      body = "";
      res.setEncoding("utf8");
      res.on("data", function(chunk) {
        return body += chunk;
      });
      return res.on("end", function() {
        var data;
        return data = {
          response: {
            body: body,
            status: res.statusCode
          }
        };
      });
    });
    req.on("error", function(e) {});
    return req.end();
  };
  module.exports = function(robot) {
    var keepAlive;
    keepAlive = function() {
      var url, _base, _i, _len, _ref, _ref2;
      if ((_ref = (_base = robot.brain.data).keepalives) == null) {
        _base.keepalives = [];
      }
      _ref2 = robot.brain.data.keepalives;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        url = _ref2[_i];
        console.log(url);
        try {
          ping(url);
        } catch (e) {
          console.log("that probably isn't a url: " + url);
        }
      }
      return setTimeout((function() {
        return keepAlive();
      }), frequency);
    };
    keepAlive();
    robot.respond(/keep (.*) alive$/i, function(msg) {
      var url, _base, _ref;
      url = msg.match[1];
      if ((_ref = (_base = robot.brain.data).keepalives) == null) {
        _base.keepalives = [];
      }
      if (__indexOf.call(robot.brain.data.keepalives, url) >= 0) {
        return msg.send("I already am.");
      } else {
        robot.brain.data.keepalives.push(url);
        return msg.send("OK. I'll ping that url every " + frequency / 1000 + " seconds to make sure its alive.");
      }
    });
    robot.respond(/don'?t keep (.*) alive$/i, function(msg) {
      var url, _base, _ref;
      url = msg.match[1];
      if ((_ref = (_base = robot.brain.data).keepalives) == null) {
        _base.keepalives = [];
      }
      robot.brain.data.keepalives.pop(url);
      return msg.send("OK. I've removed that url from my list of urls to keep alive.");
    });
    return robot.respond(/what are you keeping alive/i, function(msg) {
      var _base, _ref;
      if ((_ref = (_base = robot.brain.data).keepalives) == null) {
        _base.keepalives = [];
      }
      if (robot.brain.data.keepalives.length > 0) {
        return msg.send("These are the urls I'm keeping alive\n\n" + robot.brain.data.keepalives.join('\n'));
      } else {
        return msg.send("i'm not currently keeping any urls alive. Why don't you add one.");
      }
    });
  };
}).call(this);
