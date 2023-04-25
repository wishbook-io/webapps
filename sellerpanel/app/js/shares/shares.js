(function() {
    'use strict';

    angular
        .module('app.shares')
        .controller('ShareslistController', ShareslistController);

    ShareslistController.$inject = ['$resource', '$filter', '$scope','Shares', 'BuyerSegmentation', 'BuyerList', 'Catalog', 'Selection', 'ngDialog', 'toaster', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', '$state', 'CheckAuthenticated', '$cookies', '$localStorage'];
    function ShareslistController($resource, $filter,  $scope, Shares, BuyerSegmentation, BuyerList, Catalog, Selection, ngDialog, toaster, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $state, CheckAuthenticated, $cookies, $localStorage) {
       
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
        
        
        $scope.company_id = localStorage.getItem('company');// $cookies.get('company');

        vm.OpenDialog = function () {
            ngDialog.open({
                template: 'share',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        
        vm.CloseDialog = function() {
            ngDialog.close();
        };
        vm.OpenShare = function (){
            
       /*     vm.buyer_segments = BuyerSegmentation.query({cid:$scope.company_id, id:"dropdown"});
            vm.buyer_lists = BuyerList.query({"status":"approved", "cid":$scope.company_id});
            vm.catalogs = Catalog.query({cid:$scope.company_id, id:"dropdown"});
            vm.selections = Selection.query({id:"dropdown"});
            vm.share.push_downstream = "yes";
            vm.share.sms = "yes";
            vm.share.share_type = "groupwise";
            vm.share.item_type = "catalog";
           // $scope.change_price_type = 'price';
            $scope.priceinpercentageflag = false;
            $scope.priceinfixflag = false; */
            vm.OpenDialog();
        }
   /*     vm.CheckFullCatalogFlag = function(catalogId) {
            Catalog.get({id: catalogId, cid:$scope.company_id}).$promise.then(
                function(success){
                  vm.share.full_catalog_orders_only = success.full_catalog_orders_only;
                  
                  if(success.exp_desp_date != null){
                    vm.share.dispatch_date = new Date(success.exp_desp_date);
                  }
                }
            );
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

        vm.share = {};
        
        vm.ChangePricetype = function(priceType) {
            if(priceType == 'percentage')
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
            }
            
        }  */
        
        $scope.formatDate = function (date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        }
        
     /*   vm.share.dispatch_date = new Date();
        
        
        vm.DoShare= function () {
            
            if(vm.shareForm.$valid) {
                var exp_desp_date = $scope.formatDate(vm.share.dispatch_date);
                //vm.share.selection = [];
                vm.share.catalog = [vm.share.catalog];
                vm.share.selection = [vm.share.selection];
             
                if(vm.share.change_price_add == null)
                {
                    vm.params = {"message": vm.share.message, "full_catalog_orders_only": vm.share.full_catalog_orders_only,
                               "change_price_fix": vm.share.change_price_fix, "push_downstream": vm.share.push_downstream, "sms": vm.share.sms , "selection" : vm.share.selection, 'exp_desp_date':exp_desp_date} //"buyer_segmentation": vm.share.buyer_segmentation, "catalog": vm.share.catalog, 
                }
                else
                {
                    vm.params = {"message": vm.share.message, "full_catalog_orders_only": vm.share.full_catalog_orders_only,
                               "change_price_add": vm.share.change_price_add, "push_downstream": vm.share.push_downstream, "sms": vm.share.sms, "selection" : vm.share.selection, 'exp_desp_date':exp_desp_date}   //"catalog": vm.share.catalog, 
                }
                
                if(vm.share.share_type == "groupwise")
                    vm.params["buyer_segmentation"] = vm.share.buyer_segmentation;
                else
                    vm.params["single_company_push"] = vm.share.buyer_list;
                
                if(vm.share.item_type == "catalog")
                    vm.params["catalog"] = vm.share.catalog;
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
                        reloadData();
                    });
                 ngDialog.close();
                 reloadData();
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
                vm.shareForm.push_downstream.$dirty = true;
                vm.shareForm.sms.$dirty = true;
                vm.shareForm.dispatch_date.$dirty = true; 
            }
            
        };  */
        
        $scope.OpenDesignView = function () {
            ngDialog.open({
                template: 'designview',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        
        $scope.DesignView = function(id){
            $(".modelform3").addClass(progressLoader()); 
            
            Shares.get({"id":id, "sub_resource":"designwise"},
            function (success){
                $scope.pushdetail = success;
                                
                $scope.OpenDesignView();
                $(".modelform3").removeClass(progressLoader()); 
                
            });
        }
        
        $scope.OpenBuyerView = function () {
            ngDialog.open({
                template: 'buyerview',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        
        $scope.BuyerView = function(id){
            $(".modelform3").addClass(progressLoader()); 
            
            Shares.get({"id":id, "sub_resource":"buyerwise"},
            function (success){
                $scope.pushdetail = success;
                                
                $scope.OpenBuyerView();
                $(".modelform3").removeClass(progressLoader()); 
                
            });
        }
        
        
        
        vm.selected = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.count = 1;
        vm.dtInstance = {};
        
        var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';
        
        $scope.reloadData  = function () {
            var resetPaging = false;
            vm.dtInstance.reloadData(callback, resetPaging);
        }

        function callback(json) {
           // console.log(json);
            if(json.recordsTotal > 0 && json.data.length == 0){
                //vm.dtInstance.rerender();
                $state.go($state.current, {}, {reload: true});
            }
        }  
        
        function imageHtml(data, type, full, meta){
        
              return '<img src="'+full[3]+'" style="width: 100px; height: 100px"/>';
            }
        
        function filterDate (row, data, full, meta) {
          return $filter('date')(row, 'yyyy-MM-dd')+" : "+$filter('date')(row, 'h: mm a');
        }

        function CatalogTitleLink(data, type, full, meta){
            if (full[1] == '') {
                return '';
            }
            else if (full[9] == 'mycatalog') {
                return '<a href="#/app/product/?type=mycatalog&id='+full[10]+'&name='+full[1]+'">'+full[1]+'</a>';      
            }
            else if (full[9] == 'publiccatalog') {
                return '<a href="#/app/products-detail/?type=publiccatalog&id='+full[10]+'&name='+full[1]+'">'+full[1]+'</a>';
            }
            else {
                return '<a href="#/app/products-detail/?type=receivedcatalog&id='+full[10]+'&name='+full[1]+'">'+full[1]+'</a>';
            }
        }
        
        function SelectionTitleLink(data, type, full, meta){
            if (full[2] == '') {
                return '';
            }
            else if (full[9] == 'myselection') {
                 return '<a href="#/app/products-detail/?type=myselection&id='+full[10]+'&name='+full[2]+'">'+full[2]+'</a>';
            }
            else {
                return '<a href="#/app/products-detail/?type=receivedselection&id='+full[10]+'&name='+full[2]+'">'+full[2]+'</a>';
            }
        }
        
        vm.dtOptions = DTOptionsBuilder.newOptions()
                        .withOption('ajax', {
                            url: 'api/pushdatatables1/?format=json',
                            type: 'GET',
                            
                        })
                        
                        .withOption('createdRow', function(row, data, dataIndex) {
                            // Recompiling so we can bind Angular directive to the DT
                            $compile(angular.element(row).contents())($scope);
                        })
                        .withOption('headerCallback', function(header) {
                            if (!vm.headerCompiled) {
                                // Use this headerCompiled field to only compile header once
                                vm.headerCompiled = true;
                                $compile(angular.element(header).contents())($scope);
                            }
                        })
                        .withOption('fnPreDrawCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                            vm.count = vm.count+1;
                            //alert(JSON.stringify(vm.selected));
                            if((vm.count%2) == 0)
                            {
                                vm.selected = {};
                                vm.selectAll = false;
                                //alert(JSON.stringify(vm.selected));
                            }
                            return true;
                        })
                        
                        .withDataProp('data')
                        .withLightColumnFilter({
                            1 : { "type" : "text"},
                            2 : { "type" : "text"},
                            //3 : { "type" : "text"},
                            
                            //5 : { "type" : "select", values:[{"value":"Delivered","label":"Delivered"}, {"value":"In Progress","label":"In Progress"}]},
                            4 : { "type" : "text"},
                            8 : { "type" : "dateRange", width: '100%'},
                        })
                        
  /*                      .withColumnFilter({
                            aoColumns: [{
                                type: 'number'
                            }, {
                                type: 'text',
                                bRegex: true,
                                bSmart: true
                            }, {
                                type: 'text',
                                bRegex: true,
                                bSmart: true
                            }]
                        })
*/                        
                        .withButtons([
                            {
                                text: 'New Share',
                                key: '1',
                                className: 'green',
                                action: function (e, dt, node, config) {
                                    vm.share = {};
                                    vm.share.dispatch_date = new Date();
                                    vm.share.full_catalog_orders_only = false;
                                    vm.OpenShare();
                                }
                            },
                            {
                                  text: 'Reset Filter',
                                  key: '1',
                                  className: 'green',
                                  action: function (e, dt, node, config) {
                                    localStorage.removeItem('DataTables_' + 'shares-datatables');
                                    $state.go($state.current, {}, {reload: true});
                                  }
                            },
                            'copy',
                            'print',
                            'excel'
                        ])
                        
                        .withOption('processing', true)
                        .withOption('serverSide', true)
                        
                        .withOption('stateSave', true)
                        .withOption('stateSaveCallback', function(settings, data) {
                              data = datatablesStateSaveCallback(data);
                              localStorage.setItem('DataTables_' + settings.sInstance, JSON.stringify(data));
                          })
                          .withOption('stateLoadCallback', function(settings) {
                             return JSON.parse(localStorage.getItem('DataTables_' + settings.sInstance ))
                          })
                          
                        .withOption('iDisplayLength', 10)
                        //.withOption('responsive', true)
                        .withOption('scrollX', true)
                        .withOption('scrollY', getDataTableHeight())
                        //.withOption('scrollCollapse', true)
                        .withOption('aaSorting', [0, 'desc']) //Sort by ID Desc
                        
                        .withPaginationType('full_numbers');

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable()
                .renderWith(function(data, type, full, meta) {
                    vm.selected[full[0]] = false;
                    return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
                }).notVisible(), 
            DTColumnDefBuilder.newColumnDef(1).withTitle('Catalog').renderWith(CatalogTitleLink).notSortable(),
            DTColumnDefBuilder.newColumnDef(2).withTitle('Selection').renderWith(SelectionTitleLink).notSortable().notVisible(),
            DTColumnDefBuilder.newColumnDef(3).withTitle('Total Designs').notSortable(),
            DTColumnDefBuilder.newColumnDef(4).withTitle('Shared With'),
            DTColumnDefBuilder.newColumnDef(5).withTitle('Total Shares').notSortable(),
            DTColumnDefBuilder.newColumnDef(6).withTitle('Catalog Views').notSortable(),
            DTColumnDefBuilder.newColumnDef(7).withTitle('Product Views').notSortable(),
            DTColumnDefBuilder.newColumnDef(8).withTitle('Date & Time'),//.renderWith(filterDate),
            //DTColumnDefBuilder.newColumnDef(5).withTitle('Status'),
            DTColumnDefBuilder.newColumnDef(9).withTitle('Action').notSortable()
                .renderWith(function(data, type, full, meta) {
                    return '<div><a class="btn btn-default mt-lg" href="#/app/share-design-view/?id='+full[0]+'">Design View</a></div><div><a class="btn btn-primary mt-lg" href="#/app/share-detail/?id='+full[0]+'">Buyer View</a></div>';
                    //<div><button type="button" ng-click="DesignView('+full[0]+')" class="btn">Design View</button></div><div><button type="button" ng-click="BuyerView('+full[0]+')" class="btn btn-primary mt-lg">Buyer View</button></div>';     
                }),
        ];
        
        function toggleAll (selectAll, selectedItems) {
            for (var id in selectedItems) {
                if (selectedItems.hasOwnProperty(id)) {
                    selectedItems[id] = selectAll;
                }
            }
        }
        
        function toggleOne (selectedItems) {
            for (var id in selectedItems) {
                if (selectedItems.hasOwnProperty(id)) {
                    if(!selectedItems[id]) {
                        vm.selectAll = false;
                        return;
                    }
                }
            }
            vm.selectAll = true;
        }
        

       
    }
})();
