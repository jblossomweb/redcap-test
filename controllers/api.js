var config = require("../config")
var api = {}

api.status = function(req, res, next) {
  res.status(200).json({status: res.statusCode, message: "api is up"})
}

api.dealers = require("./api/dealers")
api.twilio = require("./api/twilio")

module.exports = api