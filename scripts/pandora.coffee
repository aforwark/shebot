fs = require 'fs'
exec = require('child_process').exec
sprintf = require("sprintf").sprintf

module.exports = (robot) ->
    
    getCommand = (command, ctl) ->
        "echo #{command} > #{ctl}"

    cmd = (command, cb) ->
        c = getCommand command, process.env.HUBOT_PANDORA_CTL
        exec c, cb;
    
    
    robot.hear /^pandora play/, (msg) ->
        cmd 'p', (err, stdout, stderr) ->
            if err
                msg.send 'Error communicating with pianobar!'
            else
                msg.send 'Now playing... or maybe paused...'

    
    robot.hear /^pandora (next|skip)/, (msg) ->
        cmd 'n', (err, stdout, stderr) ->
            if err
                msg.send 'Error communicating with pianobar!'
            else
                msg.send 'Moving on...'

    
    robot.hear /^pandora i hate this song/, (msg) ->
        cmd '-', (err, stdout, stderr) ->
            if err
                msg.send 'Error communicating with pianobar!'
            else
                msg.send 'This song has been banned!'
    
    
    robot.hear /^i'?m tired of this song/, (msg) ->
        cmd 't', (err, stdout, stderr) ->
            if err
                msg.send 'Error communicating with pianobar!'
            else
                msg.send 'This song has been removed for 30 days'
    
    
    robot.hear /^pandora i love this song/, (msg) ->
        cmd '+', (err, stdout, stderr) ->
            if err
                msg.send 'Error communicating with pianobar!'
            else
                msg.send 'This song just got some lovin\'!'
    
    
    robot.hear /^pandora info/, (msg) ->
        fs.readFile '/tmp/nowplaying', (err, data) ->
            if err
                msg.send 'Unable to determine what song is currently being played...'
            else
                try
                    song = JSON.parse(data.toString());
                
                    msg.send sprintf('Playing "%s" by "%s"', song.title, song.artist)
                catch e
                    return msg.send 'There was a problem parsing the song data... fail!'
    
    