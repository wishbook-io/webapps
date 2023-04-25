
(function() {
    'use strict';

    angular
        .module('app.gst')
        .controller('gstController', gstController);

    gstController.$inject = ['$resource', '$state', '$http', 'djangoAuth', 'kyc', '$scope', 'CheckAuthenticated', 'toaster', '$location', 'SidebarLoader', '$rootScope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', 'ngDialog', '$cookies', '$localStorage'];
    function gstController($resource, $state, $http, djangoAuth, kyc, $scope, CheckAuthenticated, toaster, $location, SidebarLoader, $rootScope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, ngDialog, $cookies, $localStorage) {
        CheckAuthenticated.check();
        $scope.app.offsidebarOpen = false;

        $scope.company_id = localStorage.getItem('company');// $cookies.get('company');
     
        var vm = this;

        $scope.gst = {};
        kyc.query({ 'cid' : $scope.company_id },
          function(success){
              if(success != ''){
                $scope.gst.gstin = success[0].gstin;
                console.log(success[0].id);
                $scope.gst.id = success[0].id;
                $scope.update_flag = true;
              }
              else
              {
                $scope.update_flag = false;
              }
          });
        $scope.gstForm = '';
        $scope.submitGstDetails = function() {
          if($scope.gstForm.$valid) {
              if($scope.update_flag == false){
                kyc.save({ 'cid' : $scope.company_id, 'gstin': $scope.gst.gstin },
                  function (success){
                      vm.successtoaster = {
                                        type:  'success', 
                                        title: 'Success',
                                        text:  'GST Details added successfully.'
                                    };
                      toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                      $scope.update_flag = true;
                      $scope.gst.id = success.id;
                  });
              }
              else{
                kyc.patch({ 'cid' : $scope.company_id, 'gstin': $scope.gst.gstin, "id" : $scope.gst.id  },
                  function (success){
                      vm.successtoaster = {
                                        type:  'success', 
                                        title: 'Success',
                                        text:  'GST Details updated successfully.'
                                    };
                      toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                  });
              }
          }
          else{
             $scope.gstForm.gstin.$dirty = true;
          }
        }
        
  

    }
})();
