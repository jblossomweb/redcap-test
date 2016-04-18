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