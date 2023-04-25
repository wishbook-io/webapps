(function() {
    'use strict';

    angular
        .module('app.suppliers')
        .controller('SupplierDetailController', SupplierDetailController);

    SupplierDetailController.$inject = ['$resource', 'Suppliers', 'grouptype', 'Company', 'ngDialog', 'toaster', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', '$filter', '$stateParams', 'SweetAlert'];
    function SupplierDetailController($resource, Suppliers, grouptype, Company, ngDialog, toaster, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, $filter, $stateParams, SweetAlert) {
        CheckAuthenticated.check();        
        
        var vm = this;
        $scope.company_id = localStorage.getItem('company'); 
        $scope.is_staff   = localStorage.getItem('is_staff');
        $scope.groupType = grouptype.query();
        
        var suppliercompanyid = parseInt($stateParams.id);
        
        $scope.supplier = {};

        Suppliers.query({"company": suppliercompanyid, "cid": $scope.company_id},
          function (success){
              console.log(JSON.stringify(success[0]));
              $scope.supplier = success[0];
              $scope.supplier.fix_amount = parseFloat(success[0].fix_amount);
              $scope.supplier.percentage_amount = parseFloat(success[0].percentage_amount);
              $scope.supplier.brokerage_fees = parseFloat(success[0].brokerage_fees);
              $scope.supplier_brokerage_fees = $scope.supplier.brokerage_fees
          });

        Company.get({"id": suppliercompanyid},
          function (success){
              console.log(JSON.stringify(success));
              $scope.suppliercompanydetail = success;
          });
        
        $scope.Update = function(){
          
            $scope.supplier['cid'] = $scope.company_id;
            Suppliers.patch($scope.supplier,
            function(success){  
                    $scope.supplier_brokerage_fees = $scope.supplier.brokerage_fees                  
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Supplier details updated successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    reloadData();
                    $scope.order = {};
              })
        }   
        
        
        
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
          return '<img src="'+full[3]+'" style="width: 100px; height: 100px"/>';
        }
        
        function filterDate (row, data, full, meta) {
          return $filter('date')(row, 'yyyy-MM-dd')+" : "+$filter('date')(row, 'h: mm a');
        }
        
        function TitleLink(data, type, full, meta){
          return '<a href="#/app/order-detail/?type=purchaseorders&id='+full[0]+'&name='+full[1]+'">'+full[1]+'</a>';
        }
        
        function SupplierDetail(data, type, full, meta){
          return '<div class="col-md-6"><a ng-click="OpenSupplier('+full[0]+')">'+full[3]+'</a></div>';
        }
        
        vm.dtOptions = DTOptionsBuilder.newOptions()
                      .withOption('ajax', {
                          url: 'api/purchaseorderdatatables1/?selling_company='+$stateParams.id,
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
                            6 : { "type" : "select", values:[{"value":"Pending","label":"Pending"}, {"value":"Placed","label":"Placed"}, {"value":"Paid","label":"Paid"}, {"value":"Payment Confirmed","label":"Payment Confirmed"}]},//{"value":"Draft","label":"Draft"}, {"value":"Cancelled","label":"Cancelled"}
                            7 : { "type" : "select", values:[{"value":"Pending","label":"Pending"}, {"value":"Accepted","label":"Accepted"}, {"value":"In Progress","label":"In Progress"}, {"value":"Dispatched","label":"Dispatched"}, {"value":"Delivered","label":"Delivered"}, {"value":"Cancelled","label":"Cancelled"}, {"value":"Closed","label":"Closed"}]},
                            //8 : { "type" : "text"},
                            
                        })
                      
                      .withOption('processing', true)
                      .withOption('serverSide', true)
                      .withOption('iDisplayLength', 10)
                      //.withOption('responsive', true)
                      .withOption('scrollX', true)
                      .withOption('scrollY', getDataTableHeight())
                      .withOption('scrollCollapse', true)
                      .withOption('aaSorting', [0, 'desc']) //Sort by ID Desc
                      
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
                                }).notVisible(),
                          
                            DTColumnDefBuilder.newColumnDef(1).withTitle('Order No.').renderWith(TitleLink),
                            DTColumnDefBuilder.newColumnDef(2).withTitle('Date & Time'),//.renderWith(filterDate),
                            //DTColumnDefBuilder.newColumnDef(2).notVisible(),
                            DTColumnDefBuilder.newColumnDef(3).withTitle('Supplier').renderWith(SupplierDetail),
                            DTColumnDefBuilder.newColumnDef(4).withTitle('No. of Items').notSortable(),
                            DTColumnDefBuilder.newColumnDef(5).withTitle('Total (Rs.)').notSortable(),
                            DTColumnDefBuilder.newColumnDef(6).withTitle('Payment Status'),
                            DTColumnDefBuilder.newColumnDef(7).withTitle('Processing Status'),
                       

                           /* DTColumnDefBuilder.newColumnDef(8).withTitle('Action').notSortable()//.withOption('width', '25%')
                                .renderWith(function(data, type, full, meta) {
                                   
                                    if(full[7].indexOf('Cancelled') > -1 || full[6].indexOf('Cancelled') > -1)//full[8].indexOf('Dispatched') > -1  || 
                                    {
                                        return '&nbsp;';
                                    }
                                    
                                    var htmlbutton = ''
                                    if(full[6] == 'Draft')
                                    {
                                        htmlbutton += '<div><button type="button" ng-click="Finalize('+full[0]+')" class="btn btn-block btn-primary mt-lg">Finalize</button></div>';     
                                    }
                                    if(full[6] == 'Pending' || full[6] == 'Placed')
                                    {
                                        htmlbutton += '<div><button type="button" ng-click="OpenPay('+full[0]+')" class="btn btn-block btn-primary mt-lg">Pay</button></div>';     
                                    }
                                    if(full[7] == 'Pending' || full[7] == 'Accepted')
                                    {
                                        htmlbutton += '<div><button type="button" ng-click="OpenCancelPurchaseOrder('+full[0]+', \'purchase\')" class="btn btn-block btn-danger mt-lg">Cancel</button></div> ';
                                    }
                                    
                                    if(htmlbutton == '')
                                        return '&nbsp;';
                                    else
                                        return htmlbutton;

                                })*/
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
