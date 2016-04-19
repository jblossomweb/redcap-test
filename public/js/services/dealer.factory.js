app.factory('dealerFactory', [
'$http', 
function($http) {
    var obj = {
        dealers: []
    }
    var apiBase = '/api/' // decouple here if needed

    obj.list = function list() {
      return $http.get(apiBase+'dealers').success(function(data){
        angular.copy(data, obj.dealers)
      }).error(function(error){
        console.error(error)
      })
    }

    obj.get = function get(id) {
      return $http.get(apiBase+'dealers/'+id).success(function(data){
        return data
      }).error(function(error){
        console.error(error)
      })
    }

    obj.create = function create(dealer, callback) {
      return $http.post(apiBase+'dealers', dealer).success(function(data){
        obj.dealers.push(data)
        callback(null, data)
      }).error(function(error){
        console.error(error)
        callback(error)
      })
    }

    return obj
}])