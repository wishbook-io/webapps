(function() {
    'use strict';

    angular
        .module('app.salesordersinvoice')
        .controller('salesOrdersInvoiceController', salesOrdersInvoiceController);

    salesOrdersInvoiceController.$inject = ['$http','$resource', '$filter', '$scope', 'Warehouse', 'SalesOrders', 'OrderInvoice', 'MultiOrder', 'Company', 'Buyers', 'Catalog', 'Product', 'ngDialog', 'toaster', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', '$state', 'CheckAuthenticated', '$cookies', '$localStorage', 'Upload'];
    //salesOrdersInvoiceController.$inject = ['$resource', 'AppInstance', 'Skumap', 'Product', 'ngDialog', 'toaster', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', 'Upload'];
    //function salesOrdersInvoiceController($resource, AppInstance, Skumap, Product, ngDialog, toaster, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, Upload) {
    function salesOrdersInvoiceController($http, $resource, $filter,  $scope, Warehouse, SalesOrders, OrderInvoice, MultiOrder, Company, Buyers, Catalog, Product, ngDialog, toaster, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $state, CheckAuthenticated, $cookies, $localStorage, Upload) {
        CheckAuthenticated.check();
        
        var vm = this;
        
        $scope.company_id = 0;
        if(localStorage.hasOwnProperty("company")){
            $scope.company_id = localStorage.getItem('company');
        }
        $scope.is_staff = localStorage.hasOwnProperty("is_staff");
        
        console.log($scope.company_id);
        console.log($scope.is_staff);
        
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
        
        $scope.order = {};
        
        $scope.OpenTrackingDetails = function () {
            ngDialog.open({
                template: 'trackingdetails',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        $scope.warehouses = Warehouse.query();
        $scope.OpenDispatch = function(orderId){
            $scope.order.id = orderId;
            
            if($scope.is_staff){
                $scope.warehouses = Warehouse.query({"supplier":vm.selectedFullJson[orderId][11]['selling_company_id']});
            }
            
            $scope.OpenTrackingDetails();
            
            //console.log($scope.warehouses.length);
            //console.log($scope.warehouses[0].id);
            if($scope.warehouses.length == 1){
                $scope.order.warehouse = $scope.warehouses[0].id;
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

        $scope.order.dispatch_date = new Date();
        
        vm.SaveDispatch = function(){
            var dis_date = $scope.formatDate($scope.order.dispatch_date);
          //  alert($scope.order.dispatch_date);
            if(vm.saveDispatchForm.$valid) {
                $(".modelform3").addClass(progressLoader()); 
                OrderInvoice.save({"id":$scope.order.id, "processing_status": "Dispatched", "mode":$scope.order.mode, "tracking_number":$scope.order.tracking_number, "tracking_details": $scope.order.tracking_details, "dispatch_date": dis_date, "cid":$scope.company_id , "sub_resource":"dispatched", "transporter_courier":$scope.order.transporter_courier, "warehouse": $scope.order.warehouse},
                function(success){
                        $(".modelform3").removeClass(progressLoader());
                        ngDialog.close();
                        vm.successtoaster = {
                            type:  'success',
                            title: 'Success',
                            text:  'Order dispatched successfully.'
                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                        reloadData();
                        $scope.order = {};
                  })
            }
            else
            {
                vm.saveDispatchForm.dispatch_date.$dirty = true; 
                vm.saveDispatchForm.warehouse.$dirty = true; 
                /*vm.saveDispatchForm.tracking_details.$dirty = true;
                vm.saveDispatchForm.mode.$dirty = true;
                vm.saveDispatchForm.tracking_number.$dirty = true;
                vm.saveDispatchForm.transporter_courier.$dirty = true;*/

            }
        }
        
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
        
        $scope.OpenCancel = function(orderId){
            $(".modelform3").addClass(progressLoader()); 
            OrderInvoice.patch({"id":orderId, "cid":$scope.company_id, "status":"Cancelled"},
            function(success){
                    $(".modelform3").removeClass(progressLoader());
                    ngDialog.close();
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Invoice cancelled successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    reloadData();
                    $scope.order = {};
              })
        }
        
        
        $scope.uploadFiles = function (files) {
            $scope.file = files;
            console.log($scope.file);
        };
        
        vm.OpenUploadInvoiceCsv = function() {
            ngDialog.open({
                template: 'uploadinvoicecsv',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        
        vm.UploadInvoiceCsv = function() {
            if(vm.uploadcsv.$valid) {
                $(".modelform3").addClass(progressLoader());
              //  console.log($scope.file);
                Upload.upload({
                            url: 'api/v1/importcsvinvoice/',
                            headers: {
                              'optional-header': 'header-value'
                            },
                            data: {"invoice_csv":$scope.file}
                      }).then(function (response) {
                                /*var uri = 'data:application/csv;charset=UTF-8,' + encodeURIComponent(response.data);
                                window.open(uri, 'buyer_error.csv');*/
                                var headers = response.headers();
                                //alert(headers['content-type']);
                                
                                
                                if(headers['content-type'] == "text/csv"){
                                    var hiddenElement = document.createElement('a');

                                    hiddenElement.href = 'data:attachment/csv,' + encodeURI(response.data);
                                    hiddenElement.target = '_blank';
                                    hiddenElement.download = 'invoice_error.csv';
                                    hiddenElement.click();
                                    
                                    vm.successtoaster = {
                                        type:  'warning',
                                        title: 'Warning',
                                        text:  'File uploaded successfully and please fix issues found on invoice_error.csv and reupload'
                                    };
                                }
                                else{
                                    vm.successtoaster = {
                                        type:  'success',
                                        title: 'Success',
                                        text:  'Orders have been created successfully.'
                                    };
                                }
                                
                                $(".modelform3").removeClass(progressLoader());
                                ngDialog.close();
                                
                                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                                reloadData();
                        });
            }
            else
            {
                vm.uploadcsv.buyer_csv.$dirty = true;
            }
        };
        
        
        
        vm.OpenUploadShipmentCsv = function() {
            ngDialog.open({
                template: 'uploadshipmentcsv',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        
        vm.UploadShipmentCsv = function() {
            if(vm.uploadcsv.$valid) {
                $(".modelform3").addClass(progressLoader());
              //  console.log($scope.file);
                Upload.upload({
                            url: 'api/v1/importcsvshipmentdispatch/',
                            headers: {
                              'optional-header': 'header-value'
                            },
                            data: {"shipment_csv":$scope.file}
                      }).then(function (response) {
                                /*var uri = 'data:application/csv;charset=UTF-8,' + encodeURIComponent(response.data);
                                window.open(uri, 'buyer_error.csv');*/
                                var headers = response.headers();
                                //alert(headers['content-type']);
                                
                                
                                if(headers['content-type'] == "text/csv"){
                                    var hiddenElement = document.createElement('a');

                                    hiddenElement.href = 'data:attachment/csv,' + encodeURI(response.data);
                                    hiddenElement.target = '_blank';
                                    hiddenElement.download = 'shipment_error.csv';
                                    hiddenElement.click();
                                    
                                    vm.successtoaster = {
                                        type:  'warning',
                                        title: 'Warning',
                                        text:  'File uploaded successfully and please fix issues found on shipment_error.csv and reupload'
                                    };
                                }
                                else{
                                    vm.successtoaster = {
                                        type:  'success',
                                        title: 'Success',
                                        text:  'Orders have been created successfully.'
                                    };
                                }
                                
                                $(".modelform3").removeClass(progressLoader());
                                ngDialog.close();
                                
                                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                                reloadData();
                        });
            }
            else
            {
                vm.uploadcsv.buyer_csv.$dirty = true;
            }
        };
        
        
        vm.OpenUploadTrackingNumberCsv = function() {
            ngDialog.open({
                template: 'uploadtrackingnumbercsv',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        
        vm.UploadTrackingNumberCsv = function() {
            if(vm.uploadcsv.$valid) {
                $(".modelform3").addClass(progressLoader());
              //  console.log($scope.file);
                Upload.upload({
                            url: 'api/v1/importcsvtrackingnumbertodelivered/',
                            headers: {
                              'optional-header': 'header-value'
                            },
                            data: {"shipment_csv":$scope.file}
                      }).then(function (response) {
                                /*var uri = 'data:application/csv;charset=UTF-8,' + encodeURIComponent(response.data);
                                window.open(uri, 'buyer_error.csv');*/
                                var headers = response.headers();
                                //alert(headers['content-type']);
                                
                                
                                if(headers['content-type'] == "text/csv"){
                                    var hiddenElement = document.createElement('a');

                                    hiddenElement.href = 'data:attachment/csv,' + encodeURI(response.data);
                                    hiddenElement.target = '_blank';
                                    hiddenElement.download = 'tracking_number_delivered_error.csv';
                                    hiddenElement.click();
                                    
                                    vm.successtoaster = {
                                        type:  'warning',
                                        title: 'Warning',
                                        text:  'File uploaded successfully and please fix issues found on shipment_error.csv and reupload'
                                    };
                                }
                                else{
                                    vm.successtoaster = {
                                        type:  'success',
                                        title: 'Success',
                                        text:  'Orders have been created successfully.'
                                    };
                                }
                                
                                $(".modelform3").removeClass(progressLoader());
                                ngDialog.close();
                                
                                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                                reloadData();
                        });
            }
            else
            {
                vm.uploadcsv.buyer_csv.$dirty = true;
            }
        };
        
        
        vm.selected = {};
        vm.selectedFullJson = {};
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
                            url: 'api/salesorderinvoicedatatables/',
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
                            2 : { "type" : "text"},
                            3 : { "type" : "dateRange", width: '100%'},
                            4 : { "type" : "text"},
                            5 : { "type" : "text"},
                            6 : { "type" : "text"},
                            7 : { "type" : "text"},
                            8 : { "type" : "text"},
                            9 : { "type" : "select", values:[{"value":"Pending","label":"Pending"}, {"value":"Paid","label":"Paid"}]},
                            10 : { "type" : "select", values:[{"value":"Invoiced","label":"Invoiced"}, {"value":"Dispatched","label":"Dispatched"}, {"value":"Delivered","label":"Delivered"}, {"value":"Cancelled", "label":"Cancelled"}]},
                            11 : { "type" : "select", values:[{"value":"1","label":"true"}, {"value":"0","label":"false"}]},
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
                            /*{
                                text: 'Print Invoice',
                                key: '1',
                                className: 'orange',
                                action: function (e, dt, node, config) {
                                    vm.OpenPrintInvoice();
                                }
                            },*/
                            {
                                text: 'Upload Invoice',
                                key: '1',
                                className: 'blue',
                                action: function (e, dt, node, config) {
                                    
                                    vm.OpenUploadInvoiceCsv();
                                }
                            },
                            {
                                text: 'Upload Shipment',
                                key: '1',
                                className: 'blue',
                                action: function (e, dt, node, config) {
                                    
                                    vm.OpenUploadShipmentCsv();
                                }
                            },
                            {
                                text: 'Upload Tracking Number to Delivered',
                                key: '1',
                                className: 'blue',
                                action: function (e, dt, node, config) {
                                    
                                    vm.OpenUploadTrackingNumberCsv();
                                }
                            },
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
                vm.selectedFullJson[full[0]] = full;
                return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
            }),
            DTColumnDefBuilder.newColumnDef(1).withTitle('JSON').notVisible(),
            DTColumnDefBuilder.newColumnDef(2).withTitle('Order Number'),
            DTColumnDefBuilder.newColumnDef(3).withTitle('Date'),
            DTColumnDefBuilder.newColumnDef(4).withTitle('Buyer'),
            DTColumnDefBuilder.newColumnDef(5).withTitle('Total Qty'),
            DTColumnDefBuilder.newColumnDef(6).withTitle('Amount'),
            //DTColumnDefBuilder.newColumnDef(6).withTitle('Paid Amount'),
            //DTColumnDefBuilder.newColumnDef(7).withTitle('Pending Amount'),
            DTColumnDefBuilder.newColumnDef(7).withTitle('Tax'),
            DTColumnDefBuilder.newColumnDef(8).withTitle('Total Amount'),
            DTColumnDefBuilder.newColumnDef(9).withTitle('Payment Status'),
            DTColumnDefBuilder.newColumnDef(10).withTitle('Status'),
            DTColumnDefBuilder.newColumnDef(11).withTitle('Reseller Order'),
            //DTColumnDefBuilder.newColumnDef(10).withTitle('Order Status'),
            //DTColumnDefBuilder.newColumnDef(11).withTitle('Processing Status'),
            DTColumnDefBuilder.newColumnDef(12).withTitle('Action').notSortable()
            .renderWith(function(data, type, full, meta) {
                
                var htmlbutton = ''
                
                if(full[10] != 'Dispatched' && full[10] != 'Cancelled' && full[10] != 'Delivered')
                    htmlbutton += '<div><button type="button" ng-click="OpenDispatch('+full[0]+')" class="btn btn-block btn-primary mt-lg orange-button">Dispatch</button></div>'
                
                if(full[10] == 'Dispatched' || full[10] == 'Delivered')
                    htmlbutton += '<div><button type="button" ng-click="OpenShipment('+full[0]+')" class="btn btn-block btn-primary mt-lg">Shipment</button></div>'
                /* if(full[11] == true && full[9].indexOf('Pending') < 0)
                {
                  htmlbutton += '<div><a target="_blank" class="btn btn-primary mt-lg" href="/#/pages/printresellerinvoice/?invoice='+full[0]+'">Print Shipping Invoice</a></div>'
                } */
                // commented below button for: WB-2787
                //if(full[9] == 'Invoiced' )
                    //htmlbutton += '<div><button type="button" ng-click="OpenCancel('+full[0]+')" class="btn btn-block btn-danger mt-lg">Cancel</button></div>'
                
                  htmlbutton += '<div><a target="_blank" class="btn btn-primary mt-lg" href="/#/pages/printinvoice/?invoice='+full[0]+'">Print Shipping Invoice</a></div>'
                
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
