var fs = require('fs')
var env = require('node-env-file')

if (fs.existsSync('.env')) {
  env('.env')
}

module.exports = {
	site: {
		title: process.env.SITE_TITLE || "Redcap Test",
	},
	angular: {
		app: process.env.ANGULAR_APP || "redcapTest"
	},
	node: {
		env: process.env.NODE_ENV || 'development'
	},
	express: {
		port: process.env.EXPRESS_PORT || process.env.PORT || 3000
	},
	db: {
		type: 'mysql'
	},
  mysql: {
    connection: process.env.MYSQL_CONNECTION || process.env.CLEARDB_DATABASE_URL
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN
  },
  google: {
    mapsKey: process.env.GOOGLE_MAPS_KEY,
    mapsScript: process.env.GOOGLE_MAPS_SCRIPT || null
  }
}