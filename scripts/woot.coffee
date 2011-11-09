# Checks the latest woot.com deal

HTTP = require "http"

chomp = (text) ->
    return text.replace /(\n|\r)+$/, ""

Woot = (callback = null) ->
    req = HTTP.request { host: "www.woot.com", path: "/DefaultMicrosummary.ashx" }, (res) ->
        body = ""
        res.setEncoding("utf8")
        res.on "data", (chunk) ->
            body += chunk
        res.on "end", () ->
            callback chomp body if callback?

    req.setTimeout 45000
    req.on "error", (e) ->
    req.end()

module.exports = (robot) ->
    
    lastWoot = null
    interval = null

    cleanWoot = (text) ->
        # Small coffeescript problem: the syntax checker does not recognize a
        # regex pattern beginning with a space (it parses it as division
        # instead,) so I have to use a workaround 
        regexps = [ /^\d+% : /, /(?: ): SOLD OUT$/ ]
        cleanedText = text
        cleanedText = cleanedText.replace regexp, "" for regexp in regexps
        return cleanedText

    timer = (msg) ->
        Woot (body) ->
            if lastWoot?
                bodyTest = cleanWoot body
                lastWootTest = cleanWoot lastWoot
                if bodyTest isnt lastWootTest
                    msg.send "[WOOT-OFF] #{ bodyTest }"
            lastWoot = body

    robot.respond /wootoff on/i, (msg) ->
        if interval?
            msg.send "Wootoff checking is already on!"
        else
            if not lastWoot?
                Woot (body) ->
                    lastWoot = body
            interval = setInterval timer, 60000, msg
            msg.send "Wootoff checking on."

    robot.respond /wootoff off/i, (msg) ->
        if interval?
            clearInterval interval
            interval = null
            msg.send "Wootoff checking turned off."
        else
            msg.send "Wootoff checking wasn't on anyways."

    robot.respond /woot(?!off)/i, (msg) ->
        Woot (body) ->
            msg.send body
            lastWoot = body
