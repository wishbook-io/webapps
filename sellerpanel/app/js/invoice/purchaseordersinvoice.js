(function() {
    'use strict';

    angular
        .module('app.purchaseordersinvoice')
        .controller('purchaseOrdersInvoiceController', purchaseOrdersInvoiceController);

    purchaseOrdersInvoiceController.$inject = ['$http','$resource', '$filter', '$scope', 'Warehouse', 'SalesOrders', 'PurchaseOrders', 'OrderInvoice', 'MultiOrder', 'Company', 'Buyers', 'Catalog', 'Product', 'ngDialog', 'toaster', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', '$state', 'CheckAuthenticated', '$cookies', '$localStorage', 'Upload'];
    //salesOrdersInvoiceController.$inject = ['$resource', 'AppInstance', 'Skumap', 'Product', 'ngDialog', 'toaster', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', 'Upload'];
    //function salesOrdersInvoiceController($resource, AppInstance, Skumap, Product, ngDialog, toaster, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, Upload) {
    function purchaseOrdersInvoiceController($http, $resource, $filter,  $scope, Warehouse, SalesOrders, PurchaseOrders, OrderInvoice, MultiOrder, Company, Buyers, Catalog, Product, ngDialog, toaster, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $state, CheckAuthenticated, $cookies, $localStorage, Upload) {
        CheckAuthenticated.check();
        
        var vm = this;
        
        $scope.company_id = localStorage.getItem('company');
        
        vm.CloseDialog = function() {
            ngDialog.close();
        };
                
        $scope.OpenShipmentDetail = function () {
            ngDialog.open({
                template: 'shipmentdetails',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        
        $scope.OpenShipment = function(orderId){
            $(".modelform6").addClass(progressLoader()); 
            Company.query({"sub_resource":"shipments", "id":$scope.company_id, "invoice":orderId},
            function (success){
                $scope.shipment = success[0]
                $scope.shipment.datetime = formatDate($scope.shipment.datetime);
                $scope.OpenShipmentDetail();
                $(".modelform6").removeClass(progressLoader());
                
            });
        }
        
         $scope.OpenRecievedDetails = function () {
            ngDialog.open({
                template: 'recieveddetails',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        $scope.warehouses = Warehouse.query();
        $scope.openReceived = function(id){
            $scope.order_id = id;
            console.log($scope.warehouses);
            if($scope.warehouses.length == 1){
                vm.warehouse = $scope.warehouses[0].id;
                
                PurchaseOrders.patch({"id": $scope.order_id, "processing_status": "Delivered", "cid":$scope.company_id, "warehouse": vm.warehouse },
                function(success){
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Shipment is Delivered'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    reloadData();
                    vm.CloseDialog();
                });
            }
            else{
                $scope.OpenRecievedDetails();
            }
        }

        vm.SaveRecievedDetails = function(){
            if(vm.saveRecievedForm.$valid) {
                PurchaseOrders.patch({"id": $scope.order_id, "processing_status": "Delivered", "cid":$scope.company_id, "warehouse": vm.warehouse },
                function(success){
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Shipment is Delivered'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    reloadData();
                    vm.CloseDialog();
                });
            }
            else{
                vm.saveRecievedForm.warehouse.$dirty = true;
            }
        }
      /*  $scope.Delivered = function(id){
            OrderInvoice.patch({"id": id, "status": "Delivered", "cid":$scope.company_id},
            function(success){
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Shipment is Delivered'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    reloadData();
              });
        }*/
        
        vm.selected = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.count = 1;
        vm.dtInstance = {};

        $scope.update_flag = false;
        
        var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';
        
        function reloadData() {
            var resetPaging = false;
            vm.dtInstance.reloadData(callback, resetPaging);
        }

        function callback(json) {
            console.log(json);
            if(json.recordsTotal > 0 && json.data.length == 0){
                //vm.dtInstance.rerender();
                $state.go($state.current, {}, {reload: true});
            }
        }
        
        vm.dtOptions = DTOptionsBuilder.newOptions()
                        .withOption('ajax', {
                            url: 'api/purchaseorderinvoicedatatables/',
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
                            2 : { "type" : "dateRange", width: '100%'},
                            3 : { "type" : "text"},
                            4 : { "type" : "text"},
                            5 : { "type" : "text"},
                            6 : { "type" : "text"},
                            7 : { "type" : "text"},
                            8 : { "type" : "select", values:[{"value":"Pending","label":"Pending"}, {"value":"Paid","label":"Paid"}]},
                            9 : { "type" : "select", values:[{"value":"Invoiced","label":"Invoiced"}, {"value":"Dispatched","label":"Dispatched"}, {"value":"Delivered","label":"Delivered"}, {"value":"Cancelled", "label":"Cancelled"}]},
                            //10 : { "type" : "select", values:[{"value":"Draft","label":"Draft"}, {"value":"Placed","label":"Placed"}, {"value":"Paid","label":"Paid"}, {"value":"Payment Confirmed","label":"Payment Confirmed"}, {"value":"Cancelled","label":"Cancelled"}]},
                            //11 : { "type" : "select", values:[{"value":"Pending","label":"Pending"}, {"value":"Accepted","label":"Accepted"}, {"value":"Dispatched","label":"Dispatched"}, {"value":"Partially Dispatched","label":"Partially Dispatched"}, {"value":"Delivered","label":"Delivered"}, {"value":"Cancelled","label":"Cancelled"}]},
                            
                        })
                        
                        .withOption('processing', true)
                        .withOption('serverSide', true)
                        .withOption('iDisplayLength', 10)
                        //.withOption('responsive', true)
                        .withOption('scrollX', true)
                        .withOption('scrollY', getDataTableHeight())
                        //.withOption('scrollCollapse', true)
                        .withOption('aaSorting', [0, 'desc']) //Sort by ID Desc
                        
                        .withPaginationType('full_numbers')
                        
                        .withButtons([
                            {
                                  text: 'Reset Filter',
                                  key: '1',
                                  className: 'green',
                                  action: function (e, dt, node, config) {
                                    //localStorage.removeItem('DataTables_' + 'products-datatables');
                                    $state.go($state.current, {}, {reload: true});
                                  }
                            },
                            'copy',
                            'print',
                            'excel',
                            
                        ]);
            
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable()
            .renderWith(function(data, type, full, meta) {
                vm.selected[full[0]] = false;
                return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
            }),
            DTColumnDefBuilder.newColumnDef(1).withTitle('Order Number'),
            DTColumnDefBuilder.newColumnDef(2).withTitle('Date'),
            DTColumnDefBuilder.newColumnDef(3).withTitle('Supplier'),
            DTColumnDefBuilder.newColumnDef(4).withTitle('Total Qty'),
            DTColumnDefBuilder.newColumnDef(5).withTitle('Amount'),
            //DTColumnDefBuilder.newColumnDef(6).withTitle('Paid Amount'),
            //DTColumnDefBuilder.newColumnDef(7).withTitle('Pending Amount'),
            DTColumnDefBuilder.newColumnDef(6).withTitle('Tax'),
            DTColumnDefBuilder.newColumnDef(7).withTitle('Total Amount'),
            DTColumnDefBuilder.newColumnDef(8).withTitle('Payment Status'),
            DTColumnDefBuilder.newColumnDef(9).withTitle('Status'),
            //DTColumnDefBuilder.newColumnDef(10).withTitle('Order Status'),
            //DTColumnDefBuilder.newColumnDef(11).withTitle('Processing Status'),
            DTColumnDefBuilder.newColumnDef(10).withTitle('Action').notSortable()
            .renderWith(function(data, type, full, meta) {
                
                var htmlbutton = ''
                
                if(full[9] == 'Dispatched')
                    htmlbutton += '<div><button type="button" ng-click="openReceived('+full[11]['order_id']+')" class="btn btn-block btn-primary mt-lg">Received</button></div>'
                    //htmlbutton += '<div><button type="button" ng-click="Delivered('+full[0]+')" class="btn btn-block btn-primary mt-lg">Received</button></div>'
                    //htmlbutton += '<div><button type="button" ng-click="OpenShipment('+full[0]+')" class="btn btn-block btn-primary mt-lg">Shipment</button></div>'
                
                htmlbutton += '<div><a target="_blank" class="btn btn-primary mt-lg" href="/#/pages/printinvoice/?invoice='+full[0]+'">Print Invoice</a></div>'
                
                if(htmlbutton == '')
                    return '&nbsp;';
                else
                    return htmlbutton;
            })
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
