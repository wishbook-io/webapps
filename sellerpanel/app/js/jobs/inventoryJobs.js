(function() {
    'use strict';

    angular
        .module('app.inventoryjobs')
        .controller('inventoryJobsController', inventoryJobsController);

    inventoryJobsController.$inject = ['$resource', '$http', 'ngDialog', 'Company', 'CompanyAccount', 'toaster', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state'];
    function inventoryJobsController($resource, $http, ngDialog, Company, CompanyAccount, toaster, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state) {
        CheckAuthenticated.check();
        
        var vm = this;
        
        
        vm.selected = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.count = 1;
        vm.dtInstance = {};

        
        $scope.company_id = localStorage.getItem('company');
        
        $scope.reloadData = function () {
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
        $scope.downloadLiveSKUs = function () {
            window.open(window.location.origin+'/api/v2/companies/' + $scope.company_id+'/get-pending-item-csv/');
        }
        $scope.downloadSampleFile = function () {
            window.open(window.location.origin+'/app/csv/Bulk_Inventory_Update_Sample_CSV.csv');
        }
        function UploadFileLink(data, type, full, meta){
    			if(full[3] != null)
    				return '<a target="_blank" href="'+full[3]+'">'+full[3]+'</a>';
    			else
    				return '';
        }
        
        function ErrorFileLink(data, type, full, meta){
    			if(full[3] != null)
    				return '<a target="_blank" href="'+full[3]+'">Open</a>';
    			else
    				return '';
        }
        
        vm.dtOptions = DTOptionsBuilder.newOptions()
                        .withOption('ajax', {
                            url: 'api/inventory-jobs-datatables/',
                            type: 'GET',
                        })
                        .withDOM('rtipl')
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
                            0 : { "type" : "dateRange", width: '100%'},
                            1 : { "type" : "text"},
                            4 : { "type" : "text"},
                           // 5 : { "type" : "text"},
                            6 : { "type" : "text"},
                            7 : { "type" : "text"},
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
                                text: 'Inventory',
                                key: '1',
                                className: 'tableHeading',
                            },
							                     
                            // 'copy',
                            // 'print',
                            // 'excel',
                            
                            {
                                text: 'Bulk Inventory update',
                                key: '1',
                                className: 'buttonPrimary',
                                action: function (e, dt, node, config) {

                                    ngDialog.openConfirm({
                                        template: 'uploadInventoryCsv',
                                        scope: $scope,
                                        className: 'ngdialog-theme-default',
                                        closeByDocument: false
                                    });

                                }
                            },
                            {
                                text: 'Sample file',
                                key: '1',
                                className: 'buttonSecondary',
                                action: function (e, dt, node, config) {
                                  $scope.downloadSampleFile();
                                }
                            },
                            {
                                text: 'Download live SKUs',
                                key: '1',
                                className: 'buttonSecondary',
                                action: function (e, dt, node, config) {
                                  $scope.downloadLiveSKUs();
                                }
                            },
                            
                        ]);
            
        vm.dtColumnDefs = [
            /*DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable()
            .renderWith(function(data, type, full, meta) {
                vm.selected[full[0]] = false;
                return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
            }),*/
            DTColumnDefBuilder.newColumnDef(0).withTitle('DateTime'),
            DTColumnDefBuilder.newColumnDef(1).withTitle('SKU Uploaded'),
            DTColumnDefBuilder.newColumnDef(2).withTitle('Status'),
            DTColumnDefBuilder.newColumnDef(3).withTitle('Uploaded Files').renderWith(UploadFileLink).notSortable()
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
