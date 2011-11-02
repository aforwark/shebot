(function() {
  module.exports = function(robot) {
    return robot.respond(/newrelic me/i, function(msg) {
      var Parser, accountId, apiKey, appId;
      accountId = process.env.HUBOT_NEWRELIC_ACCOUNT_ID;
      appId = process.env.HUBOT_NEWRELIC_APP_ID;
      apiKey = process.env.HUBOT_NEWRELIC_API_KEY;
      Parser = require("xml2js").Parser;
      return msg.http("https://rpm.newrelic.com/accounts/" + accountId + "/applications/" + appId + "/threshold_values.xml?api_key=" + apiKey).get()(function(err, res, body) {
        if (err) {
          msg.send("New Relic says: " + err);
          return;
        }
        return (new Parser).parseString(body, function(err, json) {
          var threshold_value, _i, _len, _ref;
          _ref = json['threshold_value'];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            threshold_value = _ref[_i];
            msg.send("  " + threshold_value['@']['name'] + " : " + threshold_value['@']['formatted_metric_value']);
          }
          return msg.send("  https://rpm.newrelic.com/accounts/" + accountId + "/applications/" + appId);
        });
      });
    });
  };
}).call(this);
