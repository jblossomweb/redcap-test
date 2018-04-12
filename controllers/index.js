var config = require("../config")

module.exports = function(req, res, next) {
  var vars = {}
  vars.title = config.site.title
  vars.app = config.angular.app
  vars.mapScript =
    config.google.mapsScript ||
    `https://maps.googleapis.com/maps/api/js?key=${
      config.google.mapsKey
    }&libraries=places,geometry`
  res.render('index', vars)
}