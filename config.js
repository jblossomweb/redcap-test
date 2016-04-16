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
		port: process.env.EXPRESS_PORT || 3000
	},
	db: {
		type: 'mysql'
	},
    mysql: {
        connection: process.env.MYSQL_CONNECTION
    }
}