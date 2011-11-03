(function() {
    var sprintf;

    sprintf = require("sprintf").sprintf;

    module.exports = function(robot) {
        var baseUrl = 'https://graph.facebook.com/?id=';

        return robot.hear(/likes? (for )?(https?:\/\/[\S]+)/i, function(msg) {
            var url;
            url = baseUrl + escape(msg.match[1]);

            return msg.http(url).get()(function(err, res, body) {
                var object;
                if (res.statusCode === 200) {
                    object = JSON.parse(body);

                    return msg.send(sprintf('Likes: %d', object.shares));
                }
            });
        });
    };
}).call(this);
