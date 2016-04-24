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
        var number = {
          number: result.friendly_name // convenient: already formatted string
        }
        var city = result.rate_center || null
        if(city){
          number.city = ucfirst(city.toLowerCase())
        }
        numbers.push(number)
      })
      res.status(200).json(numbers)
    })
  }
}

module.exports = api

function ucfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}