var config = require("../config")
var db = require('orm').db
var api = {}

// models
var Dealer = require("../models/dealer")

api.status = function(req, res, next) {
  res.status(200).json({status: res.statusCode, message: "api is up"})
}

module.exports = api