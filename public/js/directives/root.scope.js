app.directive('rootScope', function() {
  return {
    controller: [
    '$rootScope', 
    '$uibModal', 
    '$uibModalStack', 
    function($rootScope, $uibModal, $uibModalStack) {
      $rootScope.openModal = function(template, data, size) {
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