
module.exports = function(robot) {
    var fs = require('fs'),
        exec = require('child_process').exec;
    
    robot.hear(/pandora play/, function (msg) {
        exec('echo p > ' + process.env.HUBOT_PANDORA_CTL, function (err, stdout, stderr) {
            if (err) {
                msg.send('Error communicating with pianobar!');
                return;
            }
            
            msg.send('Now playing... or maybe paused...');
        })
    });
};