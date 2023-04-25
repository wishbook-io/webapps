(function() {
    'use strict';

    angular
        .module('app.inventory')
        .controller('openingController', openingController);

    openingController.$inject = ['$resource', 'SyncOICSV', 'Warehouse', 'ngDialog', 'toaster', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', 'Upload'];
    function openingController($resource, SyncOICSV, Warehouse, ngDialog, toaster, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, Upload) {
        CheckAuthenticated.check();
        
        var vm = this;
		
		$scope.company_id = localStorage.getItem('company');
		$scope.update_flag = false;
		
        $scope.uploadFiles = function (files) {
            $scope.file = files;
            console.log($scope.file);
        };
        
        vm.CloseDialog = function() {
            ngDialog.close();
        };

        vm.UploadInventoryCsv = function() {
            if($scope.inventory.inventory_path == null){
                //alert("in null");
                
                
                if(vm.uploadcsv.$valid) {
                //	alert("ok");
                    $(".modelform3").addClass(progressLoader());
                    
                    Upload.upload({
                        url: $scope.upload_url, //+"?warehouse="+$scope.inventory.warehouse, //'api/v1/importcsvopeninginventory/',
                        headers: {
                          'optional-header': 'header-value'
                        },
                        data: {"inventory_csv":$scope.file}
                    }).then(function (response) {
                        /*var uri = 'data:application/csv;charset=UTF-8,' + encodeURIComponent(response.data);
                        window.open(uri, 'buyer_error.csv');*/
                        var headers = response.headers();
                        //alert(headers['content-type']);
                        
                        if(headers['content-type'] == "text/csv"){
                            /*var hiddenElement = document.createElement('a');

                            hiddenElement.href = 'data:attachment/csv,' + encodeURI(response.data);
                            hiddenElement.target = '_blank';
                            hiddenElement.download = 'inventory_error.csv';
                            hiddenElement.click();*/
                            
                            //alert(hiddenElement);
                            
                            var anchor = angular.element('<a/>');
                            anchor.css({display: 'none'}); // Make sure it's not visible
                            angular.element(document.body).append(anchor); // Attach to document

                            anchor.attr({
                            href: 'data:attachment/csv;charset=utf-8,' + encodeURI(response.data),
                            target: '_blank',
                            download: 'inventory_error.csv'
                            })[0].click();

                            anchor.remove(); // Clean it up afterwards
                            
                            vm.successtoaster = {
                                type:  'warning',
                                title: 'Warning',
                                text:  'File uploaded successfully and please fix issues found on inventory_error.csv and reupload'
                            };
                        }
                        else{
                            vm.successtoaster = {
                                type:  'success',
                                title: 'Success',
                                text:  'File uploaded successfully'
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
                    //vm.uploadcsv.warehouse.$dirty = true;
                }
            }
            else{
                $(".modelform3").addClass(progressLoader());
                
                SyncOICSV.save({"inventory_path":$scope.inventory.inventory_path},
                function(success){
                    $(".modelform3").removeClass(progressLoader());
                    
                    ngDialog.close();
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Successfully sync csv.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    
                    reloadData();
                });
            }

        };
        
        vm.CsvDialog = function () {
            ngDialog.open({
                template: 'uploadcsv',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        
        vm.OpenUploadCsv = function() {
            //$scope.warehouseList = Warehouse.query();
            vm.CsvDialog();
        };
        
        
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
        
        function UploadFileLink(data, type, full, meta){
			if(full[5] != null)
				return '<a target="_blank" href="'+full[5]+'">Open</a>';
			else
				return '';
        }
        
        vm.dtOptions = DTOptionsBuilder.newOptions()
                        .withOption('ajax', {
                            url: 'api/openingstockdatatables/',
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
                                text: 'Upload Opening Inventory',
                                key: '1',
                                className: 'blue',
                                action: function (e, dt, node, config) {
                                    $scope.file = null;
                                    $scope.inventory = {};
                                    $scope.upload_for = "opening"
                                    $scope.upload_url = 'api/v1/importcsvopeninginventory/';
                                    vm.OpenUploadCsv();
                                }
                            },
                            /*{
                                text: 'Upload Adjustment Inventory',
                                key: '1',
                                className: 'blue',
                                action: function (e, dt, node, config) {
                                    $scope.file = null;
                                    $scope.inventory = {};
                                    $scope.upload_for = "adjustment"
                                    $scope.upload_url = 'api/v1/importcsvadjustmentinventory/';
                                    //vm.OpenUploadAdjustmentCsv();
                                    vm.OpenUploadCsv();
                                }
                            },*/
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
            DTColumnDefBuilder.newColumnDef(1).withTitle('Warehouse').notVisible(),
            DTColumnDefBuilder.newColumnDef(2).withTitle('Date'),
            DTColumnDefBuilder.newColumnDef(3).withTitle('User'),
            DTColumnDefBuilder.newColumnDef(4).withTitle('Remarks'),
            DTColumnDefBuilder.newColumnDef(5).withTitle('Uploaded Files').renderWith(UploadFileLink).notSortable(),
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

