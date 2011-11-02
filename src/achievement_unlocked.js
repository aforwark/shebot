(function() {
  module.exports = function(robot) {
    robot.hear(/achievement (get|unlock(ed)?) (.+?)(\s*[^@\s]+@[^@\s]+)?\s*$/i, function(msg) {
      var caption, email, url;
      caption = msg.match[3];
      email = msg.match[4];
      url = "http://achievement-unlocked.heroku.com/xbox/" + (escape(caption)) + ".png";
      if (email) {
        url += "?email=" + (escape(email.trim())) + ".png";
      }
      return msg.send(url);
    });
    return robot.hear(/acheivement (get|unlock(ed)?)/i, function(msg) {
      var url;
      url = "http://achievement-unlocked.heroku.com/xbox/" + (escape("Bane of Daniel Webster")) + ".png";
      return msg.send(url);
    });
  };
}).call(this);
