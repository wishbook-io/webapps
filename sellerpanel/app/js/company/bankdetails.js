
(function() {
    'use strict';

    angular
        .module('app.gst')
        .controller('bankdetailsController', bankdetailsController);

    bankdetailsController.$inject = ['$resource', '$state', '$http', 'djangoAuth', 'kyc', 'BankDetails', '$scope', 'CheckAuthenticated', 'toaster', '$location', 'SidebarLoader', '$rootScope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', 'ngDialog', '$cookies', '$localStorage'];
    function bankdetailsController($resource, $state, $http, djangoAuth, kyc, BankDetails, $scope, CheckAuthenticated, toaster, $location, SidebarLoader, $rootScope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, ngDialog, $cookies, $localStorage) {
        CheckAuthenticated.check();
        $scope.app.offsidebarOpen = false;
        $scope.update_bank_flag = false;
        $scope.company_id = localStorage.getItem('company');// $cookies.get('company');
     
        var vm = this;  
        BankDetails.query({'cid': $scope.company_id }, function(success){
            console.log(success);
            if(success.length > 0){
              $scope.bank_details = success[0];
              //$scope.kyc_id = success[0].id;
              $scope.update_bank_flag = true;
            }
            else
            {
              $scope.update_bank_flag = false;
            }
        });
        $scope.submitBankDetails = function(){
            console.log($scope.bankForm)
            if($scope.bankForm.$valid)
            {
                  if($scope.update_bank_flag == false)
                  {
                    $(".modelform-bank").addClass(progressLoader());
                    BankDetails.save({'cid': $scope.company_id, 'bank_name': $scope.bank_details.bank_name, 'account_number': $scope.bank_details.account_number, 'ifsc_code': $scope.bank_details.ifsc_code, 'account_type': $scope.bank_details.account_type, 'account_name': $scope.bank_details.account_name}, function(success){
                          $(".modelform-bank").removeClass(progressLoader());
                          vm.successtoaster = {
                              type:  'success',
                              title: 'Success',
                              text:  'Bank details added successfully.'
                          };
                          toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                          $scope.update_bank_flag = true;
                          $scope.bank_details.id = success.id;
                          ngDialog.close();
                    });
                  }
                  else
                  {
                    $(".modelform-bank").addClass(progressLoader());
                    BankDetails.patch({'cid': $scope.company_id, 'id': $scope.bank_details.id, 'bank_name': $scope.bank_details.bank_name, 'account_number': $scope.bank_details.account_number, 'ifsc_code': $scope.bank_details.ifsc_code, 'account_type': $scope.bank_details.account_type, 'account_name': $scope.bank_details.account_name}, function(success){
                          $(".modelform-bank").removeClass(progressLoader());
                          vm.successtoaster = {
                              type:  'success',
                              title: 'Success',
                              text:  'Bank details updated successfully.'
                          };
                          toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                          ngDialog.close();
                    });
                  }
            }
        }

    }
})();
