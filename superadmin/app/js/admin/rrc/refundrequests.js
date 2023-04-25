/*start - form wizard */
(function() {
    'use strict';
    angular
        .module('app.refundrequests')
        .directive('formWizard', formWizard);

         formWizard.$inject = ['$parse'];

    function formWizard ($parse) {
        var directive = {
            link: link,
            restrict: 'A',
            scope: true
        };
        return directive;

        function link(scope, element, attrs) {
          var validate = $parse(attrs.validateSteps)(scope),
              wiz = new Wizard(attrs.steps, !!validate, element);
          scope.wizard = wiz.init();
        }

        function Wizard (quantity, validate, element) {

          var self = this;
          self.quantity = parseInt(quantity,10);
          self.validate = validate;
          self.element = element;

          self.init = function() {
            self.createsteps(self.quantity);
            self.go(1); // always start at fist step
            return self;
          };

          self.go = function(step) {

            if ( angular.isDefined(self.steps[step]) ) {

              if(self.validate && step !== 1) {
                var form = $(self.element),
                    group = form.children().children('div').get(step - 2);

                if (false === form.parsley().validate( group.id )) {
                  return false;
                }
              }

              self.cleanall();
              self.steps[step] = true;
            }
          };

          self.active = function(step) {
            return !!self.steps[step];
          };

          self.cleanall = function() {
            for(var i in self.steps){
              self.steps[i] = false;
            }
          };

          self.createsteps = function(q) {
            self.steps = [];
            for(var i = 1; i <= q; i++) self.steps[i] = false;
          };

        }
    }
})();

/* End - form wizard */





