(function() {
  var disruptionApiUrl, disruptionPageRoot, findDisruptions, sendDisruptions, xml2js;
  xml2js = require('xml2js');
  disruptionApiUrl = 'http://webservices.ns.nl/ns-api-storingen';
  disruptionPageRoot = 'http://www.ns.nl/storingen/index.form#';
  module.exports = function(robot) {
    return robot.respond(/train disruptions (.*)/i, function(msg) {
      var station;
      station = msg.match[1];
      station.replace(/^\s+|\s+$/g, "");
      return findDisruptions(msg, station, function(list) {
        if (list.Ongepland === void 0 || list.Gepland === void 0) {
          msg.send("Sorry, that didn't work. Perhaps the NS API is down or your credentials are wrong?");
          return;
        }
        if (list.Ongepland[0].Storing === void 0) {
          msg.send("There are no unplanned disruptions around '" + station + "'");
        } else {
          sendDisruptions(list.Ongepland[0].Storing, msg, false);
        }
        if (list.Gepland[0].Storing === void 0) {
          return msg.send("There are no planned maintenance disruptions around '" + station + "'");
        } else {
          return sendDisruptions(list.Gepland[0].Storing, msg, true);
        }
      });
    });
  };
  findDisruptions = function(msg, station, callback) {
    var auth, parser, password, url, username;
    url = disruptionApiUrl;
    username = process.env.HUBOT_NS_API_EMAIL;
    password = process.env.HUBOT_NS_API_PASSWORD;
    auth = "Basic " + new Buffer(username + ':' + password).toString('base64');
    parser = new xml2js.Parser({
      explicitArray: true
    });
    return msg.http(url).header('Authorization', auth).query({
      station: station,
      actual: false,
      unplanned: false
    }).get()(function(err, res, body) {
      return parser.parseString(body, function(err, result) {
        return callback(result);
      });
    });
  };
  sendDisruptions = function(disruptions, msg, planned) {
    var disruption, output, type, urlInfix, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = disruptions.length; _i < _len; _i++) {
      disruption = disruptions[_i];
      if (planned) {
        type = '';
        urlInfix = 'werkzaamheden-';
      } else {
        type = ':warning:';
        urlInfix = '';
      }
      output = [type, disruption.Traject[0], "(" + disruption.Reden[0] + ").", "More info: " + disruptionPageRoot + urlInfix + disruption.id[0]];
      _results.push(msg.send(output.join(' ')));
    }
    return _results;
  };
}).call(this);
