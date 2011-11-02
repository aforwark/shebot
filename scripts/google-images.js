var imageMe, mustachify;
module.exports = function(robot) {
  robot.respond(/(image|img)( me)? (.*)/i, function(msg) {
    return imageMe(msg, msg.match[3], function(url) {
      return msg.send(url);
    });
  });
  robot.respond(/animate me (.*)/i, function(msg) {
    return imageMe(msg, "animated " + msg.match[1], function(url) {
      return msg.send(url);
    });
  });
  return robot.respond(/(?:mo?u)?sta(?:s|c)he?(?: me)? (.*)/i, function(msg) {
    var imagery;
    imagery = msg.match[1];
    if (imagery.match(/^https?:\/\//i)) {
      return msg.send("" + mustachify + imagery);
    } else {
      return imageMe(msg, imagery, function(url) {
        return msg.send("" + mustachify + url);
      });
    }
  });
};
mustachify = "http://mustachify.me/?src=";
imageMe = function(msg, query, cb) {
  return msg.http('http://ajax.googleapis.com/ajax/services/search/images').query({
    v: "1.0",
    rsz: '8',
    q: query
  }).get()(function(err, res, body) {
    var image, images;
    images = JSON.parse(body);
    images = images.responseData.results;
    image = msg.random(images);
    return cb("" + image.unescapedUrl + "#.png");
  });
};