
module.exports = function(robot) {
    var fs = require('fs'),
        exec = require('child_process').exec,
        sprintf = require("sprintf").sprintf;
    
    function cmd(command, cb) {
        exec('echo '+command+' > ' + process.env.HUBOT_PANDORA_CTL, cb);
    }
    
    robot.hear(/^pandora play/, function (msg) {
        cmd('p', function (err, stdout, stderr) {
            if (err) {
                msg.send('Error communicating with pianobar!');
                return;
            }
            
            msg.send('Now playing... or maybe paused...');
        })
    });
    
    robot.hear(/^pandora (next|skip)/, function (msg) {
        cmd('n', function (err, stdout, stderr) {
            if (err) {
                msg.send('Error communicating with pianobar!');
                return;
            }
            
            msg.send('Moving on...');
        });
    });
    
    robot.hear(/^pandora i hate this song/, function (msg) {
        cmd('-', function (err, stdout, stderr) {
            if (err) {
                msg.send('Error communicating with pianobar!');
                return;
            }
            
            msg.send('This song has been banned!');
        })
    });
    
    robot.hear(/^i'?m tired of this song/, function (msg) {
        cmd('t', function (err, stdout, stderr) {
            if (err) {
                msg.send('Error communicating with pianobar!');
                return;
            }
            
            msg.send('This song has been removed for 30 days');
        })
    });

    robot.hear(/^pandora i love this song/, function (msg) {
        cmd('+', function (err, stdout, stderr) {
            if (err) {
                msg.send('Error communicating with pianobar!');
                return;
            }
            
            msg.send('This song just got some lovin\'!');
        })
    });
    
    robot.hear(/^pandora info/, function (msg) {
        fs.readFile('/tmp/nowplaying', function (err, data) {
            if (err) {
                msg.send('Unable to determine what song is currently being played...');
                return;
            }
            
            try {
                var song = JSON.parse(data.toString());
                
                msg.send(sprintf('Playing "%s" by "%s"', song.title, song.artist));
            } catch (e) {
                return msg.send('There was a problem parsing the song data... fail!');
            }
        })
    })
};