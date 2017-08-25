var config = require("../config")

module.exports = function(req, res, next) {
  var vars = {}
  vars.title = config.site.title
  vars.app = config.angular.app
  vars.mapsKey = config.google.mapsKey
  res.render('index', vars)
}