(function() {
    var sprintf;
    
    sprintf = require("sprintf").sprintf;
    
    module.exports = function(robot) {
        var baseUrl = 'http://caedmon.net/beerscore/';

        return robot.respond(/beer ?score\s+(.+?)/i, function(msg) {
            var beer;
            beer = escape(msg.match[1]);
            return msg.http(baseUrl+beer).get()(function(err, res, body) {
                var object, found = 0;
                if (res.statusCode === 404) {
                    return msg.send('Beer not found.');
                } else {
                    object = JSON.parse(body);
                    
                    switch (object.type) {
                        case 'REFINE':
                            msg.send(sprintf('There were %d beers found. %s', object.num, object.searchurl));
                            break;
                        
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
                            msg.send(sprintf('%d %sresults...', num, num > 0 ? 'more ' : ''));
                            
                            break;
                            
                        case 'SCORE':
                            for (var i = 0, len = object.beer.length; i < len; i++) {
                                var beer = object.beer[i];
                                
                                msg.send(sprintf('rating for "%s" = %s (%s)', beer.name, beer.score, beer.url));
                            }
                            break;
                    }
                    msg.send(object.alt);
                    msg.send(object.title);
                    return msg.send(object.img);
                }
            });
        });
    };
}).call(this);
