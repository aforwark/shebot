(function() {
  var hashlib, webthumbhash;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  hashlib = require('hashlib');
  module.exports = function(robot) {
    return robot.respond(/webshot( me)? (.*)/i, function(msg) {
      var url;
      if (process.env.HUBOT_WEBTHUMB_USER && process.env.HUBOT_WEBTHUMB_API_KEY) {
        url = msg.match[2];
        console.log(url);
        return msg.send('http://webthumb.bluga.net/easythumb.php?user=' + process.env.HUBOT_WEBTHUMB_USER + '&url=' + encodeURIComponent(url) + '&size=large&hash=' + webthumbhash(process.env.HUBOT_WEBTHUMB_API_KEY, url) + '&cache=14#.jpeg');
      }
    });
  };
  webthumbhash = __bind(function(apikey, url) {
    var day, month, now, _ref, _ref2;
    now = new Date;
    now = new Date(now.getTime() - (now.getTimezoneOffset() * 1000));
    month = ((_ref = now.getUTCMonth() < 9) != null ? _ref : {
      '0': ''
    }) + (now.getUTCMonth() + 1);
    day = ((_ref2 = now.getUTCDate() < 10) != null ? _ref2 : {
      '0': ''
    }) + now.getUTCDate();
    return hashlib.md5(now.getUTCFullYear().toString() + month + day + url + apikey);
  }, this);
}).call(this);
