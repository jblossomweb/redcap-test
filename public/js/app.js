var app = angular.module('redcapTest', ['ui.router', 'ui.bootstrap'])

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'templates/home',
      controller: 'HomeCtrl'
    })

    $urlRouterProvider.otherwise('home')
}])

app.controller('HomeCtrl', [
'$scope',
function($scope) {
    $scope.foo = 'this is the content of foo'
}])