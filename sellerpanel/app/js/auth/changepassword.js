/**=========================================================
 * Module: access-changepassword.js
 * Demo for changepassword account api
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.auth')
        .controller('ChangePasswordFormController', ChangePasswordFormController);

    ChangePasswordFormController.$inject = ['$http', '$state', '$stateParams', '$scope', 'djangoAuth', 'toaster'];
    function ChangePasswordFormController($http, $state, $stateParams, $scope, djangoAuth, toaster) {
      $scope.app.offsidebarOpen = false;
        var vm = this;
            
          vm.ChangePassword = function() {
          
            if(vm.changepasswordForm.$valid) {
              $(".modelform").addClass(progressLoader()); 
              djangoAuth.changePassword(vm.changepassword.new_password1, vm.changepassword.new_password2)
                  .then(function(data){
                      $(".modelform").removeClass(progressLoader());
                      vm.successtoaster = {
                          type:  'success',
                          title: 'Success',
                          text:  'Password has been changed successfully'
                      };
                      toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                  }/*,function(error){
                         $(".modelform").removeClass(progressLoader());
                          angular.forEach(error, function(value, key) {
                            vm.errortoaster = {
                                type:  'error',
                                title: toTitleCase(key),//'Failed',//
                                text:  value.toString()
                               };
                              toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                            });
                  }*/);
              }
              else {
                vm.changepasswordForm.account_password.$dirty = true;
                vm.changepasswordForm.account_password_confirm.$dirty = true;
                
              }
          };
        
    }
})();
