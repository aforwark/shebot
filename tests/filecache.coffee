HTTP = require "http"
URL  = require "url"

request = (method, url, cb) ->
    parsedUrl = URL.parse(url)
    options     =
        host: parsedUrl.host
        port: 80
        path: '/'
        method: method

    req = HTTP.request options, (res) ->
        res.setEncoding("utf8")

        cb req, res

    req.on "error", (e) ->

    req.end()

url = 'http://www.fabulousfoods.com/'
request 'GET', url, (req, res) ->
    res.on "end", () ->
        if res.headers['x-cache-source'] is 'file'
            console.log "#{url} is cached!"
        else
            console.log "#{url} is NOT CACHED!"
