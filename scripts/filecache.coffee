# Cache management for CMS sites
#
# purge [url] - PURGE the requested URL
#

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

purge = (url) ->
    request 'PURGE', url, (req, res) ->
        body = ""
        res.on "data", (chunk) ->
            body += chunk
        res.on "end", () ->
            data =
                response:
                    body: body
                    status: res.statusCode

module.exports = (robot) ->

    robot.hear /^purge (http:\/\/.+?)/, (msg) ->
        url = msg.match[1]

        purge url

        msg.send "Purging #{url}"

    robot.hear /^is (http:\/\/.+?) cached?/, (msg) ->
        url = msg.match[1]

        request 'GET', url, (req, res) ->
            res.on "end", () ->
                if res.headers['x-cache-source'] is 'file'
                    msg.send "#{url} is cached!"
                else
                    msg.send "#{url} is NOT CACHED!"
