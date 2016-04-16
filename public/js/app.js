var app = angular.module('redcapTest', ['ui.router', 'ui.bootstrap', 'smart-table'])

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

app.directive('rootScope', function() {
  // setup some $rootScope
  return {
    controller: [
    '$rootScope', 
    '$uibModal', 
    '$uibModalStack', 
    function($rootScope, $uibModal, $uibModalStack) {
      $rootScope.openModal = function(template, data, size) {
        console.log('openModal('+template+')')
        if(!size) {
          var size = 'lg'
        }
        var modalInstance = $uibModal.open({
          templateUrl: 'templates/modals/' + template,
          size: size,
          controller: 'ModalCtrl',
          resolve: {
            data: data || null
          }
        })
      }

      $rootScope.closeModals = function() {
        $uibModalStack.dismissAll()
      }
    }]
  }
})

// generic, stateless modal controller, accepts a data param if needed
app.controller('ModalCtrl', [
'$scope',
'$uibModalInstance',
'data',
function($scope, $uibModalInstance, data) {
  $scope.data = data
  $scope.submit = function(newData) {
    $uibModalInstance.close(newData)
  }
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel')
  }
}])

app.controller('HomeCtrl', [
'$scope',
function($scope) {
    $scope.title = "Demo Home"
    $scope.desc = "This is a sample project, for a skills test."
}])

app.controller('DealersCtrl', [
'$scope',
'$rootScope',
'dealerFactory',
function($scope, $rootScope, dealerFactory) {
    $scope.dealers = dealerFactory.dealers
    $scope.openModal = $rootScope.openModal
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