(function() {
    'use strict';

    angular
        .module('app.refundrequests')
        .controller('RefundRequestsController', RefundRequestsController);

    RefundRequestsController.$inject = ['$resource','$http','$httpParamSerializer',  'toaster', 'ngDialog', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', '$filter', 'SalesOrders', 'Company', 'PurchaseOrders', 'Warehouse', 'OrderInvoice', 'sharedProperties', '$stateParams', 'Refund'];
    function RefundRequestsController($resource, $http, $httpParamSerializer, toaster, ngDialog, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state,  $filter, SalesOrders, Company, PurchaseOrders, Warehouse, OrderInvoice, sharedProperties, $stateParams, Refund) {
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

   /*     function imageHtml(data, type, full, meta){
          return '<img src="'+full[5]+'" style="width: 100px; height: 100px"/>';
        }

        function TitleLink(data, type, full, meta){
          return '<a href="#/app/cart-detail/?id='+full[0]+'" target=_blank>'+full[0]+'</a>';
        }  */
        function TitleLink(data, type, full, meta){
          return '<a href="#/app/order-detail/?type=salesorders&id='+full[4]+'&name='+full[4]+'" target=_blank>'+full[4]+'</a>';
        }

        function DataFormating(data, type, full, meta){
          return '<p style="cursor: pointer;">'+data+'</p>';
        }
        $scope.openBankdetails = function () {
            ngDialog.open({
                template: 'updatebankdetails',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };



        /* function SupplierDetail(data, type, full, meta){
          return '<div class="col-md-6"><a ng-click="OpenCompany('+full[1]['selling_company_id']+')">'+full[6]+'</a></div>';
        }  */

        $scope.bank_details = {};
        $scope.DoRefund = function(rid,subresource){
          console.log("called");
          $scope.refundrequest_id = rid;
          console.log(subresource);
          $scope.subresource = subresource;
          console.log(vm.selectedFullJson[rid][1]);
          console.log(vm.selectedFullJson[rid][1]['bankdetail'].account_number);

          console.log(JSON.stringify(vm.selectedFullJson[rid][1]['bankdetail']));
          ngDialog.open({
                template: 'confirmation-dialog-refund',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        }

         $scope.SubmitRefund = function(){
          console.log($scope.subresource);
          var rid = $scope.refundrequest_id;
          console.log(vm.selectedFullJson[rid][1]);
          console.log(vm.selectedFullJson[rid][1]['bankdetail'].account_number);

          console.log(JSON.stringify(vm.selectedFullJson[rid][1]['bankdetail']));
              $scope.bank_details = {};
              if(vm.selectedFullJson[rid][1]['bank_popup'] ==  true)
              {
                  if(vm.selectedFullJson[rid][1]['bankdetail'].account_number != undefined)
                  {
                    $scope.bank_details.account_number = vm.selectedFullJson[rid][1]['bankdetail'].account_number;
                    $scope.bank_details.account_name = vm.selectedFullJson[rid][1]['bankdetail'].account_name;
                    $scope.bank_details.bank_name = vm.selectedFullJson[rid][1]['bankdetail'].bank_name;
                    $scope.bank_details.account_type = vm.selectedFullJson[rid][1]['bankdetail'].account_type;
                    $scope.bank_details.ifsc_code = vm.selectedFullJson[rid][1]['bankdetail'].ifsc_code;
                    $scope.bank_details.phone_no = vm.selectedFullJson[rid][1]['bankdetail'].phone_no;
                    $scope.bank_details.email = vm.selectedFullJson[rid][1]['bankdetail'].email;
                    $scope.bank_details.street_address = vm.selectedFullJson[rid][1]['bankdetail'].street_address;
                  }
                  ngDialog.close();
                  $scope.openBankdetails();
              }
              else{
                  $(".refund-dialog").addClass(progressLoader());
                  Refund.save({'id': $scope.refundrequest_id, 'sub_resource': $scope.subresource }, function(success){
                      vm.successtoaster = {
                                  type:  'success',
                                  title: 'Success',
                                  text:  'Refund initiated successfully.'
                              };
                      toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                      $scope.reloadData();
                      ngDialog.close();
                      $(".refund-dialog").removeClass(progressLoader());
                  });
              }
        }
        $scope.DoRefundAllToWBmoney = function(rid){
          $scope.refundrequest_id = rid;

          console.log(vm.selectedFullJson[rid][1]);
          console.log(vm.selectedFullJson[rid][1]['bankdetail'].account_number);

          console.log(JSON.stringify(vm.selectedFullJson[rid][1]['bankdetail']));
          ngDialog.open({
                template: 'confirmation-dialog-refund-wbmoney',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        }
        $scope.SubmitRefundAllToWBmoney = function(){
          $(".refund-wbmoney-dialog").addClass(progressLoader());
          console.log($scope.bank_details);
          Refund.save({'id': $scope.refundrequest_id, 'sub_resource': 'refund-to-wbmoney' }, function(success){
                      vm.successtoaster = {
                                  type:  'success',
                                  title: 'Success',
                                  text:  'Refund all to WBmoney initiated successfully.'
                              };
                      toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                      $scope.reloadData();
                      ngDialog.close();
                      $(".refund-wbmoney-dialog").removeClass(progressLoader());
                  });
        }
        $scope.DoReject = function(rid){
          $scope.refundrequest_id = rid;
            ngDialog.open({
                template: 'confirmation-dialog-reject',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        }

        $scope.SubmitReject = function(){
          $(".reject-dialog").addClass(progressLoader());
              Refund.patch({'id': $scope.refundrequest_id, 'refund_status': 'rejected' }, function(success){
                  vm.successtoaster = {
                              type:  'success',
                              title: 'Success',
                              text:  'Refund request rejected successfully.'
                          };
                  toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                  $scope.reloadData();
                  ngDialog.close();
                  $(".reject-dialog").removeClass(progressLoader());
              });
        }

        $scope.submitBankDetailsAndRefund = function(){
          $(".bank-dialog").addClass(progressLoader());
          console.log($scope.bank_details);
          Refund.save({'id': $scope.refundrequest_id, 'sub_resource': 'auto-refund', 'bankdetail': $scope.bank_details }, function(success){
                      vm.successtoaster = {
                                  type:  'success',
                                  title: 'Success',
                                  text:  'Refund initiated successfully.'
                              };
                      toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                      $scope.reloadData();
                      ngDialog.close();
                      $(".bank-dialog").removeClass(progressLoader());
                  });
        }

        $scope.CheckStatus = function(rid){
          $(".datatable-loader").addClass(progressLoader());
          console.log(rid);
          Refund.save({'id': rid, 'sub_resource': 'transfer-status' }, function(success){
           //   angular.forEach(success, function(value, key) {
                    vm.successtoaster = {
                                type:  'success',
                                title: 'Message',
                                text:  success.message
                            };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    $scope.reloadData();
                    $(".datatable-loader").removeClass(progressLoader());
               //   });
              });


        }


        vm.datatables_url = 'api/refunddatatables/';

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
                            3 : { "type" : "select", values:[{"value":"return","label":"return(customer return)"},{"value":"rto","label":"return(rto)"}, {"value":"cancellation","label":"cancellation"}]}, 
                            4 : { "type" : "text"},
                            5 : { "type" : "text"},
                            10 : { "type" : "select", values:[{"value":"issued","label":"issued"}, {"value":"requested","label":"requested"}, {"value":"failed","label":"failed"}, {"value":"rejected","label":"rejected"}, {"value":"pending","label":"pending"}]},
                            11 : { "type" : "select", values:[{"value":"cashfree","label":"cashfree"}, {"value":"wbmoney","label":"wbmoney"}, {"value":"bank","label":"bank"}, {"value":"creditline","label":"creditline"}, {"value":"wbmoney & creditline","label":"wbmoney & creditline"}, {"value":"wbmoney & cashfree","label":"wbmoney & cashfree"}, {"value":"wbmoney & bank","label":"wbmoney & bank"}]},

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
//['id','id','refund_cause','order_id','rrc_id','total_amount', 'requested_amount', 'paid_amount','refundable_amount','refund_status','refund_mode','refund_details']
              vm.dtColumnDefs = [
                            DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable().withClass('noExport')
                            .renderWith(function(data, type, full, meta) {
                              vm.selected[full[0]] = false;
                              vm.selectedFullJson[full[0]] = full;
                              return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
                            }),
                            DTColumnDefBuilder.newColumnDef(1).withTitle('json').notVisible(),
                            DTColumnDefBuilder.newColumnDef(2).withTitle('ID'),
                            DTColumnDefBuilder.newColumnDef(3).withTitle('Request type'),
                            DTColumnDefBuilder.newColumnDef(4).withTitle('Order ID').renderWith(TitleLink),
                            DTColumnDefBuilder.newColumnDef(5).withTitle('RRC ID'),

                            DTColumnDefBuilder.newColumnDef(6).withTitle('Total amount'),
                            DTColumnDefBuilder.newColumnDef(7).withTitle('Requested amount'),//.renderWith(filterDate),
                            DTColumnDefBuilder.newColumnDef(8).withTitle('Paid amount').notSortable(),//.withOption('sWidth','20%'),
                            DTColumnDefBuilder.newColumnDef(9).withTitle('Refundable amount').notSortable(),//.withOption('sWidth','20%'),
                            DTColumnDefBuilder.newColumnDef(10).withTitle('Refund Status').notSortable(),//.withOption('sWidth','20%'),
                            DTColumnDefBuilder.newColumnDef(11).withTitle('Refund mode'),
                            DTColumnDefBuilder.newColumnDef(12).withTitle('Refund details').notSortable(),
                            DTColumnDefBuilder.newColumnDef(13).withTitle('Payment Method').notSortable(),
                            DTColumnDefBuilder.newColumnDef(14).withTitle('Modified By').notSortable(),
                            DTColumnDefBuilder.newColumnDef(15).withTitle('Modified At').notSortable(),
                            DTColumnDefBuilder.newColumnDef(16).withTitle('Cancellation Reason').notSortable(),
                            DTColumnDefBuilder.newColumnDef(17).withTitle('Actions').notSortable().withClass('noExport')//.withOption('width', '25%')
                              .renderWith(function(data, type, full, meta) {
                                  var htmlbutton = '';

                                  if(full[10] == 'pending') {
                                     htmlbutton += '<div><button type="button" ng-click="CheckStatus('+full[0]+')" class="btn btn-block btn-primary mt-lg">Check Status</button></div>';
                                    return htmlbutton;
                                  }

                                  if(full[10] == 'failed') {
                                    htmlbutton += '<div><button type="button" ng-click="DoRefund('+full[0]+','+'\'auto-refund\''+')" class="btn btn-block btn-primary mt-lg">Retry Refund</button></div>';
                                  }

                                  if(full[10] == 'requested') {
                                    htmlbutton += '<div><button type="button" ng-click="DoRefund('+full[0]+','+'\'auto-refund\''+')" class="btn btn-block btn-primary mt-lg">Refund</button></div>';
                                  }

                                  if(full[1]['all_wb_money'] == true && full[10] == 'requested' || full[10] == 'failed') {
                                    htmlbutton += '<div><button type="button" ng-click="DoRefundAllToWBmoney('+full[0]+')" class="btn btn-block btn-primary mt-lg">Refund all to WB Money</button></div>';
                                  }

                                  if(full[10] != 'rejected' && full[10] != 'issued'){
                                    htmlbutton += '<div><button type="button" ng-click="DoReject('+full[0]+')" class="btn btn-block btn-danger mt-lg">Reject</button></div>';
                                  }
                                  return htmlbutton;

                                  /* else if(full[10] == 'cashfree' && full[9] != 'rejected') {
                                    htmlbutton += '<div><button type="button" ng-click="DoRefund('+full[0]+','+'\'refund-through-gateway\''+')" class="btn btn-block btn-primary mt-lg">Refund through Cashfree</button></div>';
                                  }
                                  else if(full[10] == 'creditline' && full[9] != 'rejected') {
                                    htmlbutton += '<div><button type="button" ng-click="DoRefund('+full[0]+','+'\'refund-credit-balance\''+')" class="btn btn-block btn-primary mt-lg">Refund to Credit</button></div>';
                                  }
                                  else if(full[10] == 'bank' && full[9] != 'rejected') {
                                    htmlbutton += '<div><button type="button" ng-click="DoRefund('+full[0]+','+'\'refund-to-bank\''+')" class="btn btn-block btn-primary mt-lg">Refund to Bank</button></div>';
                                  } */
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
