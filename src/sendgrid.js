(function() {
  var env, formatResponse, query, stats;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  env = process.env;
  module.exports = function(robot) {
    if (env.HUBOT_SENDGRID_USER && env.HUBOT_SENDGRID_KEY) {
      robot.respond(/(sendgrid)( me)? today/i, function(msg) {
        var opts;
        opts = {
          days: 0
        };
        return query(msg, opts, function(json) {
          return msg.send(formatResponse(json[0]));
        });
      });
      robot.respond(/(sendgrid)( me)? total/i, function(msg) {
        var opts;
        opts = {
          aggregate: 1
        };
        return query(msg, opts, function(json) {
          return msg.send(formatResponse(json));
        });
      });
      return robot.respond(/(sendgrid)( me)? c(ategory)? (.*)/i, function(msg) {
        var category, opts;
        category = msg.match[4];
        msg.send("Category: " + category);
        opts = {
          days: 0,
          category: [category]
        };
        return query(msg, opts, function(json) {
          return msg.send(formatResponse(json[0]));
        });
      });
    }
  };
  query = function(msg, opts, callback) {
    opts.api_user = env.HUBOT_SENDGRID_USER;
    opts.api_key = env.HUBOT_SENDGRID_KEY;
    return msg.http("https://sendgrid.com/api/stats.get.json").query(opts).get()(function(err, res, body) {
      return callback(JSON.parse(body));
    });
  };
  stats = {
    requests: 'Requests',
    delivered: 'Delivered',
    bounces: 'Bounces',
    repeat_bounces: 'Repeat Bounces',
    invalid_email: 'Invalid Emails',
    opens: 'Opens',
    unique_opens: 'Unique Opens',
    clicks: 'Clicks',
    unique_clicks: 'Unique Clicks',
    unsubscribes: 'Unsubscribes',
    repeat_unsubscribes: 'Repeat Unsubscribes',
    blocked: 'Blocked',
    spam_drop: 'Spam Drop',
    spamreports: 'Spam Reports',
    repeat_spamreports: 'Repeat Spam Reports'
  };
  formatResponse = __bind(function(json) {
    var description, details, stat;
    details = (function() {
      var _results;
      _results = [];
      for (stat in stats) {
        description = stats[stat];
        _results.push("  " + description + ": " + json[stat]);
      }
      return _results;
    })();
    details.unshift("Stats for " + json.date + ":");
    return details.join("\n");
  }, this);
}).call(this);
