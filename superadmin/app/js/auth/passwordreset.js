/**=========================================================
 * Module: access-passwordreset.js
 * Demo for passwordreset account api
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.auth')
        .controller('PasswordresetFormController', PasswordresetFormController);

    PasswordresetFormController.$inject = ['$http', '$state', '$stateParams', 'djangoAuth', 'toaster'];
    function PasswordresetFormController($http, $state, $stateParams, djangoAuth, toaster) {
        var vm = this;

      
          vm.account = {};
            
          vm.passwordreset = function() {
            //  alert(vm.passwordreset.password);
            //  alert($stateParams.userToken)
           
                if(vm.passwordresetForm.$valid) {
                  $(".modelform").addClass(progressLoader());
                  djangoAuth.confirmReset($stateParams.userToken, $stateParams.passwordResetToken, vm.passwordreset.password, vm.passwordreset.password_confirm)
                  .then(function(data){
                      $(".modelform").removeClass(progressLoader());
                      vm.successtoaster = {
                          type:  'success',
                          title: 'Success',
                          text:  'Password has been changed successfully'
                      };
                      toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                      $state.go('page.login');
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
                vm.passwordresetForm.account_password.$dirty = true;
                vm.passwordresetForm.account_password_confirm.$dirty = true;
                
              }
          };
        
    }
})();
