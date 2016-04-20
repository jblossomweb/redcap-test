// Dealer model

var db = require('orm').db;

var Dealer = db.define('dealers', {
  name: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  lat: Number,
  lng: Number,
  sales: String,
  service: String,
  website: String,
  twilio: String,
}, {
  methods: {
  }
});

module.exports = Dealer