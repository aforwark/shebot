module.exports = function(robot) {
  return robot.respond(/(?:(satellite|terrain|hybrid)[- ])?map me (.+)/i, function(msg) {
    var location, mapType, mapUrl, url;
    mapType = msg.match[1] || "roadmap";
    location = msg.match[2];
    mapUrl = "http://maps.google.com/maps/api/staticmap?markers=" + escape(location) + "&size=400x400&maptype=" + mapType + "&sensor=false" + "&format=png";
    url = "http://maps.google.com/maps?q=" + escape(location) + "&hl=en&sll=37.0625,-95.677068&sspn=73.579623,100.371094&vpsrc=0&hnear=" + escape(location) + "&t=m&z=11";
    msg.send(mapUrl);
    return msg.send(url);
  });
};