(function() {
    'use strict';

    angular
        .module('app.companies')
        .controller('SalesOrderController', SalesOrderController);

    SalesOrderController.$inject = ['$resource', 'toaster', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', '$filter', '$stateParams'];
    function SalesOrderController($resource, toaster, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, $filter, $stateParams) {
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
        
        function imageHtml(data, type, full, meta){
          return '<a ng-click="OpenProductsImages('+full[0]+')"><img class="loading" src="'+full[1]+'" style="width: 100px; height: 100px"/></a>';
        }
        
        function TitleLink(data, type, full, meta){
          return '<a href="#/app/order-detail/?type=salesorders&id='+full[0]+'&name='+full[1]+'">'+full[1]+'</a>';
        }
        
        function BuyerDetail(data, type, full, meta){
          return '<div class="col-md-6"><a ng-click="OpenBuyer('+full[0]+')">'+full[3]+'</a></div>';
        }
        
        vm.dtOptions = DTOptionsBuilder.newOptions()
                      .withOption('ajax', {
                          url: 'api/salesorderdatatables1/?user='+$stateParams.id,
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
                        2 : { "type" : "dateRange"},
                        3 : { "type" : "text"},
                        //4 : { "type" : "text"},
                        //5 : { "type" : "numberRange"},
                        6 : { "type" : "select", values:[{"value":"Draft","label":"Draft"}, {"value":"Placed","label":"Placed"}, {"value":"Paid","label":"Paid"}, {"value":"Payment Confirmed","label":"Payment Confirmed"}, {"value":"Cancelled","label":"Cancelled"}]},
                        7 : { "type" : "select", values:[{"value":"Pending","label":"Pending"}, {"value":"Accepted","label":"Accepted"}, {"value":"Dispatched","label":"Dispatched"}, {"value":"Partially Dispatched","label":"Partially Dispatched"}, {"value":"Delivered","label":"Delivered"}, {"value":"Cancelled","label":"Cancelled"}, {"value":"Transferred","label":"Transferred"}]},
                        //8 : { "width" : "10px"},
                      })
                      
                      .withOption('processing', true)
                      .withOption('serverSide', true)
                      .withOption('iDisplayLength', 10)
                      //.withOption('responsive', true)
                      .withOption('scrollX', true)
                      .withOption('scrollY', getDataTableHeight())
                      .withOption('scrollCollapse', true)
                      .withOption('aaSorting', [7, 'asc']) //Sort by ID Desc
                      
                      .withPaginationType('full_numbers')
                      
                      .withButtons(['print']);
                      /*.withButtons([
                          {
                            text: 'Delete',
                            key: '1',
                            className: 'red',
                            action: function (e, dt, node, config) {
                            
                                vm.DeleteProduct();
                            }
                          },
                          'print',
                          
                      ]);*/
                          
                      vm.dtColumnDefs = [
                        DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable()
                            .renderWith(function(data, type, full, meta) {
                                vm.selected[full[0]] = false;
                                return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
                            }),
                      
                        DTColumnDefBuilder.newColumnDef(1).withTitle('Order No.').renderWith(TitleLink),
                        DTColumnDefBuilder.newColumnDef(2).withTitle('Date & Time'),//.renderWith(filterDate),
                        //DTColumnDefBuilder.newColumnDef(2).notVisible(),
                        DTColumnDefBuilder.newColumnDef(3).withTitle('Buyer'),//.renderWith(BuyerDetail),
                        DTColumnDefBuilder.newColumnDef(4).withTitle('No. of Items').notSortable(),
                        DTColumnDefBuilder.newColumnDef(5).withTitle('Total (Rs.)').notSortable(),
                        DTColumnDefBuilder.newColumnDef(6).withTitle('Order Status'),
                        DTColumnDefBuilder.newColumnDef(7).withTitle('Processing Status'),
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
