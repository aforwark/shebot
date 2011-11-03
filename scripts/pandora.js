
module.exports = function(robot) {
    var fs = require('fs');
    
    robot.hear(/^pandora play\s*(.+?)/, function (msg) {
        fs.writeFile(process.env.HUBOT_PANDORA_CTL, 'p', function () {
            msg.send('Now playing... or maybe paused...');
        })
    });
};