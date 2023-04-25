
(function() {
    'use strict';

    angular
        .module('app.resellerpayoutsitems')
        .controller('ResellerPayoutsControllerItems', ResellerPayoutsControllerItems);

    ResellerPayoutsControllerItems.$inject = ['$resource','$http','$httpParamSerializer',  'toaster', 'ngDialog', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', '$filter', 'ResellerPay', '$stateParams', 'Notification','NotificationEntity','NotificationTemplate'];
    function ResellerPayoutsControllerItems($resource, $http, $httpParamSerializer, toaster, ngDialog, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state,  $filter, ResellerPay, $stateParams, Notification,NotificationEntity,NotificationTemplate) {
        CheckAuthenticated.check();
        /*$.ajaxSetup({
            headers : {
              'Authorization' : 'Bearer '+$auth.getToken()
            }
        });*/
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


        $scope.company_id = 0;
        if(localStorage.hasOwnProperty("company")){
            $scope.company_id = localStorage.getItem('company');
        }
        $scope.is_staff = localStorage.hasOwnProperty("is_staff");

        console.log($scope.company_id);
        console.log($scope.is_staff);

        //createorder start
        vm.CloseDialog = function() {
            ngDialog.close();
        };

        $scope.order = {};



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


        $scope.splitExtra =  function(extra_notifiers) {
          $scope.extra_count = extra_notifiers.split(',').length
        }


        vm.selected = {};
        vm.selectedFullJson = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.count = 1;
        vm.dtInstance = {};

        $scope.update_flag = false;

        $scope.alrt = function () {alert("called");};


        var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';

        /*function reloadData() {
            var resetPaging = false;
            vm.dtInstance.reloadData(callback, resetPaging);
        }*/

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

        function imageHtml(data, type, full, meta){
          return '<img src="'+full[5]+'" style="width: 100px; height: 100px"/>';
        }

        function TitleLink(data, type, full, meta){
          return '<a href="#/app/cart-detail/?id='+full[0]+'" target=_blank>'+full[0]+'</a>';
        }

        function DataFormating(data, type, full, meta){


          return '<p style="cursor: pointer;">'+data+'</p>';
        }

       function OrderLink(data, type, full, meta){
          return '<a href="#/app/order-detail/?type=salesorders&id='+full[3]+'&name='+full[3]+'" target=_blank>'+full[3]+'</a>';
        }

        vm.datatables_url = 'api/resellersettlementitems/?settlement_id='+$stateParams.settlement_id;

        vm.dtOptions = DTOptionsBuilder.newOptions()
                      .withOption('ajax', {
                          url: vm.datatables_url,
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
                            3 : { "type" : "text"},
                            4 : { "type" : "text"},
                            8 :  { "type" : "select", values:[{"value":"Draft","label":"Draft"}, {"value":"Cart","label":"Cart"}, {"value":"Cart,Draft","label":"Cart or Draft"}, {"value":"COD Verification Pending","label":"COD Verification Pending"}, {"value":"Field Verification Pendin","label":"Field Verification Pendin"}, {"value":"Pending","label":"Pending"}, {"value":"Accepted","label":"Accepted"}, {"value":"In Progress","label":"In Progress"}, {"value":"Accepted,In Progress","label":"Accepted or In Progress"}, {"value":"Dispatched","label":"Dispatched"}, {"value":"Partially Dispatched","label":"Partially Dispatched"}, {"value":"Delivered","label":"Delivered"}, {"value":"Cancelled","label":"Cancelled"}, {"value":"Transferred","label":"Transferred"}, {"value":"Closed","label":"Closed"}, {"value":"Dispatched,Delivered,Closed","label":"Dispatched,Delivered,Closed"}]},
                            11 : { "type" : "dateRange"},
                        })

					  .withOption('lengthMenu', [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]])
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
                          //'copy',
                          //'print',
                          //'excel',
                          //'csv',
							{
								extend: 'copy',
								title: 'Orders',
								exportOptions: {
									columns: "thead th:not(.noExport)"
								}
							},{
								extend: 'print',
								title: 'Orders',
								exportOptions: {
									columns: "thead th:not(.noExport)"
								}
							},{
								extend: 'pdf',
								title: 'Orders',
								exportOptions: {
									columns: "thead th:not(.noExport)"
								}
							},{
								extend: 'excel',
								title: 'Orders',
								exportOptions: {
									columns: "thead th:not(.noExport)"
								}
							}, {
								extend: 'csv',
								title: 'Orders',
								exportOptions: {
									columns: "thead th:not(.noExport)"
									//columns: ':visible'
								}
							},

              ]);
//'id','id','request_type','order_id', 'order__processing_status', 'items','request_reason__display','request_reason_text','request_status'
                      vm.dtColumnDefs = [
                            DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable().withClass('noExport')
                            .renderWith(function(data, type, full, meta) {
                              vm.selected[full[0]] = false;
                              vm.selectedFullJson[full[0]] = full;
                              return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
                            }),
                            DTColumnDefBuilder.newColumnDef(1).withTitle('json').notVisible(),
                            DTColumnDefBuilder.newColumnDef(2).withTitle('ID'),
                            DTColumnDefBuilder.newColumnDef(3).withTitle('Order').renderWith(OrderLink),
                            DTColumnDefBuilder.newColumnDef(4).withTitle('Invoice ID'),
                            DTColumnDefBuilder.newColumnDef(5).withTitle('Wishbook Price').notSortable(),
                            DTColumnDefBuilder.newColumnDef(6).withTitle('Reseller Price').notSortable(),//.renderWith(filterDate),
                            DTColumnDefBuilder.newColumnDef(7).withTitle('Reseller Margin').notSortable().withOption('sWidth','20%'),
                            DTColumnDefBuilder.newColumnDef(8).withTitle('Order Status').notSortable(),
                            DTColumnDefBuilder.newColumnDef(9).withTitle('Invoice Status').notSortable(),
                            DTColumnDefBuilder.newColumnDef(10).withTitle('Total Margin').notSortable().withOption('sWidth','30%'),
                            // DTColumnDefBuilder.newColumnDef(9).withTitle('Extra Prepaid Amt').notSortable().withOption('sWidth','30%'),
                            DTColumnDefBuilder.newColumnDef(11).withTitle('Dispatch Date').notSortable(),

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
