(function() {
    'use strict';

    angular
        .module('app.buyers')
        .controller('BuyerDetailController', BuyerDetailController);

    BuyerDetailController.$inject = ['$resource', 'Buyers', 'grouptype', 'Company', 'ngDialog', 'toaster', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', '$filter', '$stateParams', 'SweetAlert'];
    function BuyerDetailController($resource, Buyers, grouptype, Company, ngDialog, toaster, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, $filter, $stateParams, SweetAlert) {
        CheckAuthenticated.check();        
        
        var vm = this;
        $scope.company_id = localStorage.getItem('company'); 
        $scope.is_staff   = localStorage.getItem('is_staff');
        $scope.groupType = grouptype.query();
        
        var buyercompanyid = parseInt($stateParams.id);
        
        $scope.buyer = {};
        Buyers.query({"company": buyercompanyid, "cid": $scope.company_id},
        function (success){
            if(success.length > 0)
            {
                console.log(JSON.stringify(success[0]));
                $scope.buyer = success[0];
                $scope.buyer.payment_duration = parseInt(success[0].payment_duration);
                $scope.buyer.credit_limit = parseFloat(success[0].credit_limit);
                $scope.buyer.cash_discount = parseFloat(success[0].cash_discount);
                $scope.buyer.discount = parseFloat(success[0].discount);
                
                $scope.buyer.brokerage_fees = parseFloat(success[0].brokerage_fees);
            }
        });

        Company.get({"id": buyercompanyid},
        function (success){
            console.log(JSON.stringify(success));
            $scope.buyercompanydetail = success;
        });
        $scope.brokers = Company.query({'id':$scope.company_id, 'sub_resource':'brokers'})
        
        $scope.buyerGroupTypeChanged = function(buyer_group_type){
            console.log(buyer_group_type);
            grouptype.get({"id": buyer_group_type },
                function(success){
                    console.log(success);
                    console.log(success.name);
                    $scope.buyer.group_type_name = success.name;
                });

        }

        $scope.Update = function(){
            $scope.buyer['cid'] = $scope.company_id;
            Buyers.patch($scope.buyer,
            function(success){                    
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Buyer details updated successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    //reloadData();
                    $scope.order = {};
              })
        }   
        
        $scope.salesordersDatatable = function(){
             $scope.templateURL = 'app/views/buyers/buyer_salesorders.html';
          
        }
        
        
        
        
    }
})();
