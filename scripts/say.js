module.exports = function(robot) {
    var exec = require('child_process').exec,
        lock = false;

    robot.hear(/^say (.+?$/i, function (msg) {
        if (true === lock) {
            return msg.send("Settle down there tiger.");
        }
        
        lock = true;
        
        exec(
            "say " + msg.match[1],
            function (error, stdout, stderr) {
                lock = false;
            }
        );
    });
}