(function() {
    'use strict';

    angular
        .module('app.shares')
        .controller('ShareDetailController', ShareDetailController);

    ShareDetailController.$inject = ['$resource', 'toaster', '$scope', 'Shares', 'PurchaseOrders', 'SalesOrderItems', 'BuyerList', 'OrderInvoice', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', '$filter', '$stateParams', 'SweetAlert', 'ngDialog'];
    function ShareDetailController($resource, toaster, $scope, Shares, PurchaseOrders,  SalesOrderItems, BuyerList, OrderInvoice, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, $filter, $stateParams, SweetAlert, ngDialog) {
        CheckAuthenticated.check();        
        /*$.ajaxSetup({
            headers : {
              'Authorization' : 'Bearer '+$auth.getToken()
            }
        });*/

        $scope.company_id = localStorage.getItem('company'); 
        var vm = this;
        
        var shareid = parseInt($stateParams.id);
        //console.log(shareid);
        $scope.sharedetail = {};
        $scope.catalogdropdown = [];

        Shares.get({"id": shareid, "cid": $scope.company_id, "expand":"true"},
        function (success){
            //console.log(JSON.stringify(success));
            $scope.sharedetail = success;
        });
    
        vm.selected = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.count = 1;
        vm.dtInstance = {};

        $scope.update_flag = false;
        
        $scope.alrt = function () {alert("called");};
        
        var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';
        
        /* function reloadData() {
            var resetPaging = false;
            vm.dtInstance.reloadData(callback, resetPaging);
        }  */

        $scope.reloadData = function() {
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
        
        function BuyerDetail(data, type, full, meta){
            return '<a href="#/app/buyer-detail/?id='+full[6]+'&name='+full[1]+'">'+full[1]+'</a>';
        }
        
        vm.dtOptions = DTOptionsBuilder.newOptions()
                      .withOption('ajax', {
                          url: 'api/pushbuyerdetaildatatables/?id='+$stateParams.id,
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
                          3 : { "type" : "select", values:[{"value":"Yes","label":"Yes"}, {"value":"No","label":"No"}]},
                      })
                      
                      .withOption('processing', true)
                      .withOption('serverSide', true)
                      
                      .withOption('iDisplayLength', 10) ////set 6 line comments to hide all datatables options
                      .withOption('scrollX', true)
                      .withOption('scrollY', getDataTableHeight())
                      .withOption('scrollCollapse', true)
                      .withOption('aaSorting', [4, 'desc']) //Sort by ID Desc
                      .withPaginationType('full_numbers'); ////
                      
                      /*.withOption('lengthChange', false) ////remove 4 line comments to hide all datatables options
                      .withOption('paging', false)
                      .withOption('searching', false)
                      .withOption('bInfo', false);*/
                          
                      vm.dtColumnDefs = [
						DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable()
						.renderWith(function(data, type, full, meta) {
						  vm.selected[full[0]] = false;
						  return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
						}).notVisible(),
						DTColumnDefBuilder.newColumnDef(1).withTitle('Name').renderWith(BuyerDetail),
						DTColumnDefBuilder.newColumnDef(2).withTitle('Totat Products Viewed').notSortable(),
						DTColumnDefBuilder.newColumnDef(3).withTitle('Is Catalog Viewed').notSortable(),
						DTColumnDefBuilder.newColumnDef(4).withTitle('Viewed Time'),
						DTColumnDefBuilder.newColumnDef(5).withTitle('Auto-Share').notSortable(),
                        DTColumnDefBuilder.newColumnDef(6).withTitle('Action').notSortable()
                            .renderWith(function(data, type, full, meta) {
                                var html = '<div><a class="btn btn-primary mt-lg" href="#/app/buyer-detail/?id='+full[6]+'&name='+full[1]+'">Set Buyer Discount</a></div>';
                                return html
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
