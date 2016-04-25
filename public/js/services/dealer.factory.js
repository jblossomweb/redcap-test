app.factory('dealerFactory', [
'$http', 
'$filter',
function($http, $filter) {
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

    obj.get = function get(id, callback) {
      return $http.get(apiBase+'dealers/'+id).success(function(data){
        callback(null, data)
      }).error(function(error){
        callback(error)
      })
    }

    obj.update = function update(dealer, callback) {
      return $http.put(apiBase+'dealers/'+dealer.id, dealer).success(function(data){
        $filter('filter')(obj.dealers, {id: data.id })[0] = data
        callback(null, data)
      }).error(function(error){
        callback(error)
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