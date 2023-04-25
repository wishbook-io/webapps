
(function() {
    'use strict';

    angular
        .module('app.merge')
        .controller('MergeController', MergeController);

    MergeController.$inject = ['$resource', '$http', '$scope', 'Upload', 'toaster', 'CompanyList', 'Company', 'ngDialog', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', '$state', 'CheckAuthenticated', 'resendbuyer', '$cookies', '$localStorage'];
    function MergeController($resource, $http, $scope, Upload, toaster, CompanyList, Company, ngDialog, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $state, CheckAuthenticated, resendbuyer, $cookies, $localStorage) {
        CheckAuthenticated.check();
        
        var vm = this;
        
        $scope.company_id = localStorage.getItem('company');// $cookies.get('company');
        
		//$scope.companies = CompanyList.query();
				
        $scope.merge = {};
        $scope.merge_details = {};
        vm.ProceedMerge = function() {
            if(vm.mergeForm.$valid) {
                $(".modelform").addClass(progressLoader());
				Company.get({id:'merge', merge_from:$scope.merge.merge_from, merge_into:$scope.merge.merge_into},
                function(success){
                    $(".modelform").removeClass(progressLoader());
                    //alert(JSON.stringify(success))
                    
                    $scope.merge_details = success;
                    $scope.OpenDialog();
                });
            }
            else
            {
                vm.mergeForm.merge_from.$dirty = true;
                vm.mergeForm.merge_into.$dirty = true;
            }
        };
        
        
        $scope.OpenDialog = function () {
            ngDialog.openConfirm({
              template: 'mergedetails',
              scope: $scope,
              className: 'ngdialog-theme-default',
              closeByDocument: false
            })
        };
        
        vm.CloseDialog = function() {
            ngDialog.close();
        };
        
        vm.SubmitMerge = function() {
			//alert('SubmitMerge');
            $(".modelform3").addClass(progressLoader());
            Company.save({id:'merge', merge_from:$scope.merge.merge_from, merge_into:$scope.merge.merge_into},
            function(success){
                $(".modelform3").removeClass(progressLoader());
                //alert(JSON.stringify(success))
                ngDialog.close();
                vm.successtoaster = {
                    type:  'success',
                    title: 'Success',
                    text:  'Merged successfully.'
                };
                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                //$scope.companies = CompanyList.query();
                
                $scope.merge = {};
                $scope.merge_details = {};
            });
		};
        
        
        
    }
})();
