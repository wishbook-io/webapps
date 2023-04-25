
(function() {
    'use strict';

    angular
        .module('app.mirror')
        .controller('CatalogMirrorController', CatalogMirrorController);

    CatalogMirrorController.$inject = ['$resource', '$http', '$scope', 'Upload', 'toaster', 'Brand', 'CompanyList', 'DropdownCatalog', 'AssignCatalogToCompany', 'grouptype', 'ngDialog', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', '$state', 'CheckAuthenticated', '$cookies', '$localStorage'];
    function CatalogMirrorController($resource, $http, $scope, Upload, toaster, Brand, CompanyList, DropdownCatalog, AssignCatalogToCompany, grouptype, ngDialog, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $state, CheckAuthenticated, $cookies, $localStorage) {
        CheckAuthenticated.check();
        
        var vm = this;
        
        $scope.company_id = localStorage.getItem('company');// $cookies.get('company');
        
		$scope.brands = Brand.query({cid:$scope.company_id, sub_resource:"dropdown"});
		//$scope.companies = CompanyList.query();
		
		$scope.GetCatalog =  function(brand) { 
		   $scope.catalogs = DropdownCatalog.query({brand:brand});
		}
		
        $scope.catalogm = {};
        vm.SubmitCatalogMirror = function() {
            if(vm.catalogMirrorForm.$valid) {
                $(".modelform").addClass(progressLoader());
				AssignCatalogToCompany.save($scope.catalogm,
                function(success){
                    $(".modelform").removeClass(progressLoader());
                    
                    ngDialog.close();
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Catalog has been assigned.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    
                },
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
                    
                });
            }
            else
            {
                vm.catalogMirrorForm.brand.$dirty = true;
                vm.catalogMirrorForm.catalog.$dirty = true;
                vm.catalogMirrorForm.company.$dirty = true;
            }
        };
        
        
    }
})();
