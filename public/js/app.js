var app = angular.module('redcapTest', ['ui.router', 'ui.bootstrap', 'smart-table'])

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'templates/home',
      controller: 'HomeCtrl',
      resolve: {
        dealerPromise: ['dealerFactory', function(dealerFactory){
            return dealerFactory.list()
        }]
      }
    })

    $urlRouterProvider.otherwise('home')
}])

app.controller('HomeCtrl', [
'$scope',
'dealerFactory',
function($scope, dealerFactory) {
    $scope.dealers = dealerFactory.dealers
}])

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
    return obj
}])