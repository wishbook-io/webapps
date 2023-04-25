/**=========================================================
 * Module: access-recover.js
 * Demo for recover account api
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.auth')
        .controller('RecoverFormController', RecoverFormController);

    RecoverFormController.$inject = ['$http', '$scope', '$state', 'djangoAuth', 'Country', 'CheckOtpAndChangePassword', 'toaster', 'ngDialog', 'PasswordReset'];
    function RecoverFormController($http, $scope, $state, djangoAuth, Country, CheckOtpAndChangePassword, toaster, ngDialog, PasswordReset) {
        var vm = this;
          vm.forgotpass = {};
          
          Country.query().$promise.then(function(success){
                $scope.countries = success;
                vm.forgotpass.country = 1;
          });
          
          $scope.openConfirm = function () {
            $scope.otp = {};
            ngDialog.openConfirm({
              template: 'changepass',
              scope: $scope,
              className: 'ngdialog-theme-default',
              closeByDocument: false
            });
          };
            
          vm.recover = function() {
              //  alert(vm.forgotpass.country_dialcode+vm.forgotpass.phone_number);
               if(vm.forgotpassForm.$valid) {
                    $(".modelform").addClass(progressLoader());
                    
                    PasswordReset.save({"phone_number" : vm.forgotpass.phone_number, "country":vm.forgotpass.country},
                    function(success){
                        $scope.openConfirm();
                    });
                    
                    /*$http
                      .post('api/registrationopt/', {phone_number: vm.forgotpass.phone_number, country: vm.forgotpass.country, is_forgot_password: "yes" })
                      .then(function(response){
                              $scope.openConfirm();
                      });*/

              }
              else {
                   vm.forgotpassForm.phone_number.$dirty = true; 
                   vm.forgotpassForm.country.$dirty = true; 
              }
          };


          vm.ChnagePassword = function() {
            if(vm.changepasswordForm.$valid) {
              $(".modelformOtp").addClass(progressLoader());
              
                PasswordReset.save({"phone_number" : vm.forgotpass.phone_number, "country":vm.forgotpass.country, "otp":vm.changepassword.otp, "password": vm.changepassword.new_password1},
                function(success){
                    $(".modelformOtp").removeClass(progressLoader());
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'New password saved successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    ngDialog.close();
                    $state.go('page.login');
                });
                    
                /*CheckOtpAndChangePassword.save({"country":vm.forgotpass.country,"phone_number":vm.forgotpass.phone_number, "otp":vm.changepassword.otp, "password": vm.changepassword.new_password1},
                  function(success){
                       
                        $(".modelformOtp").removeClass(progressLoader());
                        
                        vm.successtoaster = {
                            type:  'success',
                            title: 'Success',
                            text:  'New password saved successfully.'
                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                        ngDialog.close();
                        $state.go('page.login');
                  });*/
            }
            else {
                 vm.changepasswordForm.otp.$dirty = true; 
                 vm.changepasswordForm.account_password.$dirty = true; 
                 vm.changepasswordForm.account_password_confirm.$dirty = true; 
            }
          };

         /* vm.recover = function() {

               if(vm.recoverForm.$valid) {
                    $(".modelform").addClass(progressLoader());
                    djangoAuth.resetPassword(vm.account.email)
                    .then(function(data){
                        $(".modelform").removeClass(progressLoader());
                        vm.successtoaster = {
                            type:  'success',
                            title: 'Success',
                            text:  'Reset password intruction has been sent to your email id. Please check!'
                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    },
                    function(error){
                        $(".modelform").removeClass(progressLoader());
                        angular.forEach(error.email, function(value, key) {
                          vm.errortoaster = {
                              type:  'error',
                              title: "Email",//'Failed',//
                              text:  value.toString()
                             };
                            toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                          });
                    });

              }
              else {
                   vm.recoverForm.account_email.$dirty = true;
              }
          };*/
      }
    
})();
