
(function() {
    'use strict';

    angular
        .module('app.discount')
        .controller('discountController', discountController);

    discountController.$inject = ['$resource', '$state', '$http', 'djangoAuth', 'buyerdiscount', '$scope', 'CheckAuthenticated', 'toaster', '$location', 'SidebarLoader', '$rootScope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', 'ngDialog', '$cookies', '$localStorage'];
    function discountController($resource, $state, $http, djangoAuth, buyerdiscount, $scope, CheckAuthenticated, toaster, $location, SidebarLoader, $rootScope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, ngDialog, $cookies, $localStorage) {
        CheckAuthenticated.check();
        $scope.app.offsidebarOpen = false;

        $scope.company_id = localStorage.getItem('company');// $cookies.get('company');
     
        var vm = this;

        $scope.wholesalediscount = {};
        buyerdiscount.query({ 'cid' : $scope.company_id, 'buyer_type': 'Wholesaler' },
          function(success){
              if(success != ''){
                $scope.wholesale_update_flag = true;
                $scope.wholesalediscount.discount = parseFloat(success[0].discount);
                $scope.wholesalediscount.cash_discount = parseFloat(success[0].cash_discount);
                $scope.wholesalediscount.payment_duration = parseInt(success[0].payment_duration);
                $scope.wholesalediscount.id = success[0].id;
              }
              else
              {
                $scope.wholesale_update_flag = false;
              }
          });

        $scope.retailerdiscount = {};
        buyerdiscount.query({ 'cid' : $scope.company_id, 'buyer_type': 'Retailer' },
          function(success){
              if(success != ''){
                $scope.retailer_update_flag = true;
              //  console.log(success[0]);
                $scope.retailerdiscount.discount = parseFloat(success[0].discount);
                $scope.retailerdiscount.cash_discount = parseFloat(success[0].cash_discount);
                $scope.retailerdiscount.payment_duration = parseInt(success[0].payment_duration);
                $scope.retailerdiscount.id = success[0].id;
              }
              else
              {
                $scope.retailer_update_flag = false;
              }
          });

        $scope.brokerdiscount = {};
        buyerdiscount.query({ 'cid' : $scope.company_id, 'buyer_type': 'Broker' },
          function(success){
              if(success != ''){
                $scope.broker_update_flag = true;
                $scope.brokerdiscount.discount = parseFloat(success[0].discount);
                $scope.brokerdiscount.cash_discount = parseFloat(success[0].cash_discount);
                $scope.brokerdiscount.payment_duration = parseInt(success[0].payment_duration);
                $scope.brokerdiscount.id = success[0].id;
              }
              else
              {
                $scope.broker_update_flag = false;
              }
          });

        $scope.publicdiscount = {};
        buyerdiscount.query({ 'cid' : $scope.company_id, 'buyer_type': 'Public' },
          function(success){
              if(success != ''){
                $scope.public_update_flag = true;
                $scope.publicdiscount.discount = parseFloat(success[0].discount);
                $scope.publicdiscount.cash_discount = parseFloat(success[0].cash_discount);
                $scope.publicdiscount.payment_duration = parseInt(success[0].payment_duration);
                $scope.publicdiscount.id = success[0].id;
              }
              else
              {
                $scope.public_update_flag = false;
              }
          });

      
        $scope.submitWholesaleDiscount = function() {
          if($scope.wholesalediscountForm.$valid) {
              if($scope.wholesale_update_flag == false){
                buyerdiscount.save({ 'cid' : $scope.company_id, 'cash_discount': $scope.wholesalediscount.cash_discount, 'discount': $scope.wholesalediscount.discount, 'payment_duration': $scope.wholesalediscount.payment_duration, 'buyer_type': 'Wholesaler' },
                  function (success){
                    $scope.wholesale_update_flag = true;
                    $scope.wholesalediscount.id = success.id;
                      vm.successtoaster = {
                                        type:  'success', 
                                        title: 'Success',
                                        text:  'Wholesale Discount Details added successfully.'
                                    };
                      toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                  });
              }
              else{
                buyerdiscount.patch({ 'cid' : $scope.company_id, 'cash_discount': $scope.wholesalediscount.cash_discount, 'discount': $scope.wholesalediscount.discount, 'payment_duration': $scope.wholesalediscount.payment_duration, 'buyer_type': 'Wholesaler', 'id': $scope.wholesalediscount.id },
                  function (success){
                      vm.successtoaster = {
                                        type:  'success', 
                                        title: 'Success',
                                        text:  'Wholesale Discount Details updated successfully.'
                                    };
                      toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                  });
              }
          }
          else{
             $scope.wholesalediscountForm.cash_discount.$dirty = true;
             $scope.wholesalediscountForm.discount.$dirty = true;
             $scope.wholesalediscountForm.payment_duration.$dirty = true;
          }
        }
        
         $scope.submitRetailerDiscount = function() {
          if($scope.retailerdiscountForm.$valid) {
              if($scope.retailer_update_flag == false){
                buyerdiscount.save({ 'cid' : $scope.company_id, 'cash_discount': $scope.retailerdiscount.cash_discount, 'discount': $scope.retailerdiscount.discount, 'payment_duration': $scope.retailerdiscount.payment_duration, 'buyer_type': 'Retailer' },
                  function (success){
                    $scope.retailer_update_flag = true;
                    $scope.retailerdiscount.id = success.id;
                      vm.successtoaster = {
                                        type:  'success', 
                                        title: 'Success',
                                        text:  'Retailer Discount Details added successfully.'
                                    };
                      toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                  });
              }
              else{
                buyerdiscount.patch({ 'cid' : $scope.company_id, 'cash_discount': $scope.retailerdiscount.cash_discount, 'discount': $scope.retailerdiscount.discount, 'payment_duration': $scope.retailerdiscount.payment_duration, 'buyer_type': 'Retailer', 'id': $scope.retailerdiscount.id },
                  function (success){
                      vm.successtoaster = {
                                        type:  'success', 
                                        title: 'Success',
                                        text:  'Retailer Discount Details updated successfully.'
                                    };
                      toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                  });
              }
          }
          else{
             $scope.retailerdiscountForm.cash_discount.$dirty = true;
             $scope.retailerdiscountForm.discount.$dirty = true;
             $scope.retailerdiscountForm.payment_duration.$dirty = true;
          }
        }

        $scope.submitBrokerDiscount = function() {
          if($scope.brokerdiscountForm.$valid) {
              if($scope.broker_update_flag == false){
                buyerdiscount.save({ 'cid' : $scope.company_id, 'cash_discount': $scope.brokerdiscount.cash_discount, 'discount': $scope.brokerdiscount.discount, 'payment_duration': $scope.brokerdiscount.payment_duration, 'buyer_type': 'Broker' },
                  function (success){
                    $scope.broker_update_flag = true;
                    $scope.brokerdiscount.id = success.id;
                      vm.successtoaster = {
                                        type:  'success', 
                                        title: 'Success',
                                        text:  'Broker Discount Details added successfully.'
                                    };
                      toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                  });
              }
              else{
                buyerdiscount.patch({ 'cid' : $scope.company_id, 'cash_discount': $scope.brokerdiscount.cash_discount, 'discount': $scope.brokerdiscount.discount, 'payment_duration': $scope.brokerdiscount.payment_duration, 'buyer_type': 'Broker', 'id': $scope.brokerdiscount.id },
                  function (success){
                      vm.successtoaster = {
                                        type:  'success', 
                                        title: 'Success',
                                        text:  'Broker Discount Details updated successfully.'
                                    };
                      toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                  });
              }
          }
          else{
             $scope.brokerdiscountForm.cash_discount.$dirty = true;
             $scope.brokerdiscountForm.discount.$dirty = true;
             $scope.brokerdiscountForm.payment_duration.$dirty = true;
          }
        }

        $scope.submitPublicDiscount = function() {
          if($scope.publicdiscountForm.$valid) {
              if($scope.public_update_flag == false){
                buyerdiscount.save({ 'cid' : $scope.company_id, 'cash_discount': $scope.publicdiscount.cash_discount, 'discount': $scope.publicdiscount.discount, 'payment_duration': $scope.publicdiscount.payment_duration, 'buyer_type': 'Public' },
                  function (success){
                    $scope.public_update_flag = true;
                    $scope.publicdiscount.id = success.id;
                      vm.successtoaster = {
                                        type:  'success', 
                                        title: 'Success',
                                        text:  'Public Discount Details added successfully.'
                                    };
                      toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                  });
              }
              else{
                buyerdiscount.patch({ 'cid' : $scope.company_id, 'cash_discount': $scope.publicdiscount.cash_discount, 'discount': $scope.publicdiscount.discount, 'payment_duration': $scope.publicdiscount.payment_duration, 'buyer_type': 'Public', 'id': $scope.publicdiscount.id },
                  function (success){
                      vm.successtoaster = {
                                        type:  'success', 
                                        title: 'Success',
                                        text:  'Public Discount Details updated successfully.'
                                    };
                      toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                  });
              }
          }
          else{
             $scope.publicdiscountForm.cash_discount.$dirty = true;
             $scope.publicdiscountForm.discount.$dirty = true;
             $scope.publicdiscountForm.payment_duration.$dirty = true;
          }
        }

    }
})();
