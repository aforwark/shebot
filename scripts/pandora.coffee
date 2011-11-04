# Controls a pianobar instance
#
# pandora play - Plays Pandora
# pandora pause - same
# pandora love - Love the current song
# pandora hate - Ban the current song
# pandora ban - "
# pandora i hate this song - "
# pandora noo+ - " (must have at least 2 o's)
# pandora next - go to the next song
# pandora skip - "
# pandora info - Display information about the current song
#

fs = require 'fs'
exec = require('child_process').exec
sprintf = require("sprintf").sprintf

module.exports = (robot) ->
    
    getCommand = (command, ctl) ->
        "echo #{command} > #{ctl}"

    cmd = (command, cb) ->
        c = getCommand command, process.env.HUBOT_PANDORA_CTL
        exec c, cb;
    
    
    robot.hear /^pandora (play|pause)/, (msg) ->
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

    
    robot.hear /^pandora (i hate this song|hate|ban|noo+)/, (msg) ->
        cmd '-', (err, stdout, stderr) ->
            if err
                msg.send 'Error communicating with pianobar!'
            else
                msg.send 'This song has been banned!'
    
    
    robot.hear /^(i'?m tired of this song|pandora (tired|this is old|bored|bleh|meh))/, (msg) ->
        cmd 't', (err, stdout, stderr) ->
            if err
                msg.send 'Error communicating with pianobar!'
            else
                msg.send 'This song has been removed for 30 days'
    
    
    robot.hear /^pandora (i love this song|love|nice|great song)/, (msg) ->
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
    
    