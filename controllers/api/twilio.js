var Twilio = require("../../services/twilio.service")
var api = {}

api.numbers = function(req, res, next) {
  var lat = req.params.lat
  var lng = req.params.lng
  if(lat && lng) {
    Twilio.getLocalNumbers({
      lat: lat,
      lng: lng
    },function (err, results) {
      if(err){ return next(err) }
      var numbers = []
      results.forEach(function(result) {
        numbers.push({
          city: ucfirst(result.rate_center.toLowerCase()),
          number: result.friendly_name // convenient: already formatted string
        })
      })
      res.status(200).json(numbers)
    })
  }
}

module.exports = api

function ucfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}