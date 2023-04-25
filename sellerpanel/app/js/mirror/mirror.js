
(function() {
    'use strict';

    angular
        .module('app.buyers')
        .controller('BuyerslistController', BuyerslistController);

    BuyerslistController.$inject = ['$resource', '$http', '$scope', 'Upload', 'toaster', 'Brand', 'CompanyList', 'DropdownCatalog', 'AssignCatalogToCompany', 'grouptype', 'Buyers', 'ngDialog', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', '$state', 'CheckAuthenticated', 'resendbuyer', '$cookies', '$localStorage'];
    function BuyerslistController($resource, $http, $scope, Upload, toaster, Brand, CompanyList, DropdownCatalog, AssignCatalogToCompany, grouptype, Buyers, ngDialog, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $state, CheckAuthenticated, resendbuyer, $cookies, $localStorage) {
        CheckAuthenticated.check();
        
        var vm = this;
        
        $scope.company_id = localStorage.getItem('company');// $cookies.get('company');
        
		$scope.brands = Brand.query({cid:$scope.company_id, sub_resource:"dropdown"});
		//$scope.companies = CompanyList.query();
		
		$scope.GetCatalog =  function(brand) { 
		   $scope.catalogs = DropdownCatalog.query({brand:brand});
		}
		
        $scope.buyer = {};
        vm.AddBuyer = function() {
            if(vm.addbuyerForm.$valid) {
                $(".modelform").addClass(progressLoader());
				AssignCatalogToCompany.save($scope.buyer,
                function(success){
                    $(".modelform").removeClass(progressLoader());
                    
                    ngDialog.close();
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Buyer invited successfully.'
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
                vm.addbuyerForm.brand.$dirty = true;
                vm.addbuyerForm.catalog.$dirty = true;
                vm.addbuyerForm.company.$dirty = true;
            }
        };
        
        
    }
})();
