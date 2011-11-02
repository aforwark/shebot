(function() {
  module.exports = function(robot) {
    return robot.respond(/stock( me)?( -(\d+\w+))? (.*)/i, function(msg) {
      var ticker, time;
      ticker = msg.match[4];
      time = msg.match[3] || '1d';
      return msg.send("http://chart.finance.yahoo.com/z?s=" + ticker + "&t=" + time + "&q=l&l=on&z=l&a=v&p=s&lang=en-US&region=US#.png");
    });
  };
}).call(this);
