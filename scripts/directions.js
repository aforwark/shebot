(function() {
  var parse_directions;
  parse_directions = function(body) {
    var directions, final_directions, first_route, leg, _fn, _i, _len, _ref;
    directions = JSON.parse(body);
    first_route = directions.routes[0];
    if (!first_route) {
      return "Sorry, boss. Couldn't find directions";
    }
    final_directions = [];
    _ref = first_route.legs;
    _fn = function(leg) {
      var step, _j, _len2, _ref2, _results;
      final_directions.push("From: " + leg.start_address);
      final_directions.push("To:   " + leg.end_address);
      _ref2 = leg.steps;
      _results = [];
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        step = _ref2[_j];
        _results.push((function(step) {
          var instructions;
          instructions = step.html_instructions.replace(/<[^>]+>/g, '');
          return final_directions.push(instructions + (" (" + step.distance.text + ")"));
        })(step));
      }
      return _results;
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      leg = _ref[_i];
      _fn(leg);
    }
    return final_directions.join("\n");
  };
  module.exports = function(robot) {
    return robot.respond(/(get )?directions "((?:[^\\"]+|\\.)*)" "((?:[^\\"]+|\\.)*)"$/i, function(msg) {
      var destination, origin, _ref;
      _ref = msg.match.slice(2, 4), origin = _ref[0], destination = _ref[1];
      return msg.http("http://maps.googleapis.com/maps/api/directions/json").query({
        origin: origin,
        destination: destination,
        sensor: false
      }).get()(function(err, res, body) {
        return msg.send(parse_directions(body));
      });
    });
  };
}).call(this);
