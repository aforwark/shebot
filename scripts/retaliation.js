module.exports = function(robot) {
    var exec = require('child_process').exec;

    robot.hear(/shoot ([a-z]+)/i, function (msg) {
        
        exec("python /Users/sheknowsdev/Retaliation/retaliation.py " + msg[1]);
        
    });
}