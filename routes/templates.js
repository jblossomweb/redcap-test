var express = require('express')
var router = express.Router()

router.get('/:template', function(req, res, next) {
  var view = req.params.template
  res.render(view)
})

module.exports = router