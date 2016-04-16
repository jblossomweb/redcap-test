var express = require('express')
var router = express.Router()
var engine = 'pug' // allows double dot filenames

router.get('/:template', function(req, res, next) {
  var view = req.params.template
  res.render(view+'.'+engine)
})

router.get('/partials/:template', function(req, res, next) {
  var view = req.params.template
  res.render('partials/'+view+'.'+engine)
})

router.get('/modals/:template', function(req, res, next) {
  var view = req.params.template
  res.render('modals/'+view+'.'+engine)
})

module.exports = router