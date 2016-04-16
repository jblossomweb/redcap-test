var express = require('express')
var router = express.Router()
var api = require("../controllers/api")

/* GET api status. */
router.get('/', api.status)
router.get('/status', api.status)

module.exports = router