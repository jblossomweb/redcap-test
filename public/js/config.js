angular.module('redcapTest').config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'templates/home',
      controller: 'HomeCtrl'
    })
    .state('dealers', {
      url: '/dealers',
      templateUrl: 'templates/dealers',
      controller: 'DealersCtrl',
      resolve: {
        dealerPromise: ['dealerFactory', function(dealerFactory){
            return dealerFactory.list()
        }]
      }
    })

    $urlRouterProvider.otherwise('home')
}])