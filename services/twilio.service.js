var config = require("../config")
var twilio = require('twilio')(config.twilio.accountSid, config.twilio.authToken)
var Service = {}

Service.getLocalNumbers = function(params, callback) {
  if(Object.keys(params).length) {
    var twilioParams = mapTwilioParams(params)
    twilio.availablePhoneNumbers('US').local.get(twilioParams, function(err, data) {
      if (err) {
        return callback(err)
      } else {
        if(data.available_phone_numbers) {
          if(data.available_phone_numbers.length === 0 && twilioParams.distance < 500) {
            // recursively increase distance
            params.distance = params.distance * 2
            if(params.distance > 500) { params.distance = 500 }
            Service.getLocalNumbers(params, callback)
          } else {
            return callback(null, data.available_phone_numbers)
          }
          
        } else {
          return callback(new Error('service response was invalid'))
        }
        
      }
    })
  } else {
    return callback(new Error("not enough params were provided to service"))
  }
}

module.exports = Service

// if this gets unruly, refactor with underscore/lodash
function mapTwilioParams(params) {
  var twilioParams = {}
  if(params.lat && params.lng) {
    twilioParams.nearLatLong = params.lat + "," + params.lng
  }
  twilioParams.distance = params.distance || 500 // max instead of default 25
  return twilioParams
}