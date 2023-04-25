(function() {
    'use strict';

    angular
        .module('app.auth')
        .controller('PrintOrderController', PrintOrderController);

    PrintOrderController.$inject = ['$http', '$state', '$stateParams', 'djangoAuth', 'toaster', 'SalesOrders', 'PurchaseOrders', '$scope'];
    function PrintOrderController($http, $state, $stateParams, djangoAuth, toaster, SalesOrders, PurchaseOrders, $scope) {
        //CheckAuthenticated.check();

        var vm = this;
        $scope.company_id = localStorage.getItem('company');
        console.log("PrintOrderController");
        
        
        if($stateParams.salesorder != null){
            SalesOrders.get({'id': $stateParams.salesorder, 'cid':$scope.company_id, "sub_resource":"catalogwise"}).$promise.then(function(result){
                vm.order = result
                
                vm.order.products = [];
                var no = 1
                /*vm.subtotal = 0;
                vm.tax = 0;
                vm.grand_total = 0;*/
                
                for(var c=0; c<(result.catalogs.length); c++){
                    for(var i=0; i<(result.catalogs[c].products.length); i++){
                        var item = result.catalogs[c].products[i];
                        
                        vm.order.products[i] = {no:no, id:item.id, price:item.rate, quantity:item.quantity, image:item.product_image, sku:item.product_sku, is_select:true, catalog_name:result.catalogs[c].name};
                        no += 1;
                        
                        //vm.subtotal += (item.rate*item.quantity);
                    }
                }
                
                /*vm.tax = vm.subtotal * 18 / 100;
                
                vm.grand_total = vm.subtotal // + vm.tax
                */
            });
        }
        else if($stateParams.purchaseorder != null){
            PurchaseOrders.get({'id': $stateParams.purchaseorder, 'cid':$scope.company_id, "sub_resource":"catalogwise"}).$promise.then(function(result){
                vm.order = result
                
                vm.order.products = [];
                var no = 1
                /*vm.subtotal = 0;
                vm.tax = 0;
                vm.grand_total = 0;*/
                
                for(var c=0; c<(result.catalogs.length); c++){
                    for(var i=0; i<(result.catalogs[c].products.length); i++){
                        var item = result.catalogs[c].products[i];
                        
                        vm.order.products[i] = {no:no, id:item.id, price:item.rate, quantity:item.quantity, image:item.product_image, sku:item.product_sku, is_select:true, catalog_name:result.catalogs[c].name};
                        no += 1;
                        
                        //vm.subtotal += (item.rate*item.quantity);
                    }
                }
                
                /*vm.tax = vm.subtotal * 18 / 100;
                
                vm.grand_total = vm.subtotal // + vm.tax
                */
            });
        }
    }
})();
