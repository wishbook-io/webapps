(function() {
    'use strict';

    angular
        .module('app.jobs')
        .controller('JobController', JobController);

    JobController.$inject = ['$resource', 'ngDialog', 'Company', 'CompanyAccount', 'toaster', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state'];
    function JobController($resource, ngDialog, Company, CompanyAccount, toaster, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state) {
        CheckAuthenticated.check();
        
        var vm = this;
        
        
        vm.selected = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.count = 1;
        vm.dtInstance = {};

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
			if(full[2] != null)
				return '<a target="_blank" href="'+full[2]+'">Open</a>';
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
                            url: 'api/jobsdatatables/',
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
                            0 : { "type" : "dateRange", width: '100%'},
                            1 : { "type" : "text"},
                            4 : { "type" : "text"},
                            5 : { "type" : "text"},
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
							
                            'copy',
                            'print',
                            'excel',
                            
                        ]);
            
        vm.dtColumnDefs = [
            /*DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable()
            .renderWith(function(data, type, full, meta) {
                vm.selected[full[0]] = false;
                return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
            }),*/
            DTColumnDefBuilder.newColumnDef(0).withTitle('Date'),
            DTColumnDefBuilder.newColumnDef(1).withTitle('Job Type'),
            DTColumnDefBuilder.newColumnDef(2).withTitle('Uploaded Files').renderWith(UploadFileLink).notSortable(),
            DTColumnDefBuilder.newColumnDef(3).withTitle('Errors Files').renderWith(ErrorFileLink).notSortable(),
            DTColumnDefBuilder.newColumnDef(4).withTitle('Status'),
            DTColumnDefBuilder.newColumnDef(5).withTitle('Total Rows'),
            DTColumnDefBuilder.newColumnDef(6).withTitle('Completed Rows'),
            DTColumnDefBuilder.newColumnDef(7).withTitle('Error Details'),
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
