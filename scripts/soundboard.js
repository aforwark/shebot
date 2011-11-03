module.exports = function(robot) {
    var exec = require('child_process').exec,
        lock = false;

    /**
     * @todo use fs.readdirSync to show optional sounds.
     */
     robot.respond(/soundboard help/i, function(msg) {
         return msg.send("Options: soundboard [be_back, mother_talk, no_problemo, terminator, get_down]");
     });
    
    robot.hear(/^soundboard (.+?)$/i, function (msg) {
        if (true === lock) {
            return msg.send("I can only play one soundboard at a time!");
        }
        
        lock = true;
        
        exec(
            "afplay " + '~/Music/soundboard/' + msg.match[1] + '.wav',
            function (error, stdout, stderr) {
                lock = false;
            }
        );
    });
}