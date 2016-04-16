var express = require("express")
var orm = require("orm")
var fs = require('fs')
var path = require("path")
var logger = require('morgan')
var bodyParser = require('body-parser')

var config = require('./config')
var app = express()

// connect to database
orm.db = orm.connect(config[config.db.type].connection, function(error, db){
  if(!error) return
  throw(error)
})

// view engine setup
app.set('views', path.join(__dirname, 'templates'))
app.set('view engine', 'pug') // the artist formerly known as jade

// static server setup 
app.use(express.static(path.join(__dirname, 'public')))
app.use('/libs', express.static('bower_components'))

// parser setup
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// logger setup
if (config.node.env === 'development') {
  app.use(logger('dev'))
}

// autoload routes
var routes = {}
var routesPath = path.join(__dirname, 'routes')
fs.readdirSync(routesPath).forEach(function (file) {
  if (file.indexOf('.js') >= 0) {
    var route = file.substr(0, file.lastIndexOf('.'))
    routes[route] = require(routesPath + '/' + file)
    if(route == 'index') {
      app.use('/', routes[route])
    } else {
      app.use('/'+route, routes[route])
    }
  }
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (config.node.env === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.json(err)
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.json({
    message: err.message,
    name: err.name,
    errors: err.errors || null
  })
})

app.listen(config.express.port, function () {
  console.log('listening on port '+config.express.port)
})

module.exports = app