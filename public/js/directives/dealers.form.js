app.directive('dealerForm', function() {
  return {
    templateUrl: 'templates/directives/dealers.form',
    link: function(scope, element, attrs) {
      scope.formType = attrs.formType
      scope.formScope = attrs.formScope 
    },
    scope: {
      formType: "@",
      formScope: "@"
    },
    controller: [
    '$scope',
    '$rootScope',
    function($scope, $rootScope) {

      $scope.errors = []
      $scope.regex = {
        state: /^[A-Z]+$/,
        integer: /^\d+$/,
        decimal: /^[+-]?(\d*\.)?\d+$/,
        url: /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\?=&\/\w \.-]*)*\/?$/
      }

      $rootScope.createDealer = function createDealer() {
        console.log("createDealer()")
      }
      $rootScope.updateDealer = function updateDealer(id) {
        console.log("updateDealer("+id+")")
      }

      $scope.populate = function(dealer) {
        // clear visible errors
        $scope.errors = []

        // repopulate fields
        $scope.dealer = dealer
      }

      $scope.validate = function validate(field) {

        if(!$scope.classes) {
          $scope.classes = {}
        }

        if(!$scope.dealerForm || !$scope.dealer || !$scope.dealer[field] || !$scope.dealerForm[field]) {
          $scope.classes[field] = 'has-error'
          $rootScope.dealerFormValid = false
        } else {
          if($scope.dealerForm[field].$invalid) {
            $scope.classes[field] = 'has-error'
            $rootScope.dealerFormValid = false
          }
          if($scope.dealerForm[field].$valid) {
            $scope.classes[field] = 'has-success'
            $rootScope.dealerFormValid = $scope.dealerForm.$valid
          }
        }

        if($scope.dealerForm) {

          var validAddress = (
            $scope.dealerForm.address && $scope.dealerForm.address.$valid 
            && 
            $scope.dealerForm.city && $scope.dealerForm.city.$valid 
            && 
            $scope.dealerForm.state && $scope.dealerForm.state.$valid 
            && 
            $scope.dealerForm.zip && $scope.dealerForm.zip.$valid
          )

          var validCoordinates = (
            $scope.dealerForm.lat && $scope.dealerForm.lat.$valid 
            && 
            $scope.dealerForm.lng && $scope.dealerForm.lng.$valid
          )

          $scope.classes.addressGroup = validAddress ? 'has-success' : 'has-error'
          $scope.classes.coordinates = validCoordinates ? 'has-success' : 'has-error'

        }
      }

      $scope.clearSearch = function () {
        $scope.search = null
        $rootScope.dealerFormValid = false
      }

      $scope.removeError = function removeError(i) {
        $scope.errors.splice(i, 1)
      }

      $scope.clearSearch()

      $scope.$watch("dealer.name", function(){ $scope.validate('name') })
      $scope.$watch("dealer.address", function(){ $scope.validate('address') })
      $scope.$watch("dealer.city", function(){ $scope.validate('city') })
      $scope.$watch("dealer.state", function(){ $scope.validate('state') })
      $scope.$watch("dealer.zip", function(){ $scope.validate('zip') })
      $scope.$watch("dealer.website", function(){ $scope.validate('website') })
      $scope.$watch("dealer.lat", function(){ $scope.validate('lat') })
      $scope.$watch("dealer.lng", function(){ $scope.validate('lng') })
      $scope.$watch("dealer.sales", function(){ $scope.validate('sales') })
      $scope.$watch("dealer.service", function(){ $scope.validate('service') })

      $scope.$watch("search", function(search) {
        if(search) {

          if(!search.name) {
            // error
            $scope.clearSearch()
            $scope.errors.push(new Error('Invalid Location: no name'))
            return
          }

          if(!search.address_components) {
            // error
            $scope.search = null 
            $rootScope.dealerFormValid = false
            $scope.errors.push(new Error('Invalid Location: must be a full address'))
            return
          }

          var streetNumber = search.address_components.find(function(component) {
            return component.types.includes('street_number')
          })

          var route = search.address_components.find(function(component) {
            return component.types.includes('route')
          })

          var city = search.address_components.find(function(component) {
            return component.types.includes('locality')
          })

          var state = search.address_components.find(function(component) {
            return component.types.includes('administrative_area_level_1')
          })

          var zip = search.address_components.find(function(component) {
            return component.types.includes('postal_code')
          })

          var position = {
            lat: search.geometry.location.lat(),
            lng: search.geometry.location.lng()
          }

          var address = ''
          if(streetNumber && route) {
            address = streetNumber.long_name + ' ' + route.long_name
          } else if(route) {
            address = route.long_name
          } else {
            // error
            $scope.clearSearch()
            $scope.errors.push(new Error('Invalid Location: must contain street number and route'))
            return
          }

          if(!city || !state || !zip) {
            // error
            $scope.clearSearch()
            $scope.errors.push(new Error('Invalid Location: must contain city, state, and postal code'))
            return
          }

          $scope.populate({
            name: search.name,
            address: address,
            city: city.long_name,
            state: state.short_name,
            zip: zip.short_name,
            lat: position.lat,
            lng: position.lng,
            sales: search.formatted_phone_number,
            service: search.formatted_phone_number,
            website: search.website
          })

          // reset map marker
          if($scope.marker) {
            $scope.marker.setMap(null)
            $scope.marker = null
          }
          $scope.marker = new google.maps.Marker({
            position: position,
            title: search.name
          })
          $scope.marker.setMap($scope.map)

          // re-center map
          $scope.map.setCenter(position)
          $scope.map.setZoom(14)

          // these are hacks. they also depend on some polluted global scope
          // TODO: inject google.maps as a service
          google.maps.event.addListenerOnce($scope.map, 'idle', function() {
            google.maps.event.trigger($scope.map, 'resize')
          })

          google.maps.event.addListenerOnce($scope.map, 'resize', function() {
            $scope.map.setCenter(position)
          })

        } else {
          // handle init value (before search)
          $rootScope.dealerFormValid = false
        }
      })
    }]
  }
})