

(function() {
    'use strict';

    angular
        .module('app.userprofile')
        .controller('UserprofileFormController', UserprofileFormController);

    UserprofileFormController.$inject = ['$resource', '$state', '$http', 'djangoAuth', 'Users', 'Country', '$scope', 'CheckAuthenticated', 'toaster', '$location', 'SidebarLoader', '$rootScope', 'ngDialog'];
    function UserprofileFormController($resource, $state, $http, djangoAuth, Users, Country, $scope, CheckAuthenticated, toaster, $location, SidebarLoader, $rootScope, ngDialog) {
      CheckAuthenticated.check();
      $scope.app.offsidebarOpen = false;
     
        var vm = this;

          $scope.OpenOtpDialog = function () {
            $scope.otp = {};
            ngDialog.openConfirm({
              template: 'otpform',
              scope: $scope,
              className: 'ngdialog-theme-default',
              closeByDocument: false
            });
          }; 

          vm.CloseDialog = function() {
            ngDialog.close();
          };
          
          Country.query().$promise.then(function(success){
                $scope.countries = success;
          });

          djangoAuth.profile().then(function(data){
              $scope.user = data; 
              $scope.userId = data.id;

              $scope.companyPhone = data.userprofile.phone_number;
              $scope.companyCountry = data.userprofile.country    
              
          });
      
          vm.UpdateUserProfile = function() {
            if(vm.userForm.$valid) {
                $(".modelform").addClass(progressLoader()); 
      //          $scope.user.id = $scope.userId; not needed in patch of userprofile.
                if( $scope.user.userprofile.phone_number == $scope.companyPhone && $scope.user.userprofile.country == $scope.companyCountry )
                {
                  Users.patch({"id":$scope.userId, "username":$scope.user.username, "first_name":$scope.user.first_name, "last_name":$scope.user.last_name, "email":$scope.user.email, "groups": $scope.user.groups, "userprofile": {} },
                      function(success){                      
                            $(".modelform").removeClass(progressLoader());
                            
                            vm.successtoaster = {
                                type:  'success',
                                title: 'Success',
                                text:  'Userprofile updated successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                      }/*,
                      function(error){
                            $(".modelform").removeClass(progressLoader());
                            angular.forEach(error.data, function(value, key) {
                            vm.errortoaster = {
                                type:  'error',
                                title: toTitleCase(key),//'Failed',//
                                text:  value.toString()
                               };
                              toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                          })
                      }*/); 
                } 
                else
                {
                    Users.patch({"id":$scope.userId, "userprofile": {"country":$scope.user.userprofile.country, "phone_number":$scope.user.userprofile.phone_number}},//"sub_resource":"phone_number", 
                      function(success){                      
                            $scope.OpenOtpDialog();
                            $(".modelform").removeClass(progressLoader());
                      });
                    
                    /*$http
                    .post('api/registrationopt/', {phone_number: $scope.user.userprofile.phone_number, country: $scope.user.userprofile.country })
                    .then(function(response){
                            $scope.OpenOtpDialog();
                            $(".modelform").removeClass(progressLoader());
                    });*/
                } 
            }
            else {
                  vm.userForm.username.$dirty = true;
                  vm.userForm.first_name.$dirty = true;
                  vm.userForm.last_name.$dirty = true;
                  vm.userForm.email.$dirty = true;
                  vm.userForm.country.$dirty = true;
                  vm.userForm.phone_number.$dirty = true;
            } 
          }

          vm.UpdateUserProfileWithPhone = function()
          {
              if(vm.otpForm.$valid) {
                $(".modelformOtp").addClass(progressLoader());
                
                Users.patch({"id":$scope.userId, "userprofile": {"country":$scope.user.userprofile.country, "phone_number":$scope.user.userprofile.phone_number, "otp": $scope.user.otp}},//"sub_resource":"phone_number", 
                  function(success){                      
                          $(".modelformOtp").removeClass(progressLoader());
                          ngDialog.close();
                          vm.successtoaster = {
                              type:  'success',
                              title: 'Success',
                              text:  'Userprofile updated successfully.'
                          };
                          toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                });
                      
                /*$http
                  .post('api/checkotpandmobile/', {otp: $scope.user.otp, phone_number: $scope.user.userprofile.phone_number, country: $scope.user.userprofile.country  })
                  .then(function(response){ 
                      User.patch({"id":$scope.userId, "username":$scope.user.username, "first_name":$scope.user.first_name, "last_name":$scope.user.last_name, "email":$scope.user.email, "groups": $scope.user.groups, "userprofile":{"phone_number": $scope.user.userprofile.phone_number, "country": $scope.user.userprofile.country }  },
                        function(success){                      
                              $(".modelformOtp").removeClass(progressLoader());
                              ngDialog.close();
                              vm.successtoaster = {
                                  type:  'success',
                                  title: 'Success',
                                  text:  'Userprofile updated successfully.'
                              };
                              toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                        });
                  }); */
              }
              else {
                  vm.otpForm.otp.$dirty = true;
              }   
          }               
    }
})();
