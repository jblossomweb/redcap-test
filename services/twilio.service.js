var config = require("../config")
var twilio = require('twilio')(config.twilio.accountSid, config.twilio.authToken)
var Service = {}

Service.getLocalNumbers = function(params, callback) {
  if(Object.keys(params).length) {
    twilio.availablePhoneNumbers('US').local.get(mapTwilioParams(params), function(err, data) {
      if (err) {
        return callback(err)
      } else {
        if(data.available_phone_numbers) {
          return callback(null, data.available_phone_numbers)
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
  return twilioParams
}