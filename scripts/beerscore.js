(function() {
    var sprintf;

    sprintf = require("sprintf").sprintf;

    module.exports = function(robot) {
        var baseUrl = 'http://caedmon.net/beerscore/';

        return robot.hear(/^beer ?score\s+(.+)/i, function(msg) {
            var beer;
            beer = escape(msg.match[1]);
            console.log("Request: " + baseUrl+beer);
            return msg.http(baseUrl+beer).get()(function(err, res, body) {
                var object, found = 0;
                if (res.statusCode !== 200) {
                    return msg.send('Beer not found.');
                } else {
                    object = JSON.parse(body);

                    switch (object.type) {
                        case 'REFINE':
                            return msg.send(sprintf('There were %d beers found. %s', object.num, object.searchurl));

                        case 'SEARCH':
                            for (var i = 0, len = object.beer.length; i < len; i++) {
                                var beer = object.beer[i];

                                if (beer.score) {
                                    msg.send(sprintf('rating for "%s" = %s (%s)', beer.name, beer.score, beer.url));

                                    found++;
                                } else {
                                    msg.send(sprintf('(%s -> %s)', beer.name, beer.url));
                                }
                            }

                            var num = object.num - found;
                            return msg.send(sprintf('%d %sresults...', num, num > 0 ? 'more ' : ''));

                        case 'SCORE':
                            for (var i = 0, len = object.beer.length; i < len; i++) {
                                var beer = object.beer[i];

                                msg.send(sprintf('rating for "%s" = %s (%s)', beer.name, beer.score, beer.url));
                            }

                            return;
                    }

                }
            });
        });
    };
}).call(this);
