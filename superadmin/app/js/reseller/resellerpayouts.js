
(function() {
    'use strict';

    angular
        .module('app.resellerpayouts')
        .controller('ResellerPayoutsController', ResellerPayoutsController);

    ResellerPayoutsController.$inject = ['$resource','$http','$httpParamSerializer',  'toaster', 'ngDialog', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', '$filter', 'ResellerPay', '$stateParams','Notification','NotificationEntity','NotificationTemplate'];
    function ResellerPayoutsController($resource, $http, $httpParamSerializer, toaster, ngDialog, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state,  $filter, ResellerPay, $stateParams,Notification,NotificationEntity,NotificationTemplate) {
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

        function Oderlinks(data, type, full, meta) {
            var htmlbutton = '';
            var POids = full[5];
            if (POids.length > 0) {
                console.log(POids);
                for (var index = 0; index < POids.length; index++) {
                    htmlbutton += '<div><a href="#/app/order-detail/?type=salesorders&id=' + POids[index].invoice__order + '&name=' + POids[index].invoice__order + '" target=_blank >' + POids[index].invoice__order+'(O-'+ POids[index].invoice__order__processing_status + ',I-' + POids[index].invoice__status + ')'  + '</a></div>';
                }
            }

            return htmlbutton;
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

        $scope.bank_details = {};
        $scope.PayBalance =  function(rpid,pay_amount,via_wbmoney=false){
          $scope.reseller_pay_id = rpid;
          vm.pay_amount = pay_amount;
          vm.max_pay_amount = pay_amount;
          $scope.bank_details = {};
          if (via_wbmoney) {
            console.log("paying via_wbmoney");
            ngDialog.open({
                template: 'confirmation-dialog-wbmoney',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
          }
          else {
            if(vm.selectedFullJson[rpid][1]['bankdetail'].account_number != undefined)
            {
              $scope.bank_details.account_number = vm.selectedFullJson[rpid][1]['bankdetail'].account_number;
              $scope.bank_details.account_name = vm.selectedFullJson[rpid][1]['bankdetail'].account_name;
              $scope.bank_details.bank_name = vm.selectedFullJson[rpid][1]['bankdetail'].bank_name;
              $scope.bank_details.account_type = vm.selectedFullJson[rpid][1]['bankdetail'].account_type;
              $scope.bank_details.ifsc_code = vm.selectedFullJson[rpid][1]['bankdetail'].ifsc_code;
              $scope.bank_details.phone_no = vm.selectedFullJson[rpid][1]['bankdetail'].phone_no;
              $scope.bank_details.email = vm.selectedFullJson[rpid][1]['bankdetail'].email;
              $scope.bank_details.street_address = vm.selectedFullJson[rpid][1]['bankdetail'].street_address;
            }
            ngDialog.open({
                template: 'paybalance-dialog',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
          }
        }

        $scope.submitResellerPay = function(){
          console.log($scope.reseller_pay_id);
          //console.log($scope.bank_details);
          console.log(vm.pay_amount);
          //console.log(vm.bankForm);
          console.log(vm.bankForm.$valid);
          if(vm.bankForm.$valid){
            $(".bank-dialog").addClass(progressLoader());
            ResellerPay.save({'settlement_id': $scope.reseller_pay_id, 'pay_amount': vm.pay_amount, 'bankdetail': $scope.bank_details}, function(success){
                vm.successtoaster = {
                            type:  'success',
                            title: 'Success',
                            text:  'Reseller Payment initiated successfully.'
                        };
                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                $scope.reloadData();
                ngDialog.close();
                $(".bank-dialog").removeClass(progressLoader());
            });
          }
        }


        $scope.submitResellerWBMoney = function(){
          $(".reject-dialog").addClass(progressLoader());
          ResellerPay.save({'settlement_id': $scope.reseller_pay_id, 'pay_amount': vm.pay_amount, 'via_wbmoney': true }, function(success){
              vm.successtoaster = {
                          type:  'success',
                          title: 'Success',
                          text:  'Reseller Payment sent to WBMoney successfully.'
                      };
              toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
              $scope.reloadData();
              ngDialog.close();
              $(".reject-dialog").removeClass(progressLoader());
          });
        }

        $scope.submitBulkResellerPay = function(){
          console.log($scope.r_ids);
          //console.log($scope.bank_details);
          //console.log(vm.bankForm);
      //    if(vm.bankForm.$valid){
            $(".datatable-loader").addClass(progressLoader());
            //ResellerPay.save({'settlement_ids': $scope.r_ids, 'settlement_id': $scope.r_ids[0], 'bulk_pay': true, 'bankdetail': $scope.bank_details}, function(success){
              ResellerPay.save({'settlement_ids': $scope.r_ids, 'settlement_id': $scope.r_ids[0], 'bulk_pay': true, 'bankdetail': {} }, function(success){
                /*vm.successtoaster = {
                            type:  'success',
                            title: 'Success',
                            text:  'Resellers Bulk Payment initiated successfully.'
                        };
                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);*/
                $scope.reloadData();
                ngDialog.close();
                console.log(success.result);
                $scope.responses = success.result;
                ngDialog.open({
                    template: 'bulk_pay_response_dialog',
                    scope: $scope,
                    className: 'ngdialog-theme-default',
                    closeByDocument: false
                });

                $(".datatable-loader").removeClass(progressLoader());
            });
      //    } end : if bankform valid
        }
        $scope.bulk_pay_flag = false;
        vm.OpenBulkPay = function () {
            var true_count = 0;
            console.log(vm.selected);
            const allEqual = arr => arr.every( v => v === arr[0] );
            var cmp_array = [];
            var r_ids = [];
            angular.forEach(vm.selected, function (value, key) {
                if (value == true) {
                    true_count++;
                    vm.true_key = parseInt(key);
                    r_ids.push(vm.true_key);
                    console.log(vm.selectedFullJson[key][4]);
                    cmp_array.push(vm.selectedFullJson[key][4])
                }
            })
            //if (true_count > 0 && allEqual(cmp_array)) {
              if (true_count > 0 ) {
                $scope.bulk_pay_flag = true;
                console.log('okkkkkk');
                $scope.bank_details = {};
                $scope.r_ids = r_ids;
              /*  var rpid = $scope.r_ids[0];
                if(vm.selectedFullJson[rpid][1]['bankdetail'].account_number != undefined)
                {
                  $scope.bank_details.account_number = vm.selectedFullJson[rpid][1]['bankdetail'].account_number;
                  $scope.bank_details.account_name = vm.selectedFullJson[rpid][1]['bankdetail'].account_name;
                  $scope.bank_details.bank_name = vm.selectedFullJson[rpid][1]['bankdetail'].bank_name;
                  $scope.bank_details.account_type = vm.selectedFullJson[rpid][1]['bankdetail'].account_type;
                  $scope.bank_details.ifsc_code = vm.selectedFullJson[rpid][1]['bankdetail'].ifsc_code;
                  $scope.bank_details.phone_no = vm.selectedFullJson[rpid][1]['bankdetail'].phone_no;
                  $scope.bank_details.email = vm.selectedFullJson[rpid][1]['bankdetail'].email;
                  $scope.bank_details.street_address = vm.selectedFullJson[rpid][1]['bankdetail'].street_address;
                }
                ngDialog.open({
                    template: 'paybalance-dialog',
                    scope: $scope,
                    className: 'ngdialog-theme-default',
                    closeByDocument: false
                }); */
                $scope.submitBulkResellerPay();
            }
            else {
                vm.errortoaster = {
                    type: 'error',
                    title: 'Failed',
                    text: 'Please select at least one row.'
                };

                //toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);

                $.notify({
                    title: "Failed",
                    message: "Please select at least one row.",
                },
                    {
                        type: 'info',
                        placement: {
                            from: 'bottom',
                            align: 'right'
                        }
                    });

                setTimeout(function () {
                    $('.uk-notify').fadeout();
                }, 1000);
            }
        }
        function TransactionDetailsText(data, type, full, meta) {
            var tdetails = ''
            if (full[13].length > 0) {
                for (var i = 0; i < full[13].length; i++) {
                  if(i == 0)
                    tdetails = 'id:' + full[13][i].id + ',amount: '+full[13][i].amount+', payment_date: '+full[13][i].payment_date+', message: '+full[13][i].message + ', status: '+full[13][i].status+', utr: '+full[13][i].utr;
                  else
                    tdetails = tdetails + '<br>id:' + full[13][i].id + ',amount: '+full[13][i].amount+', payment_date: '+full[13][i].payment_date+', message: '+full[13][i].message + ', status: '+full[13][i].status+', utr: '+full[13][i].utr;
                }
                return tdetails;
            }
            else {
                return '';
            }
        }
        vm.datatables_url = 'api/resellersettlements/';

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
                            5 : { "type": "text" },
                            6 : { "type": "select", values: [{ "value": "positive", "label": "Positive" }, { "value": "negative", "label": "Negative" }] },
                            7: { "type": "dateRange", width: '100%' },
                            13: { "type": "dateRange", width: '100%' },
                        //    9 : { "type" : "select", values:[{"value":"Paid","label":"Paid"}, {"value":"Unpaid","label":"Unpaid"}]},
                            12 : { "type" : "select", values:[{"value":"Yes","label":"Yes"}, {"value":"No","label":"No"},{"value":"today_updated","label":"Today Updated"}]},
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
                            text: 'Bulk Pay',
                            key: '1',
                            className: 'green',
                            action: function (e, dt, node, config) {
                                // alert(JSON.stringify(vm.selected));
                                vm.OpenBulkPay();
                            }
                        },
                        {
                            extend: 'copy',
                            title: 'ResellerPayouts',
                            exportOptions: {
                                columns: "thead th:not(.noExport)"
                            }
                        },{
                            extend: 'print',
                            title: 'ResellerPayouts',
                            exportOptions: {
                                columns: "thead th:not(.noExport)"
                            }
                        },{
                            extend: 'pdf',
                            title: 'ResellerPayouts',
                            exportOptions: {
                                columns: "thead th:not(.noExport)"
                            }
                        },{
                            extend: 'excel',
                            title: 'ResellerPayouts',
                            exportOptions: {
                                columns: "thead th:not(.noExport)"
                            }
                        }, {
                            extend: 'csv',
                            title: 'ResellerPayouts',
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
                            DTColumnDefBuilder.newColumnDef(3).withTitle('Reseller Name'),
                            DTColumnDefBuilder.newColumnDef(4).withTitle('Company ID').notSortable(),
                            DTColumnDefBuilder.newColumnDef(5).withTitle('Order Ids').renderWith(Oderlinks).notSortable(),,
                            DTColumnDefBuilder.newColumnDef(6).withTitle('Settlement type').notSortable(),
                            DTColumnDefBuilder.newColumnDef(7).withTitle('Week'),
                            DTColumnDefBuilder.newColumnDef(8).withTitle('Total Reseller Amt'),//.renderWith(filterDate),
                            DTColumnDefBuilder.newColumnDef(9).withTitle('Total Wishbook Amt').withOption('sWidth','20%'),
                            DTColumnDefBuilder.newColumnDef(10).withTitle('Total Commission'),
                            DTColumnDefBuilder.newColumnDef(11).withTitle('Commission Paid').withOption('sWidth','30%'),
                            DTColumnDefBuilder.newColumnDef(12).withTitle('Bank Details').notSortable(),
                            DTColumnDefBuilder.newColumnDef(13).withTitle('Transaction Details').notSortable().renderWith(TransactionDetailsText),
                            DTColumnDefBuilder.newColumnDef(14).withTitle('Actions').notSortable().withClass('noExport')//.withOption('width', '25%')
                              .renderWith(function(data, type, full, meta) {
                                  var htmlbutton = '';

                                  //if(full[10] == 'pending') {
                                    var amount_tobe_paid = parseFloat(full[10]) - parseFloat(full[11]);
                                    if(amount_tobe_paid > 0 && full[6] == 'Positive'){
                                      htmlbutton += '<div><button type="button" ng-click="PayBalance('+full[0]+','+ amount_tobe_paid +')" class="btn btn-block btn-primary mt-lg">Pay Balance</button></div>';
                                      htmlbutton += '<div><button type="button" ng-click="PayBalance('+full[0]+','+ amount_tobe_paid +','+ true +')" class="btn btn-block btn-primary mt-lg">Via WBMoney</button></div>';
                                    }
                                    htmlbutton += '<div><a class="btn btn-primary mt-lg" href="/#/app/resellerpayoutsitems/?settlement_id='+full[0]+'">View Details</a></div>';
                                    return htmlbutton;
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
