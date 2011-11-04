(function() {
    var exec = require('child_process').exec;
    module.exports = function(robot) {
        return robot.respond(/fortune/i, function(msg) {
            exec('fortune 2>&- || echo "[WARNING] fortune not installed! for shame :("',
               function (error, stdout, stderr) {
                   msg.send(stdout);
               }
            );
        });
    };
 }).call(this);
