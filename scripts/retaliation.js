module.exports = function(robot) {
    var exec = require('child_process').exec,
        lock = false;

    robot.hear(/shoot ([a-z]+)/i, function (msg) {
        if (true === lock) {
            return msg.send("Settle down there tiger.");
        }
        
        lock = true;
        
        exec(
            "python /Users/sheknowsdev/Retaliation/retaliation.py " + msg.match[1],
            function (error, stdout, stderr) {
                lock = false;
            }
        );
        
        return msg.send("Aye aye, Captain!");
    });
}