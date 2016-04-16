var config = require("../config")

module.exports = function(req, res, next) {
  var vars = {}
  vars.title = config.site.title
  vars.app = config.angular.app
  res.render('index', vars)
}