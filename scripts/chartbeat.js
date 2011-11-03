(function() {
    var sprintf;

    sprintf = require("sprintf").sprintf;

    module.exports = function(robot) {
        var client, chartbeat;
        function getClient() {
            if (!client) {
                if (process.env.HUBOT_CHARTBEAT_APIKEY === void 0) {
                    msg.send("Missing HUBOT_CHARTBEAT_APIKEY env variable.");
                    return;
                }
                
                if (process.env.HUBOT_CHARTBEAT_HOSTS === void 0) {
                    msg.send("Missing HUBOT_CHARTBEAT_HOSTS env variable.");
                    return;
                }
                
                client = require('chartbeat-api').createClient({
                    apiKey: process.env.HUBOT_CHARTBEAT_APIKEY,
                    hosts: process.env.HUBOT_CHARTBEAT_HOSTS
                });
            }
            
            return client;
        }
        
        return robot.hear(/^how many people are on ([-a-z0-9\.]+)( right now)?\??/i, function(msg) {
            var host;
            host = msg.match[1];

            getClient().request('quickstats', { host:host }, function (data) {
                msg.send(sprintf("There are %s people on %s right now", data.people, host));
            });
        });
    };
}).call(this);
