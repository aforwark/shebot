# Controls a pianobar instance
#
# pandora play|pause - Plays (or pauses) Pandora
# pandora (love|great song|i love this song|nice) - Love the current song
# pandora (hate|ban|noo+) - Ban the current song
# pandora (next|skip) - go to the next song
# pandora info - Display information about the current song
#

fs = require 'fs'
exec = require('child_process').exec
sprintf = require("sprintf").sprintf

module.exports = (robot) ->
    last_song = null;

    getCommand = (command, ctl) ->
        "echo #{command} > #{ctl}"

    cmd = (command, cb) ->
        c = getCommand command, process.env.HUBOT_PANDORA_CTL
        exec c, cb;

    fs.watchFile "/tmp/nowplaying", (curr, prev) ->
        if curr.mtime is prev.mtime
            return

        getSongInfo (err, data) ->
            if last_song is null or (last_song.title != data.title and last_song.artist != data.artist)
                robot.send { room:'#sheknowsdev' }, sprintf('♫ "%s" by "%s" ♫', data.title, data.artist)
                
            last_song = data

    getSongInfo = (cb) ->
        fs.readFile '/tmp/nowplaying', (err, data) ->
            if err
                cb 'Unable to determine what song is currently being played...', null
            else
                try
                    song = JSON.parse(data.toString());

                    cb null, song
                catch e
                    cb 'There was a problem parsing the song data... fail!', null


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
        getSongInfo (err, data) ->
            if err
                msg.send err
            else
                msg.send sprintf('♫ "%s" by "%s" ♫'', data.title, data.artist)

