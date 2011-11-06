sprintf = require("sprintf").sprintf

module.exports = (robot) ->
    client = null
    getClient = () ->
        if client
            return client

        if process.env.HUBOT_CHARTBEAT_APIKEY is undefined
            msg.send "Missing HUBOT_CHARTBEAT_APIKEY env variable."
        else if process.env.HUBOT_CHARTBEAT_HOSTS is undefined
            msg.send "Missing HUBOT_CHARTBEAT_HOSTS env variable."
        else
            client = require('chartbeat-api').createClient({
                apiKey: process.env.HUBOT_CHARTBEAT_APIKEY,
                hosts: process.env.HUBOT_CHARTBEAT_HOSTS
            })

            return client

    return robot.hear /^how many people are on ([-a-z0-9\.]+)( right now)?\??/i, (msg) ->
        host = msg.match[1];

        getClient().request 'quickstats', { host:host }, (data) ->
            msg.send sprintf("There are %s people on %s right now", data.people, host)
