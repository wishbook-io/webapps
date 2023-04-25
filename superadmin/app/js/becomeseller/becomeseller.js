
(function() {
    'use strict';

    angular
        .module('app.becomeseller')
        .controller('becomeSellerController', becomeSellerController);

    becomeSellerController.$inject = ['$resource', '$http', '$scope', 'toaster', 'Catalog', 'BecomeASeller', 'CompanyList', 'DropdownCatalog', 'ngDialog', '$compile', '$state', 'CheckAuthenticated', '$cookies', '$localStorage'];
    function becomeSellerController($resource, $http, $scope, toaster, Catalog, BecomeASeller, CompanyList, DropdownCatalog, ngDialog, $compile, $state, CheckAuthenticated,  $cookies, $localStorage) {
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
		vm.catalogSelected = function(catalog){
            console.log(catalog.id);
            $scope.cat_id = catalog.id;  
            
            vm.single_piece_price_percentage = null;
            vm.single_piece_price = null;
            vm.is_percentage = null;
            vm.show_margin_setting = true;

            Catalog.get({'id': $scope.cat_id, 'cid': $scope.company_id}, function(data){
                console.log(data);
                //alert(data.price_range);
                vm.seller.sell_full_catalog = data.sell_full_catalog;

            // WB-3817  Seller panel : remove set single pc margin when become seller, add and update catalog etc 
            /*    if(data.price_range.indexOf('-') > 0){
                    var prices = data.price_range.split('-');
                    vm.current_price1 =  parseFloat(prices[0]);
                    vm.current_price2 =  parseFloat(prices[1]);
                    vm.max_margin_rs = vm.current_price2*0.20;
                }
                else
                {
                    vm.current_price1 = parseFloat(data.price_range);
                    vm.max_margin_rs = vm.current_price1*0.20;
                }

                if(data.single_piece_price_percentage != null || data.single_piece_price != null){
                    vm.show_margin_setting = false;
                }*/
            }); 
        }
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
               // $(".modelform").addClass(progressLoader());
            }
            var today = new Date(); 
            var expiry_date = today.setDate(today.getDate() + vm.seller.enable_duration);
            expiry_date = formatDate(expiry_date) + "T23:59:59Z"
            
            console.log(expiry_date);

            vm.params = { 'cid': $scope.company_id, 'catalog': vm.seller.catalog.id, 'selling_company': vm.seller.company, 'expiry_date': expiry_date, 'selling_type':'Public', 'sell_full_catalog': vm.seller.sell_full_catalog };
            // WB-3817  Seller panel : remove set single pc margin when become seller, add and update catalog etc 
           /* if(vm.seller.sell_full_catalog == false && vm.is_percentage == false  && vm.single_piece_price != undefined){
                vm.params['single_piece_price'] = vm.single_piece_price;
            }
            if(vm.seller.sell_full_catalog == false && vm.is_percentage == true && vm.single_piece_price_percentage != undefined){
                vm.params['single_piece_price_percentage'] = vm.single_piece_price_percentage;
            }
            console.log(vm.seller.sell_full_catalog+" "+ vm.is_percentage+" "+vm.single_piece_price_percentage+" "+vm.single_piece_price);
            console.log(vm.params);
            if(vm.is_percentage == true){
                if(vm.single_piece_price_percentage > 20 || vm.single_piece_price_percentage == undefined){
                    vm.errortoaster = {
                          type:  'error',
                          title: 'Percentage Margin',
                          text:  'You can not add margin more than 20%.'
                      };   
                      toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                    return;
                } 
            }
            if(vm.is_percentage == false){
                if(vm.single_piece_price > vm.max_margin_rs || vm.single_piece_price == undefined){
                    vm.errortoaster = {
                          type:  'error',
                          title: 'Percentage Margin',
                          text:  'You can not add margin more than 20%.'
                      };   
                      toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                    return;
                }
            }*/
            $(".modelform").addClass(progressLoader());
             //CatalogSeller.save({'catalog': vm.seller.catalog.id, 'selling_company': vm.seller.company, 'expiry_date': expiry_date, 'selling_type':'Public', 'sell_full_catalog':vm.seller.catalog.sell_full_catalog},
             BecomeASeller.save(vm.params,
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
