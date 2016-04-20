app.service('twilioService', [
'$http', 
function($http) {
  var apiBase = '/api/' // decouple here if needed

  this.numbers = function(coords, callback) {
    return $http.get(apiBase+'twilio/numbers/'+coords.lat+'/'+coords.lng).success(function(data){
      return callback(null, data)
    }).error(function(error){
      callback(error)
    })
  }
}])