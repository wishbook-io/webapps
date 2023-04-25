(function() {
    'use strict';

    angular
        .module('app.companies')
        .controller('MeetingDetailController', MeetingDetailController);

    MeetingDetailController.$inject = ['$resource', 'toaster', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', '$filter', '$stateParams'];
    function MeetingDetailController($resource, toaster, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, $filter, $stateParams) {
        CheckAuthenticated.check();        
        /*$.ajaxSetup({
            headers : {
              'Authorization' : 'Bearer '+$auth.getToken()
            }
        });*/
        var vm = this;
    
        vm.selected = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.count = 1;
        vm.dtInstance = {};

        UpdateCheckBoxUI();
        
        var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';
        
        function reloadData() {
            var resetPaging = false;
            vm.dtInstance.reloadData(callback, resetPaging);

            UpdateCheckBoxUI();
        }

        function callback(json) {
            console.log(json);
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
        

        vm.dtOptions = DTOptionsBuilder.newOptions()
                    .withOption('ajax', {
                        url: 'api/buyermeetingdatatables/?buying_company='+$stateParams.id,
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
                        //2 : { "type" : "text"},
                        2 : { "type" : "dateRange", width: '100%'},
                        //4 : { "type" : "text"}
                    })
                    .withOption('processing', true)
                    .withOption('serverSide', true)
                    //.withOption('stateLoadParams', false)
                    //.withOption('stateSaveParams', false)
                    .withOption('stateSave', true)
                    .withOption('stateSaveCallback', function(settings, data) {
                        //console.log(settings.json.data);
                        //console.log("stateSaveCallback");
                        
                        data = datatablesStateSaveCallback(data);
                        localStorage.setItem('DataTables_' + settings.sInstance, JSON.stringify(data));
                    })
                    
                    .withButtons([
                        'copy',
                        'print',
                        'excel'
                        
                    ])
                    
                    .withOption('processing', true)
                    .withOption('serverSide', true)
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
            DTColumnDefBuilder.newColumnDef(1).withTitle('Salesman'),
            DTColumnDefBuilder.newColumnDef(2).withTitle('Date & Time'),
            DTColumnDefBuilder.newColumnDef(3).withTitle('Duration'),
            DTColumnDefBuilder.newColumnDef(4).withTitle('No of Orders').notSortable(),
            DTColumnDefBuilder.newColumnDef(5).withTitle('Notes'),
           
          
       
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

        $(document).ready(function () {
            setTimeout(function () {
                var paginationbuttons = document.getElementsByClassName('paging_full_numbers')
                var i = paginationbuttons.length;
                while (i--) {
                    paginationbuttons[i].addEventListener("click", function () {
                        UpdateCheckBoxUI();
                    });
                }
                var tableheaders = document.getElementsByTagName('th');
                var j = tableheaders.length;
                while (j--) {
                    tableheaders[j].addEventListener("click", function () {
                        UpdateCheckBoxUI();
                    });
                    tableheaders[j].addEventListener("keydown", function () {
                        UpdateCheckBoxUI();
                    });
                }
                console.log('UpdateCheckBoxUI() attached')

            }, 3000);
        });
        
    }
})();
