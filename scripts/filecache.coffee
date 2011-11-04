# Cache management for CMS sites
#
# purge [url] - PURGE the requested URL
#

HTTP = require "http"
URL  = require "url"

purge = (url) ->
  parsedUrl = URL.parse(url)
  options   =
    host: parsedUrl.host
    port: 80
    path: '/'
    method: 'PURGE'

  req = HTTP.request options, (res) ->
    body = ""
    res.setEncoding("utf8")
    res.on "data", (chunk) ->
      body += chunk
    res.on "end", () ->
      data =
        response:
          body: body
          status: res.statusCode

  req.on "error", (e) ->

  req.end()


module.exports = (robot) ->

    robot.hear /^purge (http?:\/\/.+?)/, (msg) ->
        url = msg.match[1]

        purge url

        msg.send "Purging #{url}"

