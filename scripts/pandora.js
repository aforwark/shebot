
module.exports = function(robot) {
    var fs = require('fs'),
        exec = require('child_process').exec;
    
    function cmd(command, cb) {
        exec('echo '+command+' > ' + process.env.HUBOT_PANDORA_CTL, cb);
    }
    
    robot.hear(/pandora play/, function (msg) {
        cmd('p', function (err, stdout, stderr) {
            if (err) {
                msg.send('Error communicating with pianobar!');
                return;
            }
            
            msg.send('Now playing... or maybe paused...');
        })
    });
    
    robot.hear(/^pandora next/, function (msg) {
        cmd('n', function (err, stdout, stderr) {
            if (err) {
                msg.send('Error communicating with pianobar!');
                return;
            }
            
            msg.send('Moving on...');
        });
    });
};