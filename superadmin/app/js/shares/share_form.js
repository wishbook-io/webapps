(function() {
    'use strict';

    angular
        .module('app.shares')
        .controller('SharesController', SharesController);

    SharesController.$inject = ['$resource', '$filter', '$scope','Shares', 'BuyerSegmentation', 'BuyerList', 'Catalog', 'Selection', 'ngDialog', 'toaster', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', '$state', 'CheckAuthenticated', '$cookies', '$localStorage'];
    function SharesController($resource, $filter,  $scope, Shares, BuyerSegmentation, BuyerList, Catalog, Selection, ngDialog, toaster, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $state, CheckAuthenticated, $cookies, $localStorage) {
        
        CheckAuthenticated.check();
     
        
        var vm = this;
        
        vm.dt = new Date();
        vm.format = 'dd-MMMM-yyyy';
        vm.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        vm.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.opened = true;
        };
        
       // $(".modelform").addClass(progressLoader());
        $scope.company_id = localStorage.getItem('company');// $cookies.get('company');

    /*    vm.OpenDialog = function () {
            ngDialog.open({
                template: 'share',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };  */
        
        vm.CloseDialog = function() {
            ngDialog.close();
        };
        vm.share = {};
//        $scope.share = {};
        vm.buyer_segments = BuyerSegmentation.query({cid:$scope.company_id, id:"dropdown"});
        
        vm.catalogs = Catalog.query({cid:$scope.company_id, id:"dropdown"});
        vm.selections = Selection.query({id:"dropdown"});
        vm.share.push_downstream = "yes";
        vm.share.sms = "yes";
        vm.share.share_type = "groupwise";
        vm.share.item_type = "catalog";
       // $scope.change_price_type = 'price';
        $scope.priceinpercentageflag = false;
        $scope.priceinfixflag = false;    

        $scope.changeShareType = function(sharetype){
            //console.log(sharetype);
            $(".modelform-share").addClass(progressLoader());
            if(sharetype=='buyerwise'){
                vm.buyer_lists = BuyerList.query({"status":"approved", "cid":$scope.company_id},
                function(success){
                    $(".modelform-share").removeClass(progressLoader());
                });
            }
            else{
                vm.buyer_segments = BuyerSegmentation.query({cid:$scope.company_id, id:"dropdown"},
                    function(success){
                        $(".modelform-share").removeClass(progressLoader());
                    });
            }
        }


      /*  vm.OpenShare = function (){
            
            vm.buyer_segments = BuyerSegmentation.query({cid:$scope.company_id, id:"dropdown"});
            vm.buyer_lists = BuyerList.query({"status":"approved", "cid":$scope.company_id});
            vm.catalogs = Catalog.query({cid:$scope.company_id, id:"dropdown"});
            vm.selections = Selection.query({id:"dropdown"});
            vm.share.push_downstream = "yes";
            vm.share.sms = "yes";
            vm.share.share_type = "groupwise";
            vm.share.item_type = "catalog";
           // $scope.change_price_type = 'price';
            $scope.priceinpercentageflag = false;
            $scope.priceinfixflag = false;
            vm.OpenDialog();
        } */

        if($scope.share){
            console.log("catalogid "+$scope.share.catalog);
            Catalog.get({id: $scope.share.catalog, cid:$scope.company_id}).$promise.then(
                    function(success){
                      vm.share.full_catalog_orders_only = success.full_catalog_orders_only;
                      vm.price_range = success.price_range;
                      vm.new_price = vm.price_range;
                      if(success.exp_desp_date != null){
                        vm.share.dispatch_date = new Date(success.exp_desp_date);
                      }
                    }
                );  
        }
        vm.CheckFullCatalogFlag = function(catalogId) {
            Catalog.get({id: catalogId, cid:$scope.company_id}).$promise.then(
                function(success){
                  vm.share.full_catalog_orders_only = success.full_catalog_orders_only;
                  vm.price_range = success.price_range;
                  vm.new_price = vm.price_range;
                  if(success.exp_desp_date != null){
                    vm.share.dispatch_date = new Date(success.exp_desp_date);
                  }
                }
            );
        }

        vm.updateNewPrice = function(number,type){
            if(type == 'newprice'){
                vm.new_price = number;
            }
            else if(type == 'addperchantage'){

                if(vm.price_range.indexOf('-') !== -1){
                    vm.range = vm.price_range.split('-');
                    var low_per = (parseInt(vm.range[0]) * number)/100;
                    console.log(low_per);
                    var high_per = (parseInt(vm.range[1]) * number)/100;
                    vm.low = parseInt(vm.range[0]) + low_per;
                    vm.high = parseInt(vm.range[1]) + high_per;
                    vm.new_price = vm.low.toString() + '-' + vm.high.toString();
                }
                else{
                    var per = (parseInt(vm.price_range) * number)/100;
                    vm.new_price = parseInt(vm.price_range) + per;
                }
            }
            else{
                if(vm.price_range.indexOf('-') !== -1){
                    vm.range = vm.price_range.split('-');
                    vm.low = parseInt(vm.range[0]) + number;
                    vm.high = parseInt(vm.range[1]) + number;
                    vm.new_price = vm.low.toString() + '-' + vm.high.toString();
                }
                else{
                    vm.new_price = parseInt(vm.price_range) + number;   
                }
            }
        }
        
        vm.CheckFullSelectionFlag = function(selectionId) {
            Selection.get({id: selectionId}).$promise.then(
                function(success){
                  //vm.share.full_catalog_orders_only = success.full_catalog_orders_only;
                  
                  if(success.exp_desp_date != null){
                    vm.share.dispatch_date = new Date(success.exp_desp_date);
                  }
                }
            );
        }

        
        vm.ChangePricetype = function(priceType) {
           
          /*  if(priceType == 'percentage')
            {
                $scope.priceinpercentageflag = true;
                $scope.priceinfixflag = false;
                vm.share.change_price_fix = null;
            }
            else
            {
                $scope.priceinpercentageflag = false;   
                $scope.priceinfixflag = true;
                vm.share.change_price_add = null;
            }  */

            if(priceType == 'newprice')
            {
                $scope.newpriceflag = true;
                $scope.addmarginflag = false;   
               
                vm.share.change_price_add = null;
                vm.share.change_price_add_amount = null;
            }
            else {
                $scope.newpriceflag = false;
                $scope.addmarginflag = true;   
               
                vm.share.change_price_fix = null;
            }
            
        }

        vm.ChangeMargintype = function(marginType){
            if(marginType == 'addperchantage'){
                $scope.marginpercentageflag = true;
                $scope.marginamountflag = false;  
            }
            else{
                $scope.marginpercentageflag = false;
                $scope.marginamountflag = true;
            }
        }
        
        $scope.formatDate = function (date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        }
        
        vm.share.dispatch_date = new Date();

        vm.DoShare= function () {
            
            if(vm.shareForm.$valid) {
                var exp_desp_date = $scope.formatDate(vm.share.dispatch_date);
                //vm.share.selection = [];

                //vm.share.catalog = [vm.share.catalog];
                $scope.share.catalog = [$scope.share.catalog];
                vm.share.selection = [vm.share.selection];
                /*if($scope.change_price_type == 'percentage')
                {
                    vm.share.change_price_add = 
                }*/
                    //$(".modelform").addClass(progressLoader()); 
                    
                  //  Shares.save(vm.share,
                 /* if(vm.share.change_price_add == null)
                {
                    vm.params = {"message": vm.share.message, "full_catalog_orders_only": vm.share.full_catalog_orders_only,
                               "change_price_fix": vm.share.change_price_fix, "push_downstream": vm.share.push_downstream, "sms": vm.share.sms , "selection" : vm.share.selection, 'exp_desp_date':exp_desp_date} //"buyer_segmentation": vm.share.buyer_segmentation, "catalog": $scope.share.catalog, 
                }
                else
                {
                    vm.params = {"message": vm.share.message, "full_catalog_orders_only": vm.share.full_catalog_orders_only,
                               "change_price_add": vm.share.change_price_add, "push_downstream": vm.share.push_downstream, "sms": vm.share.sms, "selection" : vm.share.selection, 'exp_desp_date':exp_desp_date}   //"catalog": $scope.share.catalog, 
                }  */

                if($scope.newpriceflag == true)
                {
                    vm.params = {"message": vm.share.message, "full_catalog_orders_only": vm.share.full_catalog_orders_only,
                               "change_price_fix": vm.share.change_price_fix, "push_downstream": vm.share.push_downstream, "sms": vm.share.sms , "selection" : vm.share.selection, 'exp_desp_date':exp_desp_date} //"buyer_segmentation": vm.share.buyer_segmentation, "catalog": $scope.share.catalog, 
                }
                else if ($scope.marginpercentageflag == true)
                {
                    vm.params = {"message": vm.share.message, "full_catalog_orders_only": vm.share.full_catalog_orders_only,
                               "change_price_add": vm.share.change_price_add, "push_downstream": vm.share.push_downstream, "sms": vm.share.sms, "selection" : vm.share.selection, 'exp_desp_date':exp_desp_date}   //"catalog": $scope.share.catalog, 
                }  
                else
                {
                    vm.params = {"message": vm.share.message, "full_catalog_orders_only": vm.share.full_catalog_orders_only,
                               "change_price_add_amount": vm.share.change_price_add_amount, "push_downstream": vm.share.push_downstream, "sms": vm.share.sms, "selection" : vm.share.selection, 'exp_desp_date':exp_desp_date}   //"catalog": $scope.share.catalog, 
                }

                if(vm.share.share_type == "groupwise")
                    vm.params["buyer_segmentation"] = vm.share.buyer_segmentation;
                else
                    vm.params["single_company_push"] = vm.share.buyer_list;
                
                if(vm.share.item_type == "catalog")
                    vm.params["catalog"] = $scope.share.catalog;
                else
                    vm.params["selection"] = vm.share.selection;
                
                Shares.save(vm.params,
                    function(success){
                     //   $(".modelform").removeClass(progressLoader());
                       
                        vm.successtoaster = {
                            type:  'success', 
                            title: 'Success',
                            text:  'Catalog/selection shared successfully.'
                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                        $scope.reloadData();
                    });
                 ngDialog.close();
                 $scope.reloadData();
            }
            else 
            {
                if(vm.share.share_type == "groupwise")
                    vm.shareForm.buyer_segmentation.$dirty = true;
                else
                    vm.shareForm.buyer_list.$dirty = true;
                
                if(vm.share.item_type == "catalog")
                    vm.shareForm.catalog.$dirty = true;
                else
                    vm.shareForm.selection.$dirty = true;
                
                vm.shareForm.message.$dirty = true;
                vm.shareForm.catalog.$dirty = true;
             //   vm.shareForm.push_downstream.$dirty = true;
             //   vm.shareForm.sms.$dirty = true;
                vm.shareForm.dispatch_date.$dirty = true; 
            }
            
        };
    }
})();
