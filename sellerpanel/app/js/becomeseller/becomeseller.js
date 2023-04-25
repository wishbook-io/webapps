
(function() {
    'use strict';

    angular
        .module('app.becomeseller')
        .controller('becomeSellerController', becomeSellerController);

    becomeSellerController.$inject = ['$resource', '$http', '$scope', 'toaster', 'CatalogSeller', 'CompanyList', 'DropdownCatalog', 'ngDialog', '$compile', '$state', 'CheckAuthenticated', '$cookies', '$localStorage'];
    function becomeSellerController($resource, $http, $scope, toaster, CatalogSeller, CompanyList, DropdownCatalog, ngDialog, $compile, $state, CheckAuthenticated,  $cookies, $localStorage) {
        CheckAuthenticated.check();
        
        var vm = this;
        
        vm.seller = {};
        vm.seller.enable_duration = 30;
        $scope.company_id = localStorage.getItem('company');// $cookies.get('company');
        $(".modelform").addClass(progressLoader());
		
        //$scope.brands = Brand.query({cid:$scope.company_id, sub_resource:"dropdown"});
		/*$scope.companies = CompanyList.query(function(success){
            $(".modelform").removeClass(progressLoader());
        }); */
		
    	$scope.catalogs = DropdownCatalog.query({'view_permission' : 'public'}, function(success){
            $(".modelform").removeClass(progressLoader());
        });
		
		vm.BecomeSeller = function(){
            
			console.log(vm.seller.catalog);
            if(!vm.seller.catalog){
                vm.errortoaster = {
                            type:  'error',
                            title: 'Failed',
                            text:  'Please Select Catalog.'
                        };
                        toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                return;
            }
            else if(!vm.seller.company){
                vm.errortoaster = {
                            type:  'error',
                            title: 'Failed',
                            text:  'Please Select Company.'
                        };
                        toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                return;
            }
            else{
                $(".modelform").addClass(progressLoader());
            }
            var today = new Date(); 
            var expiry_date = today.setDate(today.getDate() + vm.seller.enable_duration);
            expiry_date = formatDate(expiry_date) + "T23:59:59Z"
            
            console.log(expiry_date);
            
             CatalogSeller.save({'catalog': vm.seller.catalog.id, 'selling_company': vm.seller.company, 'expiry_date': expiry_date, 'selling_type':'Public', 'sell_full_catalog':vm.seller.catalog.sell_full_catalog},
                function(success){
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Details Saved successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);   
                    vm.seller = {};
                    vm.seller.enable_duration = 30;
                    $(".modelform").removeClass(progressLoader());
                }); 
        }
      /*  $scope.buyer = {};
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
        };  */
        
        
    }
})();
