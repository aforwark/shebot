(function() {
  var JsDom;
  JsDom = require('jsdom');
  module.exports = function(robot) {
    var convertTemp, getDom, query;
    robot.respond(/forecast(?: me)?\s(.*)/, function(msg) {
      return query(msg, function(body, err) {
        var condition, day, element, high, low, strings, _i, _len, _ref;
        if (err) {
          return msg.send(err);
        }
        strings = [];
        _ref = body.getElementsByTagName('forecast_conditions');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          element = _ref[_i];
          day = element.getElementsByTagName('day_of_week')[0].getAttribute('data');
          low = element.getElementsByTagName('low')[0].getAttribute('data');
          high = element.getElementsByTagName('high')[0].getAttribute('data');
          condition = element.getElementsByTagName('condition')[0].getAttribute('data');
          strings.push("" + day + " " + condition + " high of: " + (convertTemp(high)) + " low of: " + (convertTemp(low)));
        }
        return msg.send(strings.join("\n"));
      });
    });
    robot.respond(/weather(?: me)?\s(.*)/, function(msg) {
      return query(msg, function(body, err) {
        var city, conditions, currentCondition, humidity, strings, temp;
        if (err) {
          return msg.send(err);
        }
        city = body.getElementsByTagName('city')[0];
        if (!city || !city.getAttribute) {
          return msg.send('No city -> no weather.');
        }
        strings = [];
        strings.push("Weather for " + (city.getAttribute('data')));
        currentCondition = body.getElementsByTagName('current_conditions')[0];
        conditions = currentCondition.getElementsByTagName('condition')[0];
        temp = currentCondition.getElementsByTagName('temp_c')[0];
        humidity = currentCondition.getElementsByTagName('humidity')[0];
        strings.push(("Current conditions: " + (conditions.getAttribute('data')) + " ") + ("" + (temp.getAttribute('data')) + "ºc"));
        strings.push(humidity.getAttribute('data'));
        return msg.send(strings.join("\n"));
      });
    });
    getDom = function(xml) {
      var body;
      body = JsDom.jsdom(xml);
      if (body.getElementsByTagName('weather')[0].childNodes.length === 0) {
        throw Error('No xml');
      }
      return body;
    };
    convertTemp = function(faren) {
      return ((5 / 9) * (faren - 32)).toFixed(0);
    };
    return query = function(msg, cb) {
      var location;
      location = msg.match[1];
      return msg.http('http://www.google.com/ig/api').query({
        weather: location
      }).get()(function(err, res, body) {
        try {
          body = getDom(body);
        } catch (err) {
          err = 'Could not fetch weather data :(';
        }
        return cb(body, err);
      });
    };
  };
}).call(this);
