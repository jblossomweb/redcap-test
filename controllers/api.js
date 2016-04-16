var config = require("../config")
var api = {}

api.status = function(req, res, next) {
  res.status(200).json({status: res.statusCode, message: "api is up"})
}

// dealers
api.dealers = require("./api/dealers")

module.exports = api