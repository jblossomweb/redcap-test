app.directive('dealerForm', function() {
  return {
    templateUrl: 'templates/directives/dealers.form',
    link: function(scope, element, attrs) {
      scope.formType = attrs.formType
      scope.dealerId = attrs.dealerId
    },
    scope: {
      formType: "@",
      dealerId: "@"
    },
    controller: [
    '$scope',
    '$rootScope',
    '$filter',
    '$timeout',
    'dealerFactory',
    'twilioService',
    function($scope, $rootScope, $filter, $timeout, dealerFactory, twilioService) {

      $scope.errors = []
      $scope.regex = {
        state: /^[A-Z]+$/,
        integer: /^\d+$/,
        decimal: /^[+-]?(\d*\.)?\d+$/,
        url: /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\?=&\/\w \.-]*)*\/?$/
      }

      $rootScope.createDealer = function createDealer() {
        $scope.removeSuccess()
        dealerFactory.create($scope.dealer, function(error, dealer){
          if(error) {
            // should only happen if user hacks the form
            if(!error.message) {
              error.message = "Dealership was not added. Check form for invalid fields."
            }
            $scope.errors.push(error)
          } else {
            $scope.clearSearch()
            $scope.errors = []
            $scope.success = "Successfully added "+dealer.name
          }
        })
      }
      $rootScope.updateDealer = function updateDealer(id) {
        $scope.removeSuccess()
        dealerFactory.update($scope.dealer, function(error, dealer){
          if(error) {
            // should only happen if user hacks the form
            if(!error.message) {
              error.message = "Dealership was not updated. Check form for invalid fields."
            }
            $scope.errors.push(error)
          } else {
            $scope.errors = []
            $scope.success = "Successfully updated "+dealer.name
          }
        })
      }

      $scope.populate = function(dealer, twilioService, callback) {
        // clear visible alerts
        $scope.errors = []
        $scope.success = null

        // repopulate fields
        $scope.dealer = dealer

        // do some twilio
        twilioService.numbers({
          lat: dealer.lat,
          lng: dealer.lng
        }, function(error, numbers) {
          if(error) {
            console.error(error)
            callback()
          } else {
            $scope.twilios = numbers

            if($scope.dealer.twilio) {
              var found = $scope.twilios.find(function(item) {
                return item.number == $scope.dealer.twilio
              })
              if(!found || !found.number) {
                $scope.twilios.push({ number: $scope.dealer.twilio })
              }
            }
            callback()
          }
        })
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

      $scope.removeSuccess = function removeSuccess() {
        $scope.success = false
      }

      $scope.refreshMap = function refreshMap(position, title) {
        if(!position) {
          var position = {
            lat: $scope.dealer.lat,
            lng: $scope.dealer.lng
          }
        }
        if(!title) {
          var title = $scope.dealer.name
        }
        // reset map marker
        if($scope.marker) {
          $scope.marker.setMap(null)
          $scope.marker = null
        }
        $scope.marker = new google.maps.Marker({
          position: position,
          title: title
        })
        
        if($scope.map) {

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
        }
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
      $scope.$watch("dealer.twilio", function(){ $scope.validate('twilio') })

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
          }, twilioService, function(){
            // empty callback.
          })

          // refresh map
          $scope.refreshMap(position, search.name)

        } else {
          // handle init value (before search)
          $rootScope.dealerFormValid = false
        }
      })

      if($scope.formType == 'update') {
        dealerFactory.get($scope.dealerId, function(error, dealer) {
          if(error) {
            console.error(error)
          } else {
            $scope.skipSearch = true
            $scope.populate(dealer, twilioService, function() {
              Object.keys(dealer).forEach(function(key){
                $scope.validate(key)
              })

              // seems to work better than $scope.watch on 'map'. 
              // TODO: this properly. delay is a workaround.
              $timeout(function(){
                $scope.refreshMap({lat: dealer.lat, lng: dealer.lng}, dealer.name)
              },250)
              
            })
          }
        })
      }
    }]
  }
})