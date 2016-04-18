app.controller('DealersCtrl', [
'$scope',
'$rootScope',
'dealerFactory',
function($scope, $rootScope, dealerFactory) {
    $scope.dealers = dealerFactory.dealers
    $scope.openModal = $rootScope.openModal
    
    $scope.modalData = {
      form: {
        validated: false,
        fields: {}
      }
    }
}])