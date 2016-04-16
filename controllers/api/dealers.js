var config = require("../../config")
var db = require('orm').db

// models
var Dealer = require("../../models/dealer")

// dealers
dealers = {}

dealers.list = function(req, res, next) {
    // SELECT * FROM dealers
    Dealer.find(function(err, dealers){
        if(err){ return next(err) }
        res.status(200).json(dealers)
    })
}
dealers.get = function(req, res, next) {
    // SELECT * FROM dealers WHERE id = :dealer
    var id = req.params.dealer
    Dealer.get(id, function(err, dealer){
        if(err){ return next(err) }
        res.status(200).json(dealer)
    })
}
dealers.post = function(req, res, next) {
    // INSERT INTO dealers
    var dealers = req.body
    Dealer.create(dealers, function(err, dealers){
        if(err){ return next(err) }
        res.status(200).json(dealers)
    })
}
dealers.put = function(req, res, next) {
    // UPDATE dealers SET (...) WHERE id = :dealer
    var id = req.params.dealer
    var update = req.body
    Dealer.get(id, function(err, dealer){
        if(err){ return next(err) }
        Object.keys(update).forEach(function(key){
            dealer[key] = update[key]
        })
        dealer.save(function(err) {
            if(err){ return next(err) }
            res.status(200).json(dealer)
        })
    })
}
dealers.delete = function(req, res, next) {
    // DELETE FROM dealers WHERE id = :dealer
    var id = req.params.dealer
    Dealer.get(id).remove(function(err){
        if(err){ return next(err) }
        res.status(200).json({status: res.statusCode, message: "deleted"})
    })
}

module.exports = dealers