var express = require('express')
var router = express.Router()
var api = require("../controllers/api")

/* GET api status. */
router.get('/', api.status)
router.get('/status', api.status)

/* dealers */
router.get('/dealers', api.dealers.list)
router.post('/dealers', api.dealers.post)
router.get('/dealers/:dealer', api.dealers.get)
router.put('/dealers/:dealer', api.dealers.put)
router.delete('/dealers/:dealer', api.dealers.delete)

/* twilio (passthrough) */
router.get('/twilio/numbers/:lat/:lng', api.twilio.numbers)

module.exports = router